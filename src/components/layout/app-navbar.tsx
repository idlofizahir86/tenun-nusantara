"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Volume2, VolumeX, LogIn, LogOut } from "lucide-react";
import { useSound } from "@/hooks/use-sound";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export type NavKey = "peta-bakat" | "dashboard-guru" | "laporan-ortu" | "peta";
type Role = "student" | "teacher" | "parent";

// Menu navbar utama berdasarkan peran yang dipilih saat role-selection.
const NAV_BY_ROLE: Record<Role, { key: NavKey; label: string; href: string }[]> = {
  student: [
    { key: "peta-bakat", label: "Peta Bakat", href: "/report" },
    { key: "peta", label: "Peta Nusantara", href: "/map" },
  ],
  teacher: [
    { key: "dashboard-guru", label: "Dashboard Guru", href: "/dashboard" },
    { key: "peta", label: "Peta", href: "/map" },
  ],
  parent: [
    { key: "laporan-ortu", label: "Laporan Orang Tua", href: "/report/ortu" },
    { key: "peta", label: "Peta", href: "/map" },
  ],
};

// Navbar utama aplikasi — dipakai lintas halaman. Menu disesuaikan dengan peran.
// `hideMenu=true` menyembunyikan tautan menu (mis. di halaman pulau yang immersive).
export function AppNavbar({ active, hideMenu }: { active?: NavKey; hideMenu?: boolean }) {
  const router = useRouter();
  const [role, setRole] = useState<Role>("student");
  const [loggedIn, setLoggedIn] = useState(false);
  const { muted, toggleMute } = useSound();

  useEffect(() => {
    try {
      const r = localStorage.getItem("tenun-role");
      if (r === "teacher" || r === "parent" || r === "student") setRole(r);
      setLoggedIn(Boolean(localStorage.getItem("tenun-user-id")));
    } catch {
      // abaikan
    }
  }, []);

  async function handleAccount() {
    if (loggedIn) {
      // Keluar
      try {
        const supabase = createClient();
        await supabase?.auth.signOut();
        localStorage.removeItem("tenun-user-id");
      } catch {
        // abaikan
      }
      setLoggedIn(false);
      router.push("/login");
    } else {
      router.push("/login");
    }
  }

  const items = NAV_BY_ROLE[role];

  return (
    <header className="flex h-[72px] w-full flex-none items-center justify-between border-b border-[#0F3943] bg-[#0B1D23]/40 px-6 lg:px-[80px]">
      {/* Logo */}
      <button
        onClick={() => router.push("/map")}
        className="flex items-center gap-3"
        aria-label="Tenun Nusantara"
      >
        <Image 
    src="/assets/images/logo/tenun-nusantara-logo.png" 
    alt="Tenun Nusantara Logo" 
    width={40} 
    height={40} 
    className="object-contain"
  />
        <span className="font-outfit text-lg font-extrabold tracking-wide text-white">
          TENUN <span className="text-amber-400">NUSANTARA</span>
        </span>
      </button>

      {/* Nav links (sesuai peran) — disembunyikan bila hideMenu */}
      {!hideMenu && (
        <nav className="hidden items-center gap-8 md:flex">
          {items.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => router.push(item.href)}
                className={`font-manrope text-sm transition-colors ${
                  isActive
                    ? "font-extrabold text-[#FFB319]"
                    : "font-semibold text-white/70 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}

      {/* Akun + BISA.AI badge + mute toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleAccount}
          title={loggedIn ? "Keluar dari akun" : "Masuk dengan akun"}
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
            loggedIn
              ? "border-[#19D29F] bg-[#0F3943] text-[#19D29F]"
              : "border-[#FFB319] bg-[#0F3943] text-[#FFB319]"
          }`}
        >
          {loggedIn ? <LogOut size={18} /> : <LogIn size={18} />}
        </button>
        <button
          onClick={toggleMute}
          aria-label={muted ? "Nyalakan suara" : "Matikan suara"}
          title={muted ? "Suara aktif: nonaktif" : "Suara aktif: hidup"}
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
            muted
              ? "border-[#8DA2A6] bg-[#09242B] text-[#8DA2A6]"
              : "border-[#19D29F] bg-[#0F3943] text-[#19D29F]"
          }`}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div className="box-border flex items-center gap-2 rounded-full border border-[#FFB319] bg-[#0F3943] px-4 py-1.5">
          <span className="font-nunito text-[10px] font-bold uppercase tracking-wider text-[#8DA2A6]">
            Dev💖 by
          </span>
          <span className="font-outfit text-[13px] font-black text-white">ATEAM</span>
        </div>
      </div>
    </header>
  );
}
