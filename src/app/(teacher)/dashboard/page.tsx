"use client";

import { AppNavbar } from "@/components/layout/app-navbar";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#060F14] text-white">
      <AppNavbar active="dashboard-guru" />
      <div className="mx-auto w-full max-w-[1200px] px-6 lg:px-[80px] py-10">
        <h1 className="font-outfit text-3xl font-extrabold text-[#FFB319]">Dashboard Guru</h1>
        <p className="mt-2 font-nunito text-sm text-white/70">
          Pantau perkembangan dan potensi siswamu. (Dalam pengembangan)
        </p>
      </div>
    </main>
  );
}
