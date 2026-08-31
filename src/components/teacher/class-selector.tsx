"use client";

import { useState } from "react";
import { ChevronDown, School } from "lucide-react";
import { listClasses, setActiveClassCode, type TeacherClass } from "@/lib/teacher/class-store";

// Pemilih kelas aktif. Menu dashboard mengikuti kelas yang dipilih.
export function ClassSelector() {
  const [classes, setClasses] = useState<TeacherClass[]>(() => listClasses());
  const [activeCode, setActive] = useState<string | null>(() => {
    const c = listClasses();
    const active = c.find((x) => x.code === getActiveLocal());
    return (active?.code || c[0]?.code || null);
  });
  const [open, setOpen] = useState(false);

  const active = classes.find((c) => c.code === activeCode) || null;

  function choose(code: string) {
    setActive(code);
    setActiveClassCode(code);
    setOpen(false);
    // Beri tahu halaman yang menampilkan roster agar ikut menyegarkan data.
    try {
      window.dispatchEvent(new Event("tenun:classchange"));
    } catch {
      // abaikan
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-[#FFB319]/40 bg-[#0F3943] px-4 py-2.5 font-manrope text-sm font-bold text-white transition hover:border-[#FFB319]"
      >
        <School size={16} className="text-[#FFB319]" />
        <span>{active ? active.label : "Pilih Kelas"}</span>
        <ChevronDown size={16} className={`text-[#8DA2A6] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-[#FFB319]/30 bg-[#0F3943] shadow-2xl">
            {classes.length === 0 && (
              <p className="px-4 py-3 font-manrope text-xs text-[#8DA2A6]">
                Belum ada kelas. Buat di menu Pengaturan Kelas.
              </p>
            )}
            {classes.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => choose(c.code)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left font-manrope text-sm transition hover:bg-[#144955] ${
                  c.code === activeCode ? "font-bold text-[#FFB319]" : "text-white"
                }`}
              >
                <span>{c.label}</span>
                <span className="font-nunito text-[10px] text-[#8DA2A6]">{c.code}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Baca kode kelas aktif dari localStorage (pembungkus aman).
function getActiveLocal(): string | null {
  try {
    return localStorage.getItem("tenun-teacher-active-class");
  } catch {
    return null;
  }
}
