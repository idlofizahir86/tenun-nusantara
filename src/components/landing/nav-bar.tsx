"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

// Halaman in-game / ber-role yang memakai AppNavbar sendiri (navbar utama),
// sehingga navbar brand landing disembunyikan di halaman-halaman ini.
const HIDDEN_PATHS: string[] = [
  "/map",
  "/island",
  "/report",
  "/dashboard",
  "/home",
  "/char-select",
  "/profile",
];

export function NavBar() {
  const pathname = usePathname();

  if (HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return null;
  }

  return (
    <header className="flex w-full items-center justify-between px-5 py-6 md:px-20 md:py-6" style={{ height: 108 }}>
      <div className="flex items-center gap-3">
        <Image
          src="/assets/images/logo/tenun-nusantara-logo.png"
          alt="Tenun Nusantara Logo"
          width={60}
          height={60}
          className="h-[60px] w-[60px] object-contain"
        />
        <span className="font-outfit text-[22px] font-extrabold leading-7 text-white">
          TENUN NUSANTARA
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-[20px] border border-[#FFB319] bg-[#0F3943] px-4 py-2">
        <span className="text-[11px] font-bold uppercase leading-[15px] text-[#8DA2A6]">
          Dev By
        </span>
        <span className="font-outfit text-[14px] font-black leading-[18px] text-white">
          ATEAM
        </span>
      </div>
    </header>
  );
}
