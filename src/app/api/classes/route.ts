import { NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/service";
import { createClient as createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// ============================================================
// /api/classes — CRUD kelas guru.
//
// Kepemilikan mengikuti pola tabel sessions: bila guru login dipakai
// profile_id (auth.users.id), bila tamu dipakai device_key perangkat.
// Semua akses lewat service role; guru tamu tetap bisa memakai fitur.
// ============================================================

interface ClassBody {
  id?: string;
  code?: string;
  label?: string;
  deviceKey?: string | null;
}

/** Identitas pemanggil: profileId dari cookie auth, deviceKey dari klien. */
async function resolveOwner(deviceKey: string | null): Promise<{
  profileId: string | null;
  deviceKey: string | null;
}> {
  let profileId: string | null = null;
  try {
    const userClient = createServerClient();
    if (userClient) {
      const {
        data: { user },
      } = await userClient.auth.getUser();
      profileId = user?.id || null;
    }
  } catch {
    profileId = null;
  }
  return { profileId, deviceKey: deviceKey || null };
}

/**
 * Kelas milik: yang terikat akun ATAU yang dibuat perangkat ini.
 *
 * Sengaja OR, bukan "akun diutamakan": guru yang membuat kelas sebagai tamu
 * lalu login harus tetap melihat kelas lamanya. Kalau hanya difilter
 * profile_id, kelas tamu itu langsung hilang setelah login.
 */
function ownerOrFilter(profileId: string | null, deviceKey: string | null): string | null {
  const parts: string[] = [];
  if (profileId) parts.push(`profile_id.eq.${profileId}`);
  if (deviceKey) parts.push(`device_key.eq.${deviceKey}`);
  return parts.length > 0 ? parts.join(",") : null;
}

export async function GET(req: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ ok: true, skipped: true, classes: [] });
    }
    const db = createServiceClient();
    if (!db) return NextResponse.json({ ok: true, skipped: true, classes: [] });

    const { searchParams } = new URL(req.url);
    const { profileId, deviceKey } = await resolveOwner(searchParams.get("deviceKey"));
    const owner = ownerOrFilter(profileId, deviceKey);
    if (!owner) return NextResponse.json({ ok: true, classes: [] });

    const { data, error } = await db
      .from("classes")
      .select("*")
      .or(owner)
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ ok: true, classes: [], error: error.message });
    return NextResponse.json({ ok: true, classes: data || [] });
  } catch (err) {
    console.error("API /api/classes GET error:", err);
    return NextResponse.json({ ok: true, classes: [] });
  }
}

export async function POST(req: Request) {
  try {
    if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, skipped: true });
    const db = createServiceClient();
    if (!db) return NextResponse.json({ ok: true, skipped: true });

    const body = (await req.json()) as ClassBody;
    if (!body.id || !body.code) {
      return NextResponse.json({ error: "id dan code wajib diisi." }, { status: 400 });
    }
    const { profileId, deviceKey } = await resolveOwner(body.deviceKey ?? null);

    const row: Record<string, unknown> = {
      id: body.id,
      code: body.code,
      label: body.label || "Kelas Baru",
      updated_at: new Date().toISOString(),
    };
    if (profileId) row.profile_id = profileId;
    if (deviceKey) row.device_key = deviceKey;

    const { error } = await db.from("classes").upsert(row, { onConflict: "id" });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("API /api/classes POST error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, skipped: true });
    const db = createServiceClient();
    if (!db) return NextResponse.json({ ok: true, skipped: true });

    const body = (await req.json()) as ClassBody;
    if (!body.id) return NextResponse.json({ error: "id wajib diisi." }, { status: 400 });
    const { profileId, deviceKey } = await resolveOwner(body.deviceKey ?? null);
    const owner = ownerOrFilter(profileId, deviceKey);
    if (!owner) return NextResponse.json({ error: "Bukan pemilik kelas." }, { status: 403 });

    // Hanya boleh mengubah kelas miliknya sendiri.
    const { error } = await db
      .from("classes")
      .update({ label: body.label || "Kelas Baru", updated_at: new Date().toISOString() })
      .eq("id", body.id)
      .or(owner);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("API /api/classes PATCH error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, skipped: true });
    const db = createServiceClient();
    if (!db) return NextResponse.json({ ok: true, skipped: true });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id wajib diisi." }, { status: 400 });
    const { profileId, deviceKey } = await resolveOwner(searchParams.get("deviceKey"));
    const owner = ownerOrFilter(profileId, deviceKey);
    if (!owner) return NextResponse.json({ error: "Bukan pemilik kelas." }, { status: 403 });

    const { error } = await db.from("classes").delete().eq("id", id).or(owner);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("API /api/classes DELETE error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}
