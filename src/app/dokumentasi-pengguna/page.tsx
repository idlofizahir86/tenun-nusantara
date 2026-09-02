"use client";

import { useState } from "react";

// ============================================================
// Dokumentasi Pengguna — Tenun Nusantara
// Route: /dokumentasi-pengguna
// Berisi panduan lengkap untuk 3 peran (Siswa, Guru, Orang Tua)
// lengkap dengan tangkapan layar dari aplikasi aslinya.
// ============================================================

const NAV = [
  { id: "pengenalan", label: "Pengenalan" },
  { id: "semua-peran", label: "Semua Peran" },
  { id: "siswa", label: "Siswa" },
  { id: "guru", label: "Guru" },
  { id: "orang-tua", label: "Orang Tua" },
];

const ISLANDS = [
  {
    id: "candi",
    emoji: "🏛️",
    name: "Pulau Candi",
    category: "Logika-Matematika & Analitis",
    accent: "#D4A574",
    desc: "Melatih penalaran logis, ketelitian, dan kemampuan analitis. Anak mengamati, menyusun pola relief, dan merekayasa aliran air.",
    acts: ["Observasi Lapangan", "Puzzle Pola Relief", "Rekayasa Aliran Air"],
    trait: "Logika-Matematika & Analitis",
  },
  {
    id: "rimba",
    emoji: "🌿",
    name: "Pulau Rimba",
    category: "Naturalis & Sustainability",
    accent: "#7AC74F",
    desc: "Mengasah kepekaan terhadap alam, kemampuan mengelompokkan, dan kepedulian lingkungan (kecerdasan ekologis).",
    acts: ["Ekspedisi Kanopi", "Detektif Satwa & Jejak", "Rekonstruksi Filtrasi"],
    trait: "Naturalis",
  },
  {
    id: "harmoni",
    emoji: "🎵",
    name: "Pulau Harmoni",
    category: "Seni & Creative Thinking",
    accent: "#FFB319",
    desc: "Mengembangkan kreativitas, apresiasi estetika, dan kepekaan seni lewat warna, nada gamelan, dan motif tenun.",
    acts: ["Kumpulkan Warna Tenun", "Tuning Gamelan", "Kanvas Tenun Digital"],
    trait: "Visual-Ruang & Musikal",
  },
  {
    id: "terapung",
    emoji: "⛵",
    name: "Pulau Pasar Terapung",
    category: "Interpersonal & Kepemimpinan",
    accent: "#4FA3F7",
    desc: "Melatih kerja sama, kemampuan bertukar (barter), dan kepemimpinan dalam menengahi perselisihan.",
    acts: ["Navigasi Dermaga", "Barter Logistik", "Mediasi Perselisihan"],
    trait: "Interpersonal & Kepemimpinan",
  },
  {
    id: "aksara",
    emoji: "📜",
    name: "Pulau Aksara",
    category: "Linguistik & Narrative Literacy",
    accent: "#9E77F3",
    desc: "Menumbuhkan kecintaan pada bahasa, sastra, pantun, dan kemampuan bercerita melalui alur wayang.",
    acts: ["Penelusuran Prasasti", "Rekonstruksi Bait Sastra", "Alur Wayang"],
    trait: "Linguistik & Naratif",
  },
];

