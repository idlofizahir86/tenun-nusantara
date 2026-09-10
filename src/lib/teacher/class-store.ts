"use client";

// ============================================================
// Pengelolaan kelas milik guru.
// Setiap kelas punya label (mis. "7A") + kode unik (KL-XXXXXX)
// yang dibagikan ke siswa untuk di-join di char-select.
//
// Sumber kebenaran = Supabase (lewat /api/classes), dengan
// localStorage sebagai CACHE agar render awal tetap sinkron dan
// aplikasi tetap jalan tanpa backend. Sebelumnya kelas HANYA di
// localStorage sehingga hilang saat storage bersih / origin berubah.
// ============================================================

export interface TeacherClass {
  id: string;
  label: string;
  code: string; // kode unik join siswa, mis. KL-7K3M9X
  createdAt: string;
}

const CLASSES_KEY = "tenun-teacher-classes";
const ACTIVE_KEY = "tenun-teacher-active-class";
const DEVICE_KEY = "tenun-device";

const CLASS_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function telemetryEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_TELEMETRY === "true";
}

/** Kunci perangkat anonim (pola sama dengan telemetri) — untuk guru tamu. */
function getDeviceKey(): string | null {
  try {
    if (typeof localStorage === "undefined") return null;
    const existing = localStorage.getItem(DEVICE_KEY);
    if (existing) return existing;
    const made = "dev-" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(DEVICE_KEY, made);
    return made;
  } catch {
    return null;
  }
}

/** Buat kode kelas unik (KL-XXXXXX). */
export function makeClassCode(): string {
  let code = "KL-";
  for (let i = 0; i < 6; i++) {
    code += CLASS_CHARS[Math.floor(Math.random() * CLASS_CHARS.length)];
  }
  return code;
}

function readClasses(): TeacherClass[] {
  try {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem(CLASSES_KEY);
    return raw ? (JSON.parse(raw) as TeacherClass[]) : [];
  } catch {
    return [];
  }
}

function writeClasses(list: TeacherClass[]): void {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(CLASSES_KEY, JSON.stringify(list));
  } catch {
    // abaikan
  }
}

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "c-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
}

/** Ubah baris Supabase → TeacherClass. */
function fromRow(row: Record<string, unknown>): TeacherClass {
  return {
    id: (row.id as string) || "",
    label: (row.label as string) || "Kelas Baru",
    code: (row.code as string) || "",
    createdAt: (row.created_at as string) || new Date().toISOString(),
  };
}

/** Baca kelas dari cache (sinkron, untuk render awal). */
export function listClasses(): TeacherClass[] {
  return readClasses();
}

/**
 * Sinkronkan kelas dengan database, lalu simpan sebagai cache.
 * Mengembalikan daftar terbaru. Aman: no-op bila backend mati
 * (daftar lokal tetap dipakai).
 */
export async function syncClasses(): Promise<TeacherClass[]> {
  if (!telemetryEnabled()) return readClasses();
  try {
    const deviceKey = getDeviceKey();
    const qs = deviceKey ? `?deviceKey=${encodeURIComponent(deviceKey)}` : "";
    const res = await fetch(`/api/classes${qs}`);
    if (!res.ok) return readClasses();
    const data = await res.json();
    if (!Array.isArray(data?.classes)) return readClasses();
    const remote = (data.classes as Record<string, unknown>[]).map(fromRow).filter((c) => c.code);
    // Gabung dengan cache: kelas lokal yang belum terkirim tetap tampil.
    const map = new Map<string, TeacherClass>();
    for (const c of [...remote, ...readClasses()]) map.set(c.id, c);
    const merged = [...map.values()].sort((a, b) =>
      (b.createdAt || "").localeCompare(a.createdAt || "")
    );
    writeClasses(merged);
    return merged;
  } catch {
    return readClasses();
  }
}

/** Kirim perubahan ke database (fire-and-forget; cache sudah diperbarui). */
async function pushRemote(
  method: "POST" | "PATCH" | "DELETE",
  body?: Record<string, unknown>,
  id?: string
): Promise<void> {
  if (!telemetryEnabled()) return;
  try {
    const deviceKey = getDeviceKey();
    const url =
      method === "DELETE"
        ? `/api/classes?id=${encodeURIComponent(id || "")}&deviceKey=${encodeURIComponent(deviceKey || "")}`
        : "/api/classes";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: method === "DELETE" ? undefined : JSON.stringify({ ...body, deviceKey }),
    });
  } catch {
    // gagal — cache lokal tetap jadi acuan sampai sinkron berikutnya
  }
}

/** Buat kelas baru dengan label bebas + kode unik. Return kelas yang dibuat. */
export function createClass(label: string): TeacherClass {
  const clean = (label || "").trim() || "Kelas Baru";
  const list = readClasses();
  const cls: TeacherClass = {
    id: uuid(),
    label: clean,
    code: makeClassCode(),
    createdAt: new Date().toISOString(),
  };
  list.unshift(cls);
  writeClasses(list);
  void pushRemote("POST", { id: cls.id, code: cls.code, label: cls.label });
  return cls;
}

/** Ubah label kelas (kode tetap). */
export function renameClass(id: string, label: string): void {
  const clean = (label || "").trim();
  const list = readClasses().map((c) => (c.id === id ? { ...c, label: clean || c.label } : c));
  writeClasses(list);
  const updated = list.find((c) => c.id === id);
  if (updated) void pushRemote("PATCH", { id, label: updated.label });
}

/** Hapus kelas. Bila kelas aktif dihapus, aktifkan kelas pertama (jika ada). */
export function deleteClass(id: string): void {
  const list = readClasses().filter((c) => c.id !== id);
  writeClasses(list);
  const active = getActiveClassCode();
  if (active && !list.some((c) => c.code === active)) {
    setActiveClassCode(list[0]?.code || null);
  }
  void pushRemote("DELETE", undefined, id);
}

export function getActiveClassCode(): string | null {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

export function setActiveClassCode(code: string | null): void {
  try {
    if (typeof localStorage === "undefined") return;
    if (code) localStorage.setItem(ACTIVE_KEY, code);
    else localStorage.removeItem(ACTIVE_KEY);
  } catch {
    // abaikan
  }
}
