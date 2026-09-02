"use client";

import { useState } from "react";

// ============================================================
// Dokumentasi Teknis — Tenun Nusantara
// Route: /dokumentasi-teknis
// Menjelaskan stack, arsitektur, cara dibangun, dan AI yang dipakai.
// ============================================================

const NAV = [
  { id: "ringkasan", label: "Ringkasan" },
  { id: "stack", label: "Tech Stack" },
  { id: "arsitektur", label: "Arsitektur" },
  { id: "ai", label: "AI yang Dipakai" },
  { id: "scoring", label: "Scoring Bakat" },
  { id: "data", label: "Data & Sesi" },
  { id: "tts", label: "Suara NALA" },
  { id: "laporan", label: "Sistem Laporan" },
];

const STACK = [
  { cat: "Frontend", items: "Next.js 14 (App Router), React 18, TypeScript (strict), TailwindCSS, Zustand, Framer Motion, lucide-react" },
  { cat: "Backend & Data", items: "Supabase (PostgreSQL + Auth + Storage), API Routes (App Router), RLS" },
  { cat: "AI / LLM", items: "Vercel AI SDK (ai v3), @ai-sdk/google, Google Gemini (runtime NALA)" },
  { cat: "Audio / TTS", items: "msedge-tts (Edge TTS id-ID-GadisNeural), Web Speech API (fallback)" },
  { cat: "Laporan / Visual", items: "recharts (radar & grafik), jspdf + html2canvas (unduh PDF), html2canvas" },
  { cat: "Utility", items: "zod (validasi), react-hook-form, date-fns, tailwind-merge, inkjs (narasi)" },
];

const AI_RUNTIME = [
  { model: "Google Gemini", via: "Vercel AI SDK (@ai-sdk/google)", peran: "NALA — kawan petualang AI. Narasi adaptif, petunjuk, refleksi, dan laporan Peta Bakat." },
  { model: "gemini-2.5-flash", via: "default + fallback (gemini-1.5-flash, gemini-2.0-flash)", peran: "Model utama runtime; pilihan model bisa diatur lewat env GEMINI_MODEL." },
  { model: "Fallback statis", via: "lib/ai/prompts.ts (fallbackNalaReply)", peran: "Balasan NALA otomatis bila API key Gemini tidak tersedia." },
];

const AI_DEV = [
  { tool: "DeepSeek", area: "Pembuatan kode", ket: "Digunakan untuk menulis & merefaktor sebagian besar kode (TypeScript/React/Next.js)." },
  { tool: "Claude", area: "Pembuatan kode", ket: "Digunakan sebagai penulis/pemeriksa kode (code review, logika, refactor)." },
  { tool: "Qwen", area: "Pembuatan kode", ket: "Digunakan untuk bantuan pemrograman & menyusun solusi teknis." },
  { tool: "Gemini", area: "Aset game", ket: "Membantu menghasilkan aset visual/ilustrasi game." },
  { tool: "Nano Banana (Gemini 2.5 Flash Image)", area: "Aset game", ket: "Model pembuat gambar untuk aset game (karakter, pulau, motif, dll)." },
  { tool: "Figma", area: "Desain & wireframe", ket: "Semua aset diatur & diprototipekan terlebih dahulu di Figma sebelum dipakai." },
];

const DIMENSIONS = [
  { emoji: "📖", label: "Linguistik", pulau: "Aksara", desc: "Bahasa, sastra, bercerita." },
  { emoji: "🧮", label: "Logika-Matematika", pulau: "Candi", desc: "Pola, penalaran, analitis." },
  { emoji: "🎨", label: "Visual-Ruang", pulau: "Harmoni", desc: "Seni, kreativitas, estetika." },
  { emoji: "🤸", label: "Kinestetik", pulau: "—", desc: "Gerak, praktik fisik." },
  { emoji: "🎵", label: "Musikal", pulau: "Harmoni", desc: "Nada, irama, musik." },
  { emoji: "🤝", label: "Interpersonal", pulau: "Pasar Terapung", desc: "Kerja sama, kepemimpinan." },
  { emoji: "🧘", label: "Intrapersonal", pulau: "Refleksi", desc: "Refleksi diri, mandiri." },
  { emoji: "🌿", label: "Naturalis", pulau: "Rimba", desc: "Alam, ekologis, lingkungan." },
];

