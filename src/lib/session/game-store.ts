"use client";

// ============================================================
// Lapisan per-Game (permainan) — id pendek yang bisa di-share
// dan dilanjutkan lewat URL (/map/{gameCode}, /report/{gameCode}).
//
// Pola: snapshot + switch. Logika permainan yang ada tetap menulis
// kunci localStorage aktif (tenun-session/events/progress/...).
// Di sini kita menyimpan SNAPSHOT per game, membuat game baru, dan
// memuat game dari kode (lokal dulu, lalu Supabase).
// ============================================================

import {
  type Session,
  type SessionEvent,
  type PlayerInfo,
  getSession,
  getEvents,
  createNewSession,
} from "@/lib/session/session";
import { pullRemoteByGameCode } from "@/lib/supabase/sync";

export interface GameSummary {
  gameCode: string;
  name: string;
  startedAt: string;
  lastActiveAt: string;
  completedCount: number;
}

interface GameSnapshot {
  session: Session;
  events: SessionEvent[];
  progress: { completedIslands: string[] };
  assessment: unknown | null;
  player: PlayerInfo | null;
}

const GAMES_KEY = "tenun-games";
const ACTIVE_KEY = "tenun-game-active";
const SNAP_PREFIX = "tenun-snapshot-";

function read<T>(key: string, fallback: T): T {
  try {
    if (typeof localStorage === "undefined") return fallback;
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // abaikan
  }
}

/** Normalisasi kode: hilangkan spasi, jadikan huruf besar, pastikan berawalan TN-. */
export function normalizeGameCode(input: string): string {
  const clean = (input || "").trim().toUpperCase().replace(/\s+/g, "");
  return clean.startsWith("TN-") ? clean : `TN-${clean}`;
}

export function listGames(): GameSummary[] {
  return read<GameSummary[]>(GAMES_KEY, []);
}

export function getActiveGameCode(): string | null {
  const active = read<{ gameCode?: string }>(ACTIVE_KEY, {});
  if (active.gameCode) return active.gameCode;
  const s = getSession();
  return s.gameCode || null;
}

function updateRegistry(code: string, s: Session): void {
  const list = listGames().filter((g) => g.gameCode !== code);
  const name = s.player?.name || "Penjelajah";
  const completedCount = new Set(s.completedIslands).size;
  const summary: GameSummary = {
    gameCode: code,
    name,
    startedAt: s.startedAt,
    lastActiveAt: s.lastActiveAt,
    completedCount,
  };
  // urutkan: paling baru dulu
  list.unshift(summary);
  write(GAMES_KEY, list);
}

/** Simpan snapshot game aktif sekarang. Return gameCode atau null bila tak ada. */
export function saveActiveSnapshot(): string | null {
  const s = getSession();
  if (!s.id) return null;
  const code = s.gameCode || getActiveGameCode();
  if (!code) return null;
  const snapshot: GameSnapshot = {
    session: s,
    events: getEvents(),
    progress: read<{ completedIslands: string[] }>("tenun-progress", {
      completedIslands: [],
    }),
    assessment: read<unknown | null>("tenun-assessment", null),
    player: read<PlayerInfo | null>("tenun-player", null),
  };
  write(`${SNAP_PREFIX}${code}`, snapshot);
  updateRegistry(code, s);
  return code;
}

function restoreSnapshot(code: string, snap: GameSnapshot): void {
  write("tenun-session", snap.session);
  write("tenun-events", snap.events || []);
  write(
    "tenun-progress",
    snap.progress || { completedIslands: snap.session?.completedIslands || [] }
  );
  if (snap.assessment) write("tenun-assessment", snap.assessment);
  if (snap.player) write("tenun-player", snap.player);
  write(ACTIVE_KEY, { gameCode: code });
}

/** Mulai permainan baru dengan profil pemain. Return gameCode baru. */
export function newGame(player: PlayerInfo): string {
  saveActiveSnapshot(); // simpan game sebelumnya bila ada
  const s = createNewSession(player);
  write("tenun-progress", { completedIslands: [] });
  try {
    localStorage.removeItem("tenun-assessment");
  } catch {
    // abaikan
  }
  write(ACTIVE_KEY, { gameCode: s.gameCode });
  updateRegistry(s.gameCode!, s);
  saveActiveSnapshot(); // simpan snapshot game baru ini SEKARANG agar selalu bisa dilanjutkan
  return s.gameCode!;
}

/** Muat game dari kode (local lalu Supabase). Return true jika ditemukan. */
export async function loadGame(input: string): Promise<boolean> {
  const code = normalizeGameCode(input);
  saveActiveSnapshot();
  const snap = read<GameSnapshot | null>(`${SNAP_PREFIX}${code}`, null);
  if (snap && snap.session?.id) {
    restoreSnapshot(code, snap);
    return true;
  }
  try {
    const remote = await pullRemoteByGameCode(code);
    if (remote.session?.id) {
      const r = remote.session as Record<string, unknown>;
      const session: Session = {
        id: r.id as string,
        gameCode: (r.game_code as string) || code,
        startedAt: (r.started_at as string) || "",
        lastActiveAt: (r.last_active_at as string) || "",
        currentIsland: (r.current_island as string) || undefined,
        currentAct: typeof r.current_act === "number" ? (r.current_act as number) : undefined,
        xp: Number(r.xp || 0),
        level: Number(r.level || 1),
        completedIslands: Array.isArray(r.completed_islands)
          ? (r.completed_islands as string[])
          : [],
        badges: typeof r.badges === "string" ? (JSON.parse(r.badges) as string[]) : [],
        player: (r.player as PlayerInfo) || undefined,
      };
      restoreSnapshot(code, {
        session,
        events: remote.events || [],
        progress: { completedIslands: session.completedIslands },
        assessment: null,
        player: session.player || null,
      });
      return true;
    }
  } catch {
    // abaikan
  }
  return false;
}
