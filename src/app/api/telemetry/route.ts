import { NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/service";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type { SessionEvent } from "@/lib/session/session";

export const runtime = "nodejs";

interface TelemetryBody {
  session?: Record<string, unknown> | null;
  events?: SessionEvent[];
  profileId?: string | null;
  deviceKey?: string | null;
}

// Kolom `payload` jsonb menyimpan objek. Baris lama sempat ditulis sebagai
// JSON string (double-encoded) sehingga perlu di-parse agar `trait` terbaca.
function normalizePayload(p: unknown): Record<string, unknown> {
  if (typeof p === "string") {
    try {
      const parsed = JSON.parse(p);
      return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }
  return p && typeof p === "object" ? (p as Record<string, unknown>) : {};
}

function normalizeEventRows(rows: unknown[]): unknown[] {
  return (rows as Record<string, unknown>[]).map((r) => ({
    ...r,
    payload: normalizePayload(r.payload),
  }));
}

// POST /api/telemetry — terima batch event + snapshot sesi, simpan ke Supabase.
// Menggunakan service role (server-only); untuk MVP tanpa login event tetap
// ditulis, dan bila ada profileId (user login) dikaitkan ke akun tsb.
export async function POST(req: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const body = (await req.json()) as TelemetryBody;
    const db = createServiceClient();
    if (!db) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const profileId = body.profileId || null;
    const deviceKey = body.deviceKey || null;
    const saved = { sessions: 0, events: 0 };

    // 1) Upsert sesi
    if (body.session?.id) {
      const s = body.session as Record<string, unknown>;
      const row: Record<string, unknown> = {
        id: s.id,
        game_code: s.gameCode || null,
        class_code: s.classCode || null,
        player: s.player || null,
        started_at: (s.startedAt as string) || new Date().toISOString(),
        last_active_at: (s.lastActiveAt as string) || new Date().toISOString(),
        current_island: s.currentIsland || null,
        current_act: typeof s.currentAct === "number" ? s.currentAct : null,
        xp: typeof s.xp === "number" ? s.xp : 0,
        level: typeof s.level === "number" ? s.level : 1,
        badges: JSON.stringify(Array.isArray(s.badges) ? s.badges : []),
        completed_islands: Array.isArray(s.completedIslands) ? s.completedIslands : [],
      };
      if (profileId) row.profile_id = profileId;
      if (deviceKey) row.device_key = deviceKey;
      let { error } = await db.from("sessions").upsert(row, { onConflict: "id" });
      // Kolom `player` bisa belum ada bila migrasi 0004 belum dijalankan.
      // Ulangi tanpa `player` agar telemetri tetap jalan (nama jadi fallback).
      if (error && /player/i.test(error.message)) {
        const rowNoPlayer = { ...row };
        delete rowNoPlayer.player;
        const retry = await db.from("sessions").upsert(rowNoPlayer, { onConflict: "id" });
        error = retry.error;
      }
      if (error) console.error("upsert session:", error.message);
      else saved.sessions = 1;
    }

    // 2) Insert event (abaikan yang sudah ada)
    if (Array.isArray(body.events) && body.events.length > 0) {
      // recordEvent() menyebar payload di level atas event (bukan di e.payload),
      // jadi sisa field selain kolom tabel harus disimpan ke kolom payload.
      // Tanpa ini `trait`/`islandId` hilang dan Peta Bakat guru jadi kosong.
      const rows = body.events.map((e) => {
        const { id, t, type, payload: nested, ...rest } = e;
        const payload =
          nested && typeof nested === "object"
            ? { ...rest, ...(nested as Record<string, unknown>) }
            : rest;
        return {
          id,
          session_id: body.session?.id || null,
          profile_id: profileId,
          t: t || new Date().toISOString(),
          type,
          payload,
        };
      });
      const { error } = await db.from("events").upsert(rows, { onConflict: "id" });
      if (error) console.error("insert events:", error.message);
      else saved.events = rows.length;
    }

    return NextResponse.json({ ok: true, saved });
  } catch (err) {
    console.error("API /api/telemetry error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    // Pull data MILIK USER YANG LOGIN (lintas perangkat) memakai cookie auth.
    if (searchParams.get("mine") === "1") {
      const userClient = createServerClient();
      if (!userClient) return NextResponse.json({ ok: true, session: null, events: [] });
      const {
        data: { user },
      } = await userClient.auth.getUser();
      if (!user) return NextResponse.json({ ok: true, session: null, events: [] });

      const db = createServiceClient();
      if (!db) return NextResponse.json({ ok: true, session: null, events: [] });

      const [sRes, eRes] = await Promise.all([
        db
          .from("sessions")
          .select("*")
          .eq("profile_id", user.id)
          .order("last_active_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        db.from("events").select("*").eq("profile_id", user.id).order("t", { ascending: true }),
      ]);

      return NextResponse.json({
        ok: true,
        session: sRes.data || null,
        events: normalizeEventRows(eRes.data || []),
      });
    }

    // Pull per classCode (kode kelas guru → data seluruh siswa kelas tsb).
    const classCode = searchParams.get("classCode");
    if (classCode) {
      const db = createServiceClient();
      if (!db) return NextResponse.json({ ok: true, skipped: true });
      const sRes = await db
        .from("sessions")
        .select("*")
        .eq("class_code", classCode)
        .order("last_active_at", { ascending: false });
      const sessions = sRes.data || [];
      const ids = sessions
        .map((s) => (s as { id?: string }).id)
        .filter((x): x is string => Boolean(x));
      let events: unknown[] = [];
      if (ids.length > 0) {
        const eRes = await db
          .from("events")
          .select("*")
          .in("session_id", ids)
          .order("t", { ascending: true });
        events = normalizeEventRows(eRes.data || []);
      }
      return NextResponse.json({ ok: true, sessions, events });
    }

    // Pull per gameCode (kode pendek, untuk lanjutkan/share lintas perangkat).
    const gameCode = searchParams.get("gameCode");
    if (gameCode) {
      const db = createServiceClient();
      if (!db) return NextResponse.json({ ok: true, skipped: true });
      const sRes = await db
        .from("sessions")
        .select("*")
        .eq("game_code", gameCode)
        .limit(1)
        .maybeSingle();
      const sid = (sRes.data as { id?: string } | null)?.id;
      if (!sid) return NextResponse.json({ ok: true, session: null, events: [] });
      const eRes = await db
        .from("events")
        .select("*")
        .eq("session_id", sid)
        .order("t", { ascending: true });
      return NextResponse.json({
        ok: true,
        session: sRes.data || null,
        events: normalizeEventRows(eRes.data || []),
      });
    }

    // Pull per sessionId (umum).
    if (!sessionId) return NextResponse.json({ ok: true });
    const db = createServiceClient();
    if (!db) return NextResponse.json({ ok: true, skipped: true });
    const [sRes, eRes] = await Promise.all([
      db.from("sessions").select("*").eq("id", sessionId).maybeSingle(),
      db.from("events").select("*").eq("session_id", sessionId).order("t", { ascending: true }),
    ]);
    return NextResponse.json({
      ok: true,
      session: sRes.data || null,
      events: normalizeEventRows(eRes.data || []),
    });
  } catch (err) {
    console.error("API /api/telemetry GET error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}
