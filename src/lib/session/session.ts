"use client";

// ============================================================
// Lapisan Sesi & Data (client-side, persistent via localStorage)
//
// Tujuan:
//  - Setiap permainan punya sessionId unik agar bisa dilanjutkan
//    jika terputus di tengah jalan (resume).
//  - Semua aksi user dicatat sebagai event (termasuk salah klik),
//    sehingga seluruh data (asesmen, minigame, refleksi, waktu)
//    bisa diolah menjadi hasil yang nyata.
//  - Menghitung XP, level, dan lencana berdasarkan data nyata.
// ============================================================

export interface SessionEvent {
  id: string;
  t: string; // ISO timestamp
  type: string;
  [key: string]: unknown;
}

export interface PlayerInfo {
  name: string;
  characterId: string;
  motif?: string;
  origin?: string;
}

export interface Session {
  id: string;
  gameCode?: string; // kode pendek publik (mis. TN-7K3M9X) untuk share/lanjutkan
  classCode?: string; // kode kelas guru (mis. KL-7K3M9X) untuk integrasi Dashboard Guru
  startedAt: string;
  lastActiveAt: string;
  player?: PlayerInfo;
  // resume state
  currentIsland?: string;
  currentAct?: number;
  // progression
  completedIslands: string[];
  xp: number;
  level: number;
  badges: string[];
}

export const LEVELS = [
  { level: 1, title: "Pelaut Pemula", minXp: 0 },
  { level: 2, title: "Kadet Penjelajah", minXp: 150 },
  { level: 3, title: "Navigator Muda", minXp: 350 },
  { level: 4, title: "Sang Pemimpin Armada", minXp: 600 },
  { level: 5, title: "Laksamana Nusantara", minXp: 900 },
  { level: 6, title: "Legenda Nusantara", minXp: 1300 },
];

const SESSION_KEY = "tenun-session";
const EVENTS_KEY = "tenun-events";

// Sinkronisasi telemetri (no-op bila dimatikan / tanpa Supabase).
import { trackEvent, ensurePageHideFlush } from "@/lib/telemetry/tracker";

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "s-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}

/** Kode pendek publik (tanpa karakter mudah tertukar seperti 0/O, 1/I). */
export function makeGameCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "TN-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

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
    // abaikan (mis. storage penuh / private mode)
  }
}

/** Ambil level dari total XP. */
export function levelFromXp(xp: number): { level: number; title: string } {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.minXp) current = l;
    else break;
  }
  return { level: current.level, title: current.title };
}

/** Normalisasi kode kelas guru: hilangkan spasi, jadikan huruf besar. */
export function normalizeClassCode(input: string): string {
  return (input || "").trim().toUpperCase().replace(/\s+/g, "");
}

/** Buat sesi baru yang bersih (dipakai "Mulai Baru" / game baru). */
export function createNewSession(player?: PlayerInfo, classCode?: string): Session {
  const s: Session = {
    id: uuid(),
    gameCode: makeGameCode(),
    classCode,
    startedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    player,
    completedIslands: [],
    xp: 0,
    level: 1,
    badges: [],
  };
  write(SESSION_KEY, s);
  recordEvent("session_start", { sessionId: s.id, gameCode: s.gameCode, classCode });
  ensurePageHideFlush();
  return s;
}

/** Set kode kelas guru pada sesi aktif (dipakai saat siswa memasukkan kode di char-select). */
export function setClassCode(code: string): Session {
  return updateSession({ classCode: normalizeClassCode(code) });
}

/** Ambil/muat sesi aktif. Jika belum ada, buat baru. */
export function ensureSession(): Session {
  const s = getSession();
  if (!s.id) {
    return createNewSession();
  }
  ensurePageHideFlush();
  return s;
}

export function getSession(): Session {
  const s = read<Partial<Session>>(SESSION_KEY, {});
  return {
    id: s.id || "",
    gameCode: s.gameCode,
    startedAt: s.startedAt || "",
    lastActiveAt: s.lastActiveAt || "",
    player: s.player,
    currentIsland: s.currentIsland,
    currentAct: s.currentAct,
    completedIslands: Array.isArray(s.completedIslands) ? s.completedIslands : [],
    xp: s.xp || 0,
    level: s.level || 1,
    badges: Array.isArray(s.badges) ? s.badges : [],
  };
}

/** Perbarui sebagian data sesi, lalu hitung ulang level. */
export function updateSession(patch: Partial<Session>): Session {
  const s = { ...getSession(), ...patch, lastActiveAt: new Date().toISOString() };
  const lvl = levelFromXp(s.xp);
  s.level = lvl.level;
  write(SESSION_KEY, s);
  return s;
}

/** Atur profil pemain di sesi. */
export function setPlayer(player: PlayerInfo): Session {
  return updateSession({ player });
}

/** Set posisi resume (pulau + babak). */
export function setResume(islandId: string, actIndex: number): Session {
  return updateSession({ currentIsland: islandId, currentAct: actIndex });
}

/** Catat sebuah event ke riwayat. Mengembalikan event yang dibuat. */
export function recordEvent(type: string, payload: Record<string, unknown> = {}): SessionEvent {
  const ev: SessionEvent = { id: uuid(), t: new Date().toISOString(), type, ...payload };
  const events = read<SessionEvent[]>(EVENTS_KEY, []);
  events.push(ev);
  write(EVENTS_KEY, events);
  updateSession({}); // sentuh lastActiveAt
  // sinkronisasi ke remote (fire-and-forget)
  void trackEvent(ev).catch(() => {});
  return ev;
}

export function getEvents(): SessionEvent[] {
  return read<SessionEvent[]>(EVENTS_KEY, []);
}

/** Bersihkan sesi & event (mis. tombol "Mulai Baru"). */
export function resetSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(EVENTS_KEY);
  } catch {
    // abaikan
  }
}

// ---------- XP & Lencana ----------

const XP_ACT = 30;
const XP_ISLAND = 100;
const XP_REFLECTION = 40;
const XP_ASSESSMENT = 10;
const XP_MINIGAME = 10;

/** Tambah XP; memicu event level_up & lencana jika naik. */
export function addXp(amount: number, reason: string): Session {
  const before = getSession();
  const xp = before.xp + amount;
  const lvl = levelFromXp(xp);
  const changed = updateSession({ xp });
  if (lvl.level > before.level) {
    recordEvent("level_up", { from: before.level, to: lvl.level, title: lvl.title, reason });
    // lencana per level
    const badge = `level-${lvl.level}`;
    if (!changed.badges.includes(badge)) {
      const b = updateSession({ badges: [...changed.badges, badge] });
      recordEvent("badge_earned", { badge, label: lvl.title });
      return b;
    }
  }
  return changed;
}

/** Tandai sebuah pulau selesai + beri XP & lencana pulau. */
export function completeIsland(islandId: string, islandName: string): Session {
  const s = getSession();
  if (!s.completedIslands.includes(islandId)) {
    updateSession({ completedIslands: [...s.completedIslands, islandId] });
  }
  const after = addXp(XP_ISLAND, `island_${islandId}`);
  const badge = `island-${islandId}`;
  if (!after.badges.includes(badge)) {
    const b = updateSession({ badges: [...after.badges, badge] });
    recordEvent("badge_earned", { badge, label: `Pulau ${islandName}` });
    return b;
  }
  return after;
}

export function xpConstants() {
  return { XP_ACT, XP_ISLAND, XP_REFLECTION, XP_ASSESSMENT, XP_MINIGAME };
}
