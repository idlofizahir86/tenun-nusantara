"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, GraduationCap, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { PageLoading } from "@/components/ui/page-loading";
import { ClassSelector } from "./class-selector";

const MENU = [
  { key: "ringkasan", label: "Ringkasan Kelas", href: "/dashboard", icon: LayoutDashboard },
  { key: "sebaran", label: "Sebaran Karakter", href: "/dashboard/sebaran", icon: BarChart3 },
  { key: "siswa", label: "Daftar Siswa", href: "/dashboard/daftar-siswa", icon: Users },
  { key: "laporan", label: "Laporan Akademik", href: "/dashboard/laporan", icon: GraduationCap },
  { key: "pengaturan", label: "Pengaturan Kelas", href: "/dashboard/pengaturan", icon: Settings },
];

// Layout area guru: sidebar 5 menu + top bar. Tanpa peta.
export function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#060F14]">
        <PageLoading label="Memuat dashboard guru…" />
      </main>
    );
  }

  // Belum login & Supabase terkonfigurasi → panel masuk sebagai guru.
  if (configured && !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#060F14] px-4">
        <div className="w-full max-w-md rounded-3xl border border-[#FFB319] bg-[#0F3943]/80 p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#144955] text-[#FFB319]">
            <GraduationCap size={30} />
          </div>
          <h1 className="font-outfit text-2xl font-extrabold text-white">
            Area <span className="text-[#FFB319]">Guru</span>
          </h1>
          <p className="mt-2 font-manrope text-sm text-[#8DA2A6]">
            Masuk sebagai guru agar data kelas dan siswa tersimpan serta terintegrasi lintas perangkat.
          </p>
          <Link
            href={`/login?returnTo=/dashboard`}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[32px] bg-[#FFB319] py-3 font-outfit text-sm font-extrabold uppercase text-[#0B1D23] transition hover:brightness-110"
          >
            Masuk sebagai Guru
          </Link>
          <p className="mt-4 font-manrope text-xs text-[#5A7378]">
            Belum punya akun? Daftar di halaman masuk.
          </p>
        </div>
      </main>
    );
  }

  const activeKey =
    MENU.find((m) => m.href !== "/dashboard" && pathname.startsWith(m.href))?.key ||
    (pathname.startsWith("/dashboard") ? "ringkasan" : "ringkasan");

  async function handleLogout() {
    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      await supabase?.auth.signOut();
      localStorage.removeItem("tenun-user-id");
      window.location.href = "/login";
    } catch {
      // abaikan
    }
  }

  return (
    <div className="flex min-h-screen bg-[#060F14] text-white">
      {/* Sidebar */}
      <aside className="hidden w-[264px] flex-none flex-col border-r border-[#0F3943] bg-[#0B1D23]/60 lg:flex">
        <div className="flex items-center gap-3 border-b border-[#0F3943] px-6 py-5">
          <Image
            src="/assets/images/logo/tenun-nusantara-logo.png"
            alt="Tenun Nusantara Logo"
            width={36}
            height={36}
            className="object-contain"
          />
          <span className="font-outfit text-sm font-extrabold tracking-wide text-white">
            TENUN <span className="text-[#FFB319]">GURU</span>
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5 px-4 py-6">
          {MENU.map((m) => {
            const Icon = m.icon;
            const active = activeKey === m.key;
            return (
              <Link
                key={m.key}
                href={m.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 font-manrope text-sm font-bold transition-colors ${
                  active
                    ? "bg-[#144955] text-[#FFB319]"
                    : "text-white/70 hover:bg-[#0F3943] hover:text-white"
                }`}
              >
                <Icon size={18} className={active ? "text-[#FFB319]" : "text-[#8DA2A6]"} />
                {m.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#0F3943] px-4 py-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-manrope text-sm font-bold text-white/70 transition hover:bg-[#0F3943] hover:text-white"
          >
            <LogOut size={18} className="text-[#8DA2A6]" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Konten utama */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[72px] flex-none items-center justify-between gap-4 border-b border-[#0F3943] bg-[#0B1D23]/40 px-5 lg:px-8">
          <h1 className="font-outfit text-lg font-extrabold text-white">
            {MENU.find((m) => m.key === activeKey)?.label || "Dashboard Guru"}
          </h1>
          <ClassSelector />
        </header>

        {/* Menu mobile (gulir horizontal) */}
        <nav className="flex gap-1 overflow-x-auto border-b border-[#0F3943] bg-[#0B1D23]/40 px-4 py-2 lg:hidden">
          {MENU.map((m) => {
            const active = activeKey === m.key;
            return (
              <Link
                key={m.key}
                href={m.href}
                className={`flex-none rounded-full px-4 py-2 font-manrope text-xs font-bold transition ${
                  active ? "bg-[#FFB319] text-[#0B1D23]" : "text-white/70"
                }`}
              >
                {m.label}
              </Link>
            );
          })}
        </nav>

        <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