const HARMONI_FLOW = [
  { img: "/docs/screenshots/student/harmoni-act1-observe.png", cap: "Babak 1 — Kumpulkan Warna Tenun (Observe): ketuk bahan pewarna alami." },
  { img: "/docs/screenshots/student/harmoni-act2-tune.png", cap: "Babak 2 — Tuning Gamelan: selaraskan nada dalam zona emas." },
  { img: "/docs/screenshots/student/harmoni-act3-weave.png", cap: "Babak 3 — Kanvas Tenun Digital: lengkapi pola motif tenun." },
  { img: "/docs/screenshots/student/assessment-modal.png", cap: "Asesmen Senyap: pertanyaan mendadak untuk memetakan minat-bakat." },
  { img: "/docs/screenshots/student/harmoni-reflection-question.png", cap: "Sesi Refleksi bersama NALA: anak merenungkan proses belajarnya." },
  { img: "/docs/screenshots/student/harmoni-island-complete.png", cap: "Pulau selesai 100% — lencana pulau diraih." },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 mb-4 font-outfit text-2xl font-extrabold text-[#FFB319]">{children}</h2>;
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-6 mb-2 font-outfit text-xl font-bold text-white">{children}</h3>;
}

function Shot({ src, caption }: { src: string; caption?: string }) {
  return (
    <figure className="my-4">
      <div className="overflow-hidden rounded-2xl border-2 border-[#FFB319]/30 bg-[#0F3943]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={caption || src} className="w-full object-contain" loading="lazy" />
      </div>
      {caption && <figcaption className="mt-2 text-center font-nunito text-sm text-[#8DA2A6]">{caption}</figcaption>}
    </figure>
  );
}

export default function UserDocumentationPage() {
  const [active, setActive] = useState("pengenalan");

  const jump = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#09242B] to-[#060F14] text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#FFB319]/30 bg-[#060F14]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <button onClick={() => jump("pengenalan")} className="flex items-center gap-2 font-outfit text-base font-extrabold text-[#FFB319]">
            🧵 Dokumentasi Pengguna
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

      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* ===== PENGENALAN ===== */}
        <section id="pengenalan">
          <h1 className="font-outfit text-4xl font-extrabold leading-tight text-white">
            Tenun Nusantara — <span className="text-[#FFB319]">Dokumentasi Pengguna</span>
          </h1>
          <p className="mt-3 font-nunito text-base text-[#E2ECEF]">
            Platform <b>gamifikasi edukatif</b> yang mengajak anak usia 7–14 tahun menjelajah 5 pulau Nusantara
            untuk <b>memetakan minat dan bakat</b> mereka. Pendamping AI <b>NALA</b> menemani setiap langkah,
            merefleksikan proses berpikir anak, lalu menyusun <b>Peta Bakat</b> (kecerdasan majemuk 8 dimensi).
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { icon: "🏝️", t: "5 Pulau Petualangan", d: "Setiap pulau menguji potensi anak lewat cara bermain yang seru." },
              { icon: "🤫", t: "Asesmen Senyap", d: "Menakar minat-bakat tanpa membuat anak merasa sedang diuji." },
              { icon: "🤖", t: "Kawan AI NALA", d: "NALA mendampingi, merefleksikan, dan memberi pesan hangat." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-[#FFB319]/40 bg-[#0F3943] p-5">
                <div className="text-3xl">{c.icon}</div>
                <h3 className="mt-2 font-outfit font-bold text-white">{c.t}</h3>
                <p className="mt-1 font-nunito text-sm text-[#8DA2A6]">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[#19D29F]/40 bg-[#0F3943] p-5">
            <h3 className="font-outfit font-bold text-[#19D29F]">3 Peran Pengguna</h3>
            <p className="mt-1 font-nunito text-sm text-[#E2ECEF]">
              Setiap peran memiliki pengalaman berbeda: <b>Anak (Siswa)</b> bermain &amp; menemukan bakatnya,{" "}
              <b>Guru</b> memantau perkembangan kelas, dan <b>Orang Tua</b> membaca laporan perjalanan belajar anak.
            </p>
          </div>
        </section>

        {/* ===== SEMUA PERAN ===== */}
        <section id="semua-peran">
          <SectionTitle>Bagian Bersama — Semua Peran</SectionTitle>
          <p className="font-nunito text-[#E2ECEF]">
            Sebelum masuk ke peran masing-masing, pengguna melewati halaman <b>Landing</b> dan pemilihan{" "}
            <b>Peran</b>.
          </p>

          <SubTitle>1. Landing Page</SubTitle>
          <Shot src="/docs/screenshots/shared/landing-hero.png" caption="Halaman utama: ajakan berpetualang melintasi 5 pulau Nusantara." />
          <Shot src="/docs/screenshots/shared/landing-full.png" caption="Landing lengkap — fitur utama & penjelasan singkat platform." />

          <SubTitle>2. Pemilihan Peran</SubTitle>
          <p className="font-nunito text-[#E2ECEF]">
            Pengguna memilih salah satu dari tiga peran. Pilihan ini menentukan menu &amp; tampilan yang digunakan
            selanjutnya.
          </p>
          <Shot src="/docs/screenshots/shared/role-selection.png" caption="Pilih peran: Siswa, Guru, atau Orang Tua." />
          <Shot src="/docs/screenshots/shared/login.png" caption="Halaman masuk — bisa dilanjutkan sebagai tamu." />
        </section>

        {/* ===== SISWA ===== */}
        <section id="siswa">
          <SectionTitle>Peran Siswa (Anak)</SectionTitle>
          <p className="font-nunito text-[#E2ECEF]">
            Siswa memilih karakter, berlayar menjelajah 5 pulau, menyelesaikan minigame + refleksi, lalu melihat
            Peta Bakat-nya.
          </p>

          <SubTitle>1. Memilih Penjelajah</SubTitle>
          <Shot src="/docs/screenshots/student/char-select.png" caption="Pilih karakter, tulis nama, dan (opsional) kode kelas dari guru." />

          <SubTitle>2. Peta Nusantara</SubTitle>
          <Shot src="/docs/screenshots/student/map-nusantara.png" caption="Peta dengan 5 pulau yang bisa dijelajahi." />
          <Shot src="/docs/screenshots/student/map-all-explored.png" caption="Semua pulau sudah dijelajahi — Level 6, Legenda Nusantara." />

          <SubTitle>3. Mengenal 5 Pulau</SubTitle>
          <p className="font-nunito text-[#E2ECEF]">
            Setiap pulau merepresentasikan <b>satu area kecerdasan</b>. Berikut penjelasan tiap pulau:
          </p>
          <div className="mt-4 flex flex-col gap-4">
            {ISLANDS.map((isl) => (
              <div key={isl.id} className="rounded-2xl border-2 bg-[#0F3943] p-5" style={{ borderColor: isl.accent + "66" }}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{isl.emoji}</span>
                  <div>
                    <h4 className="font-outfit text-lg font-extrabold text-white">{isl.name}</h4>
                    <span className="rounded-full px-2 py-0.5 font-nunito text-xs font-bold" style={{ backgroundColor: isl.accent + "22", color: isl.accent }}>
                      {isl.category}
                    </span>
                  </div>
                </div>
                <p className="mt-3 font-nunito text-sm text-[#E2ECEF]">{isl.desc}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {isl.acts.map((a, i) => (
                    <div key={a} className="rounded-xl bg-[#09242B] px-3 py-2 text-center">
                      <span className="block font-outfit text-[10px] font-bold text-[#19D29F]">Babak {i + 1}</span>
                      <span className="font-nunito text-xs text-white">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <SubTitle>4. Contoh Alur Bermain — Pulau Harmoni</SubTitle>
          <p className="font-nunito text-[#E2ECEF]">
            Pulau Harmoni (Seni &amp; Creative Thinking) dijadikan contoh. Setiap pulau memiliki 3 babak minigame
            + 1 sesi Refleksi bersama NALA.
          </p>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {HARMONI_FLOW.map((f) => (
              <div key={f.img}>
                <Shot src={f.img} caption={f.cap} />
              </div>
            ))}
          </div>

          <SubTitle>5. Peta Bakat (Laporan Siswa)</SubTitle>
          <p className="font-nunito text-[#E2ECEF]">
            Setelah kelima pulau dijelajahi, Peta Bakat terbuka. Radar 8 dimensi kecerdasan, bakat dominan, lencana,
            dan pesan hangat NALA.
          </p>
          <Shot src="/docs/screenshots/student/report-peta-bakat.png" caption="Peta Bakat — radar 8 dimensi kecerdasan majemuk." />
          <Shot src="/docs/screenshots/student/report-peta-bakat-bottom.png" caption="Lencana Permata Nusantara & detail bakat." />
        </section>

        {/* ===== GURU ===== */}
        <section id="guru">
          <SectionTitle>Peran Guru</SectionTitle>
          <p className="font-nunito text-[#E2ECEF]">
            Guru membuat kelas, membagikan kode kelas, lalu memantau perkembangan &amp; potensi siswa lewat dashboard.
          </p>
          <Shot src="/docs/screenshots/teacher/dashboard-login-gate.png" caption="Masuk sebagai guru untuk mengelola kelas." />

          <SubTitle>Ringkasan Kelas</SubTitle>
          <Shot src="/docs/screenshots/teacher/dashboard-ringkasan.png" caption="Statistik kelas: jumlah siswa, pulau selesai, rata-rata XP & level, bakat dominan." />

          <SubTitle>Sebaran Karakter</SubTitle>
          <Shot src="/docs/screenshots/teacher/dashboard-sebaran.png" caption="Distribusi bakat dominan & rata-rata skor dimensi bakat kelas." />

          <SubTitle>Daftar Siswa</SubTitle>
          <Shot src="/docs/screenshots/teacher/dashboard-daftar-siswa.png" caption="Tabel siswa dengan kemajuan, level, XP, dan bakat." />

          <SubTitle>Detail Siswa</SubTitle>
          <Shot src="/docs/screenshots/teacher/dashboard-siswa-detail.png" caption="Laporan per siswa: Peta Bakat, rekomendasi karir, catatan pengamatan pulau, langkah stimulasi." />

          <SubTitle>Laporan Akademik</SubTitle>
          <Shot src="/docs/screenshots/teacher/dashboard-laporan-naila.png" caption="Laporan akademik lengkap setelah memilih siswa." />

          <SubTitle>Pengaturan Kelas</SubTitle>
          <Shot src="/docs/screenshots/teacher/dashboard-pengaturan.png" caption="Kelola kelas: buat kelas, salin kode, ubah nama, atau hapus." />
        </section>

        {/* ===== ORANG TUA ===== */}
        <section id="orang-tua">
          <SectionTitle>Peran Orang Tua</SectionTitle>
          <p className="font-nunito text-[#E2ECEF]">
            Orang tua memasukkan <b>kode game</b> anak (format TN-XXXXXX) untuk melihat laporan perjalanan belajar
            dan Peta Bakat anak.
          </p>
          <Shot src="/docs/screenshots/parent/report-ortu-landing-kode.jpeg" caption="Masukkan kode game milik anak." />
          <Shot src="/docs/screenshots/parent/report-ortu-result.png" caption="Laporan orang tua: kemajuan, XP, level, Peta Bakat 8 dimensi." />
          <Shot src="/docs/screenshots/parent/report-ortu-result-bottom.png" caption="Detail bakat & langkah stimulasi untuk anak." />
        </section>

        <footer className="mt-16 border-t border-[#FFB319]/30 pt-6 text-center font-nunito text-sm text-[#8DA2A6]">
          🧵 Tenun Nusantara — Petualangan Mengenali Dirimu bersama NALA. Dokumentasi ini dibuat dari tangkapan
          layar aplikasi asli.
        </footer>
      </main>
    </div>
  );
}
