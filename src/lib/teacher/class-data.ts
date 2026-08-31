"use client";

// ============================================================
// Pengambilan data siswa berdasarkan kode kelas.
// Sumber: Supabase (lintas perangkat) + fallback localStorage
// (snapshot per game) agar demo satu perangkat tetap jalan.
// ============================================================

import {
  computeTalentProfile,
  type IntelligenceDim,
  type ReportEvent,
} from "@/lib/scoring/engine";
import { listGames } from "@/lib/session/game-store";
import type { Session, SessionEvent } from "@/lib/session/session";

export interface TeacherStudent {
  gameCode: string;
  name: string;
  characterId: string;
  motif?: string;
  origin?: string;
  xp: number;
  level: number;
  completedIslands: string[];
  islandsCompleted: number;
  totalActsCompleted: number;
  lastActiveAt: string;
  startedAt: string;
  topTrait: string;
  traits: IntelligenceDim[];
  assessmentCount: number;
}

export interface ClassRoster {
  students: TeacherStudent[];
  fetchedAt: string;
}

function telemetryEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_TELEMETRY === "true";
}

/** Ubah baris event Supabase → ReportEvent (payload jsonb → spread). */
function mapRemoteEvent(row: Record<string, unknown>): ReportEvent {
  const payload = row.payload;
  const extra = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  return { id: (row.id as string) || undefined, t: (row.t as string) || undefined, type: (row.type as string) || "", ...extra };
}

/** Bangun ringkasan satu siswa dari sesi + event. */
function buildStudent(session: Record<string, unknown>, events: ReportEvent[]): TeacherStudent {
  const player = (session.player as { name?: string; characterId?: string; motif?: string; origin?: string } | null) || {};
  const completedIslands = Array.isArray(session.completed_islands)
    ? (session.completed_islands as string[])
    : Array.isArray(session.completedIslands)
      ? (session.completedIslands as string[])
      : [];
  const profile = computeTalentProfile(events, completedIslands.length);
  return {
    gameCode: (session.game_code as string) || (session.gameCode as string) || "",
    name: player.name || "Penjelajah",
    characterId: player.characterId || "siti",
    motif: player.motif,
    origin: player.origin,
    xp: Number(session.xp || 0),
    level: Number(session.level || 1),
    completedIslands,
    islandsCompleted: completedIslands.length,
    totalActsCompleted: events.filter((e) => e.type === "act_complete").length,
    lastActiveAt: (session.last_active_at as string) || (session.lastActiveAt as string) || "",
    startedAt: (session.started_at as string) || (session.startedAt as string) || "",
    topTrait: profile.topTrait,
    traits: profile.traits,
    assessmentCount: profile.assessmentCount,
  };
}

/** Ambil roster dari Supabase per kode kelas. Return array siswa (boleh kosong). */
async function fetchRemote(code: string): Promise<TeacherStudent[]> {
  if (!telemetryEnabled() || !code) return [];
  try {
    const res = await fetch(`/api/telemetry?classCode=${encodeURIComponent(code)}`);
    if (!res.ok) return [];
    const data = await res.json();
    const sessions = Array.isArray(data.sessions) ? (data.sessions as Record<string, unknown>[]) : [];
    const events = Array.isArray(data.events) ? (data.events as Record<string, unknown>[]) : [];
    const bySession = new Map<string, ReportEvent[]>();
    for (const e of events) {
      const sid = e.session_id as string | undefined;
      if (!sid) continue;
      const list = bySession.get(sid) || [];
      list.push(mapRemoteEvent(e));
      bySession.set(sid, list);
    }
    return sessions
      .filter((s) => s?.id)
      .map((s) => buildStudent(s, bySession.get(s.id as string) || []))
      .filter((s) => s.gameCode);
  } catch {
    return [];
  }
}

/** Ambil roster dari localStorage (snapshot per game) sebagai fallback demo. */
function fetchLocal(code: string): TeacherStudent[] {
  try {
    if (typeof localStorage === "undefined") return [];
    const games = listGames();
    const out: TeacherStudent[] = [];
    for (const g of games) {
      const raw = localStorage.getItem(`tenun-snapshot-${g.gameCode}`);
      if (!raw) continue;
      const snap = JSON.parse(raw) as { session?: Session & { classCode?: string }; events?: SessionEvent[] };
      const s = snap.session;
      if (!s || !s.classCode) continue;
      if (s.classCode !== code) continue;
      const events = (snap.events || []).filter(Boolean) as ReportEvent[];
      out.push(buildStudent({ ...s, game_code: s.gameCode, class_code: s.classCode }, events));
    }
    return out;
  } catch {
    return [];
  }
}

/** Gabung roster remote + lokal, dedupe berdasarkan gameCode. */
export async function fetchClassRoster(code: string): Promise<ClassRoster> {
  const [remote, local] = await Promise.all([fetchRemote(code), Promise.resolve(fetchLocal(code))]);
  const map = new Map<string, TeacherStudent>();
  for (const s of [...remote, ...local]) map.set(s.gameCode, s);
  const students = [...map.values()].sort((a, b) =>
    (b.lastActiveAt || "").localeCompare(a.lastActiveAt || "")
  );
  return { students, fetchedAt: new Date().toISOString() };
}
