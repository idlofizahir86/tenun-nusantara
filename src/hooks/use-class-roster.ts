"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchClassRoster, type TeacherStudent } from "@/lib/teacher/class-data";
import {
  getActiveClassCode,
  listClasses,
  setActiveClassCode,
  syncClasses,
} from "@/lib/teacher/class-store";

export interface ClassRosterState {
  code: string | null;
  label: string | null;
  students: TeacherStudent[];
  loading: boolean;
  refresh: () => void;
}

// Muat roster siswa untuk kode kelas aktif; refresh otomatis saat kelas ganti.
export function useClassRoster(): ClassRosterState {
  const [code, setCode] = useState<string | null>(() => getActiveClassCode());
  const [label, setLabel] = useState<string | null>(() => {
    const c = listClasses().find((x) => x.code === getActiveClassCode());
    return c?.label || listClasses()[0]?.label || null;
  });
  const [students, setStudents] = useState<TeacherStudent[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    // Tarik daftar kelas dari database dulu (kelas hanya di-cache lokal),
    // agar kelas yang dibuat di perangkat/browser lain ikut ditemukan.
    const classes = await syncClasses();
    let active = getActiveClassCode();
    // Kelas aktif hilang (mis. dihapus / cache bersih) → pakai kelas terbaru.
    if (active && !classes.some((c) => c.code === active)) active = null;
    if (!active && classes.length > 0) {
      active = classes[0].code;
      setActiveClassCode(active);
    }
    setCode(active);
    setLabel(classes.find((x) => x.code === active)?.label || classes[0]?.label || null);
    if (!active) {
      setStudents([]);
      setLoading(false);
      return;
    }
    const roster = await fetchClassRoster(active);
    setStudents(roster.students);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    // Ganti kelas → muat ulang roster (refresh juga menyinkronkan daftar kelas).
    window.addEventListener("tenun:classchange", refresh);
    return () => window.removeEventListener("tenun:classchange", refresh);
  }, [refresh]);

  return { code, label, students, loading, refresh };
}
