"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchClassRoster, type TeacherStudent } from "@/lib/teacher/class-data";
import { getActiveClassCode, listClasses } from "@/lib/teacher/class-store";

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
    const active = getActiveClassCode();
    if (!active) {
      setStudents([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const roster = await fetchClassRoster(active);
    setStudents(roster.students);
    setLoading(false);
  }, []);

  useEffect(() => {
    setCode(getActiveClassCode());
    setLabel(listClasses().find((x) => x.code === getActiveClassCode())?.label || null);
    void refresh();

    const onChange = () => {
      setCode(getActiveClassCode());
      setLabel(listClasses().find((x) => x.code === getActiveClassCode())?.label || null);
      void refresh();
    };
    window.addEventListener("tenun:classchange", onChange);
    return () => window.removeEventListener("tenun:classchange", onChange);
  }, [refresh]);

  return { code, label, students, loading, refresh };
}
