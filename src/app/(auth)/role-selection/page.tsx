"use client";

import Link from "next/link";
import { GraduationCap, Presentation, Users, Compass } from "lucide-react";

const DIAMONDS = Array.from({ length: 24 }, (_, i) => i);

const roles = [
  {
    role: "student" as const,
    icon: GraduationCap,
    title: "Siswa",
    description: "Aku mau berpetualang melintasi 5 pulau Nusantara bersama NALA.",
    href: "/char-select",
  },
  {
    role: "teacher" as const,
    icon: Presentation,
    title: "Guru",
    description: "Aku mau memantau perkembangan dan potensi siswaku.",
    href: "/dashboard",
  },
  {
    role: "parent" as const,
    icon: Users,
    title: "Orang Tua",
    description: "Aku mau melihat laporan perjalanan belajar anakku.",
    href: "/home",
  },
];

export default function RoleSelectionPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <div className="flex w-full max-w-[1440px] flex-col">
        <main className="flex w-full flex-col items-center px-5 py-14 md:px-20">
          <div className="flex w-full max-w-3xl flex-col items-center gap-6 text-center">
            {/* Decorative Pattern Border */}
            <div className="flex h-2 w-full max-w-xl flex-row items-start justify-between opacity-30">
              {DIAMONDS.map((i) => (
                <div key={i} className="h-2 w-2 rotate-45 bg-[#FFB319]" />
              ))}
            </div>

            <h1 className="font-outfit text-[40px] font-extrabold leading-[110%] text-white md:text-[56px]">
              Siapa Kamu?
            </h1>

            <p className="text-[18px] font-semibold uppercase leading-[25px] text-[#19D29F]">
              Pilih Peran untuk Memulai Petualangan
            </p>

            <p className="max-w-xl text-[16px] font-normal leading-[160%] text-[#E2ECEF]">
              Setiap peran memiliki petualangan yang berbeda. Pilih siapa kamu hari
              ini untuk melanjutkan perjalananmu bersama Tenun Nusantara.
            </p>
          </div>

          {/* Role Cards */}
          <div className="mt-12 grid w-full gap-6 md:grid-cols-3">
            {roles.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.role}
                  href={item.href}
                  onClick={() => {
                    try {
                      localStorage.setItem("tenun-role", item.role);
                    } catch {
                      // abaikan
                    }
                  }}
                  className="group flex flex-col items-center gap-5 rounded-2xl border border-[#FFB319] bg-[#0F3943] p-8 text-center transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[0px_12px_28px_-4px_rgba(255,179,25,0.4)]"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#09242B] text-[#FFB319] transition-transform duration-200 group-hover:scale-110">
                    <Icon className="h-10 w-10" />
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <h2 className="font-outfit text-[24px] font-bold leading-[30px] text-[#FFB319]">
                      {item.title}
                    </h2>
                    <p className="text-[14px] font-normal leading-[150%] text-[#E2ECEF]">
                      {item.description}
                    </p>
                  </div>

                  <span className="mt-2 inline-flex items-center gap-2 rounded-[32px] bg-[#FFB319] px-6 py-3 font-outfit text-[15px] font-extrabold uppercase leading-[19px] text-[#0B1D23] transition-transform duration-200 group-hover:scale-105">
                    Pilih
                    <Compass className="h-5 w-5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