const STORAGE_KEYS = [
  { key: "tenun-player", isi: "Profil pemain (nama, karakter, motif, asal)." },
  { key: "tenun-session", isi: "Sesi aktif: id, kode game, XP, level, pulau selesai, lencana." },
  { key: "tenun-events", isi: "Rangkaian event ber-timestamp (jejak perilaku)." },
  { key: "tenun-progress", isi: "Daftar pulau yang sudah dijelajahi." },
  { key: "tenun-assessment", isi: "Jawaban asesmen senyap untuk refleksi & scoring." },
  { key: "tenun-games", isi: "Registri game (gameCode → ringkasan)." },
  { key: "tenun-snapshot-{code}", isi: "Snapshot lengkap per game (untuk resume & guru)." },
  { key: "tenun-teacher-*", isi: "Data kelas & kode kelas milik guru." },
  { key: "tenun-role / tenun-mute", isi: "Peran aktif & status bisu global." },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 mb-4 font-outfit text-2xl font-extrabold text-[#FFB319]">{children}</h2>;
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-6 mb-2 font-outfit text-xl font-bold text-white">{children}</h3>;
}

export default function TeknisDocumentationPage() {
  const [active, setActive] = useState("ringkasan");

  const jump = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#09242B] to-[#060F14] text-white">
      <header className="sticky top-0 z-50 border-b border-[#FFB319]/30 bg-[#060F14]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <button onClick={() => jump("ringkasan")} className="flex items-center gap-2 font-outfit text-base font-extrabold text-[#FFB319]">
            ⚙️ Dokumentasi Teknis
          </button>
          <nav className="flex flex-wrap gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => jump(n.id)}
                className={`rounded-full px-3 py-1 font-nunito text-xs font-bold transition-colors ${
                  active === n.id ? "bg-[#FFB319] text-[#0B1D23]" : "text-[#E2ECEF] hover:bg-[#0F3943]"
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* RINGKASAN */}
        <section id="ringkasan">
          <h1 className="font-outfit text-4xl font-extrabold leading-tight text-white">
            Tenun Nusantara — <span className="text-[#FFB319]">Dokumentasi Teknis</span>
          </h1>
          <p className="mt-3 font-nunito text-base text-[#E2ECEF]">
            Platform <b>gamifikasi edukatif</b> berbasis web untuk memetakan minat-bakat anak (7–14 tahun) lewat
            petualangan di 5 pulau Nusantara, dengan pendamping AI <b>NALA</b>. Dokumen ini menjelaskan stack,
            arsitektur, alur data, dan AI yang digunakan dalam pembuatan serta pengoperasiannya.
          </p>

          <div className="mt-6 rounded-2xl border border-[#19D29F]/40 bg-[#0F3943] p-5">
            <h3 className="font-outfit font-bold text-[#19D29F]">Cara aplikasi dibangun</h3>
            <ul className="mt-2 space-y-2 font-nunito text-sm text-[#E2ECEF]">
              <li>🎨 <b>Desain & aset</b>: wireframe/prototype di <b>Figma</b>, lalu aset game dihasilkan dengan bantuan <b>Gemini</b> &amp; <b>Nano Banana</b>.</li>
              <li>💻 <b>Kode</b>: ditulis/direfaktor dengan bantuan <b>DeepSeek</b>, <b>Claude</b>, dan <b>Qwen</b>.</li>
              <li>⚙️ <b>Runtime AI</b>: NALA ditenagai <b>Google Gemini</b> via <b>Vercel AI SDK</b> (dengan fallback statis).</li>
            </ul>
          </div>
        </section>

        {/* TECH STACK */}
        <section id="stack">
          <SectionTitle>Tech Stack</SectionTitle>
          <div className="mt-4 flex flex-col gap-3">
            {STACK.map((s) => (
              <div key={s.cat} className="rounded-2xl border border-[#FFB319]/30 bg-[#0F3943] p-4">
                <span className="rounded-full bg-[#FFB319]/20 px-3 py-1 font-outfit text-xs font-bold text-[#FFB319]">{s.cat}</span>
                <p className="mt-2 font-nunito text-sm text-[#E2ECEF]">{s.items}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ARSITEKTUR */}
        <section id="arsitektur">
          <SectionTitle>Arsitektur & Struktur Proyek</SectionTitle>
          <p className="font-nunito text-[#E2ECEF]">
            Next.js <b>App Router</b> dengan <b>route groups</b> untuk memisahkan area per peran.
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-[#FFB319]/30 bg-[#060F14] p-4">
            <pre className="font-mono text-[12px] leading-relaxed text-[#E2ECEF]">{`src/
├─ app/
│  ├─ (marketing)/   # Landing page
│  ├─ (auth)/        # Login & role-selection
│  ├─ (student)/     # map, island, refleksi, report, profil
│  ├─ (parent)/      # home
│  ├─ (teacher)/     # dashboard (ringkasan, sebaran, siswa, laporan)
│  ├─ api/           # ai, tts, reports, telemetry
│  ├─ dokumentasi-pengguna/  # Panduan pengguna (3 peran)
│  └─ dokumentasi-teknis/    # Dokumen ini
├─ components/
│  ├─ game/          # 14+ minigame, reflection, island-game, modal
│  ├─ layout/        # AppNavbar, sidebar, orientation-guard
│  ├─ map/  landing/  report/  teacher/  ui/  dashboard/
├─ config/
│  ├─ islands.json   # KONTEN pulau (data-driven) — bisa diedit tanpa kode
│  └─ islands.ts, asset-paths.ts, site.ts, orientation.ts
├─ hooks/            # use-nala, use-tts, use-voice-input, use-sound, ...
├─ lib/
│  ├─ ai/            # gemini, nala-agent, prompts, report, generate
│  ├─ scoring/       # engine (8 dimensi), evidence-rules, triangulation
│  ├─ session/       # session.ts, game-store.ts (persistensi + resume)
│  ├─ supabase/      # client, server, service, sync
│  ├─ sound/  telemetry/  teacher/  report/  utils/
├─ stores/           # zustand (auth, story, student)
└─ types/            # game, story, telemetry, user`}</pre>
          </div>

          <SubTitle>Pendekatan data-driven</SubTitle>
          <p className="font-nunito text-[#E2ECEF]">
            Konten pulau (minigame, asesmen, refleksi, dialog NALA) disimpan di <b>islands.json</b>. Tim dapat
            mengubah isi permainan tanpa menyentuh kode — komponen membaca dari konfigurasi tersebut.
          </p>
        </section>

        {/* AI */}
        <section id="ai">
          <SectionTitle>AI yang Digunakan</SectionTitle>

          <SubTitle>A. AI Runtime (di dalam aplikasi)</SubTitle>
          <div className="mt-3 flex flex-col gap-3">
            {AI_RUNTIME.map((r) => (
              <div key={r.model} className="rounded-2xl border border-[#19D29F]/40 bg-[#0F3943] p-4">
                <h4 className="font-outfit font-bold text-[#19D29F]">{r.model}</h4>
                <span className="font-nunito text-xs text-[#8DA2A6]">{r.via}</span>
                <p className="mt-1 font-nunito text-sm text-[#E2ECEF]">{r.peran}</p>
              </div>
            ))}
          </div>

          <SubTitle>B. AI untuk Pembuatan (Development)</SubTitle>
          <div className="mt-3 flex flex-col gap-3">
            {AI_DEV.map((d) => (
              <div key={d.tool} className="rounded-2xl border border-[#FFB319]/30 bg-[#0F3943] p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-outfit font-bold text-white">{d.tool}</h4>
                  <span className="rounded-full bg-[#FFB319]/20 px-3 py-0.5 font-nunito text-[11px] font-bold text-[#FFB319]">{d.area}</span>
                </div>
                <p className="mt-1 font-nunito text-sm text-[#E2ECEF]">{d.ket}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SCORING */}
        <section id="scoring">
          <SectionTitle>Engine Pemetaan Bakat (8 Dimensi)</SectionTitle>
          <p className="font-nunito text-[#E2ECEF]">
            Berbasis teori <b>kecerdasan majemuk</b>. Dari jawaban asesmen senyap, aksi minigame, hingga event
            refleksi, sistem memberi skor pada 8 dimensi berikut:
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DIMENSIONS.map((d) => (
              <div key={d.label} className="rounded-2xl border border-[#FFB319]/30 bg-[#0F3943] p-4">
                <div className="text-3xl">{d.emoji}</div>
                <h4 className="mt-1 font-outfit font-bold text-white">{d.label}</h4>
                <span className="font-nunito text-[11px] text-[#19D29F]">{d.pulau}</span>
                <p className="font-nunito text-xs text-[#8DA2A6]">{d.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 font-nunito text-sm text-[#E2ECEF]">
            Hasilnya divisualkan sebagai <b>radar 8 dimensi</b> di Peta Bakat, lalu digunakan untuk rekomendasi
            karir (tren 2030) &amp; langkah stimulasi.
          </p>
        </section>

        {/* DATA & SESI */}
        <section id="data">
          <SectionTitle>Data, Sesi & Persistensi</SectionTitle>
          <p className="font-nunito text-[#E2ECEF]">
            Progres utama disimpan di <b>localStorage</b> agar bisa di-resume lintas pulau tanpa server. Berikut
            kunci yang dipakai:
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-[#FFB319]/30 bg-[#060F14] p-4">
            <table className="w-full text-left font-nunito text-sm">
              <thead>
                <tr className="text-[#FFB319]"><th className="py-2 pr-4">Kunci</th><th>Isi</th></tr>
              </thead>
              <tbody>
                {STORAGE_KEYS.map((k) => (
                  <tr key={k.key} className="border-t border-[#0F3943]">
                    <td className="py-2 pr-4 font-mono text-[12px] text-[#19D29F]">{k.key}</td>
                    <td className="py-2 text-[#E2ECEF]">{k.isi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-nunito text-sm text-[#E2ECEF]">
            <b>Telemetri</b>: setiap event ber-timestamp diantrekan dan di-flush (ke Supabase bila diaktifkan) untuk
            menyusun profil bakat dan feed dashboard guru.
          </p>
        </section>

        {/* TTS */}
        <section id="tts">
          <SectionTitle>Suara NALA (Text-to-Speech)</SectionTitle>
          <p className="font-nunito text-[#E2ECEF]">Suara NALA menggunakan strategi berjenjang:</p>
          <div className="mt-3 flex flex-col gap-3">
            <div className="rounded-2xl border border-[#19D29F]/40 bg-[#0F3943] p-4">
              <h4 className="font-outfit font-bold text-[#19D29F]">1. Edge TTS (utama)</h4>
              <p className="font-nunito text-sm text-[#E2ECEF]">via API route <b>/api/tts</b> (msedge-tts), suara <b>id-ID-GadisNeural</b> — gratis &amp; natural.</p>
            </div>
            <div className="rounded-2xl border border-[#FFB319]/30 bg-[#0F3943] p-4">
              <h4 className="font-outfit font-bold text-white">2. Web Speech API (fallback)</h4>
              <p className="font-nunito text-sm text-[#E2ECEF]">speechSynthesis dengan pemilihan suara perempuan/anak berbahasa Indonesia bila Edge gagal.</p>
            </div>
            <div className="rounded-2xl border border-[#FFB319]/30 bg-[#0F3943] p-4">
              <h4 className="font-outfit font-bold text-white">Input suara</h4>
              <p className="font-nunito text-sm text-[#E2ECEF]">Web Speech API (use-voice-input) untuk menjawab refleksi dengan suara. Ada tombol mute global.</p>
            </div>
          </div>
        </section>

        {/* LAPORAN */}
        <section id="laporan">
          <SectionTitle>Sistem Laporan</SectionTitle>
          <div className="mt-3 flex flex-col gap-3">
            <div className="rounded-2xl border border-[#FFB319]/30 bg-[#0F3943] p-4">
              <h4 className="font-outfit font-bold text-white">📊 Peta Bakat (Siswa)</h4>
              <p className="font-nunito text-sm text-[#E2ECEF]">Radar 8 dimensi, bakat dominan, lencana, pesan NALA. Terbuka setelah 5 pulau selesai.</p>
            </div>
            <div className="rounded-2xl border border-[#FFB319]/30 bg-[#0F3943] p-4">
              <h4 className="font-outfit font-bold text-white">🏫 Dashboard Guru</h4>
              <p className="font-nunito text-sm text-[#E2ECEF]">Ringkasan kelas, sebaran karakter, daftar siswa, laporan akademik, pengaturan kelas (kode kelas).</p>
            </div>
            <div className="rounded-2xl border border-[#FFB319]/30 bg-[#0F3943] p-4">
              <h4 className="font-outfit font-bold text-white">👨‍👩‍👧 Laporan Orang Tua</h4>
              <p className="font-nunito text-sm text-[#E2ECEF]">Masukkan kode game anak (TN-XXXXXX) untuk melihat kemajuan &amp; Peta Bakat. Laporan bisa diunduh (jspdf).</p>
            </div>
          </div>
        </section>

        <footer className="mt-16 border-t border-[#FFB319]/30 pt-6 text-center font-nunito text-sm text-[#8DA2A6]">
          ⚙️ Tenun Nusantara — Dokumentasi Teknis. Stack, arsitektur, AI runtime &amp; alat bantu pengembangan.
        </footer>
      </main>
    </div>
  );
}
