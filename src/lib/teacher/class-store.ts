"use client";

// ============================================================
// Pengelolaan kode kelas milik guru (localStorage).
// Setiap kelas punya label (mis. "7A") + kode unik (KL-XXXXXX)
// yang dibagikan ke siswa untuk di-join di char-select.
// ============================================================

export interface TeacherClass {
  id: string;
  label: string;
  code: string; // kode unik join siswa, mis. KL-7K3M9X
  createdAt: string;
}

const CLASSES_KEY = "tenun-teacher-classes";
const ACTIVE_KEY = "tenun-teacher-active-class";

const CLASS_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

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

export function listClasses(): TeacherClass[] {
  return readClasses();
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
  return cls;
}

/** Ubah label kelas (kode tetap). */
export function renameClass(id: string, label: string): void {
  const clean = (label || "").trim();
  const list = readClasses().map((c) => (c.id === id ? { ...c, label: clean || c.label } : c));
  writeClasses(list);
}

/** Hapus kelas. Bila kelas aktif dihapus, aktifkan kelas pertama (jika ada). */
export function deleteClass(id: string): void {
  const list = readClasses().filter((c) => c.id !== id);
  writeClasses(list);
  const active = getActiveClassCode();
  if (active && !list.some((c) => c.code === active)) {
    setActiveClassCode(list[0]?.code || null);
  }
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
