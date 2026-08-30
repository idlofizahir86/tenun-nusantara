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
      const { error } = await db.from("sessions").upsert(row, { onConflict: "id" });
      if (error) console.error("upsert session:", error.message);
      else saved.sessions = 1;
    }

    // 2) Insert event (abaikan yang sudah ada)
    if (Array.isArray(body.events) && body.events.length > 0) {
      const rows = body.events.map((e) => ({
        id: e.id,
        session_id: body.session?.id || null,
        profile_id: profileId,
        t: e.t || new Date().toISOString(),
        type: e.type,
        payload: JSON.stringify(e.payload || {}),
      }));
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

      return NextResponse.json({ ok: true, session: sRes.data || null, events: eRes.data || [] });
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
      return NextResponse.json({ ok: true, session: sRes.data || null, events: eRes.data || [] });
    }

    // Pull per sessionId (umum).
    if (!sessionId) return NextResponse.json({ ok: true });
    const db = createServiceClient();
    if (!db) return NextResponse.json({ ok: true, skipped: true });
    const [sRes, eRes] = await Promise.all([
      db.from("sessions").select("*").eq("id", sessionId).maybeSingle(),
      db.from("events").select("*").eq("session_id", sessionId).order("t", { ascending: true }),
    ]);
    return NextResponse.json({ ok: true, session: sRes.data || null, events: eRes.data || [] });
  } catch (err) {
    console.error("API /api/telemetry GET error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}
