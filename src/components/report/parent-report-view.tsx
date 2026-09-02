"use client";

import Image from "next/image";
import { Download, Star } from "lucide-react";
import { traitEmoji, traitLabel } from "@/lib/scoring/engine";
import { CAREERS, ISLAND_BLURB, NEXT_STEPS } from "@/lib/report/guidance";
import { TalentRadar } from "@/components/teacher/talent-radar";
import {
  downloadParentReport,
  type ParentReportInput,
} from "@/lib/report/parent-report";

const AVATARS: Record<string, string> = {
  bayu: "/assets/images/characters/npcs/char_bayu.png",
  siti: "/assets/images/characters/npcs/char_siti.png",
  nyoman: "/assets/images/characters/npcs/char_nyoman.png",
  ulan: "/assets/images/characters/npcs/char_ulan.png",
};

const ISLAND_META: { id: string; name: string; emoji: string }[] = [
  { id: "candi", name: "Pulau Candi", emoji: "🏛️" },
  { id: "rimba", name: "Pulau Rimba", emoji: "🌿" },
  { id: "harmoni", name: "Pulau Harmoni", emoji: "🎵" },
  { id: "aksara", name: "Pulau Aksara", emoji: "📜" },
  { id: "terapung", name: "Pulau Pasar Terapung", emoji: "⛵" },
];

const STRENGTH_DESC: Record<string, string> = {
  linguistik: "Sangat lihai merangkai kata, bercerita, dan memahami makna dari setiap bacaan serta tulisan.",
  logika: "Pandai menganalisis pola, mengurutkan struktur, dan memecahkan teka-teki dengan penalaran yang tajam.",
  visual: "Memiliki kepekaan visual yang kaya, menyusun dan merancang karya dengan harmoni bentuk dan warna.",
  kinestetik: "Lincah dan aktif, belajar paling baik lewat gerakan, praktik langsung, dan pengalaman nyata.",
  musikal: "Peka terhadap nada, irama, dan bunyi, mudah menangkap keindahan musik serta suara.",
  sosial: "Menjalin kerja sama dengan hangat, menjadi pemimpin sekaligus teman yang mendukung orang lain.",
  intrapersonal: "Tegar dan reflektif, mengenali perasaan serta tujuan diri, mandiri dan percaya diri.",
  naturalis: "Sensitif pada alam dan makhluk hidup, fasih memahami ekosistem dan kelestarian lingkungan.",
};

function fmtDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return "—";
  }
}

// Tampilan laporan orang tua di layar — data nyata, terperinci, proporsional.
export function ParentReportView({ data }: { data: ParentReportInput }) {
  const { player, profile } = data;
  const name = player.name || "Penjelajah";
  const sortedTraits = [...profile.traits].sort((a, b) => b.score - a.score);
  const top3 = sortedTraits.slice(0, 3);
  const careers = top3.map((t) => CAREERS[t.key]).filter(Boolean);
  const steps = NEXT_STEPS[profile.topTrait] || NEXT_STEPS.logika;
  const doneIslands = data.completedIslands;
  const badgeCount = data.badges.length;

  return (
    <div className="flex flex-col gap-8">
      {/* Aksi atas */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-manrope text-sm text-[#8DA2A6]">
          Laporan ini menggunakan <b className="text-[#19D29F]">data nyata</b> dari aktivitas anak selama bermain.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {/* <button
            onClick={() => printParentReport(data)}
            className="inline-flex items-center gap-2 rounded-[32px] bg-[#FFB319] px-5 py-2.5 font-outfit text-sm font-extrabold uppercase text-[#0B1D23] transition hover:brightness-110"
          >
            <Printer size={16} /> Cetak Laporan
          </button> */}
          <button
            onClick={() => downloadParentReport(data)}
            className="inline-flex items-center gap-2 rounded-[32px] bg-[#FFB319] px-5 py-2.5 font-outfit text-sm font-extrabold uppercase text-[#0B1D23] transition hover:brightness-110"
          >
            <Download size={16} /> Unduh Laporan
          </button>
        </div>
      </div>

      {/* Header identitas */}
      <section className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-[#FFB319] bg-[#0F3943] p-6 lg:flex-row lg:items-center lg:p-8">
        <div className="flex items-center gap-5">
          <Image
            src={AVATARS[player.characterId] ?? AVATARS.siti}
            alt={name}
            width={80}
            height={80}
            className="h-20 w-20 rounded-full border-2 border-[#FFB319] object-cover"
          />
          <div className="flex flex-col gap-1.5">
            <h1 className="font-outfit text-3xl font-extrabold text-white">{name}</h1>
            <p className="font-manrope text-sm text-[#8DA2A6]">
              {player.motif || "Petualang Nusantara"} • Karakter {player.characterId}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#FFB319] bg-[#09242B] px-3 py-1 font-outfit text-[11px] font-bold text-[#FFB319]">
                KODE GAME: {data.gameCode}
              </span>
              {data.classCode && (
                <span className="rounded-full border border-[#19D29F] bg-[#09242B] px-3 py-1 font-outfit text-[11px] font-bold text-[#19D29F]">
                  KELAS: {data.classCode}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="font-outfit text-3xl font-extrabold text-[#FFB319]">{data.xp}</div>
            <div className="font-manrope text-[10px] font-bold uppercase tracking-wider text-[#8DA2A6]">XP</div>
          </div>
          <div className="text-center">
            <div className="font-outfit text-3xl font-extrabold text-[#FFB319]">{data.level}</div>
            <div className="font-manrope text-[10px] font-bold uppercase tracking-wider text-[#8DA2A6]">Level</div>
          </div>
          <div className="text-center">
            <div className="font-outfit text-3xl font-extrabold text-[#FFB319]">{doneIslands.length}/5</div>
            <div className="font-manrope text-[10px] font-bold uppercase tracking-wider text-[#8DA2A6]">Pulau</div>
          </div>
        </div>
      </section>

      {/* Statistik ringkas */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Babak Selesai", value: profile.totalActsCompleted, accent: "#FFB319" },
          { label: "Asesmen Bakat", value: profile.assessmentCount, accent: "#19D29F" },
          { label: "Lencana Diraih", value: badgeCount, accent: "#FFB319" },
          { label: "Durasi Mulai", value: fmtDate(data.startedAt).split(",")[0], accent: "#19D29F" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#FFB319]/20 bg-[#0F3943] p-4">
            <div className="font-outfit text-2xl font-extrabold" style={{ color: s.accent }}>
              {s.value}
            </div>
            <div className="font-manrope text-xs font-bold uppercase tracking-wider text-[#8DA2A6]">
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* Radar + 8 dimensi */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-[#FFB319]/30 bg-[#0F3943] p-6">
          <h2 className="self-start font-outfit text-xl font-extrabold text-white">Peta Bakat (8 Dimensi)</h2>
          <TalentRadar traits={profile.traits} />
          <p className="text-center font-manrope text-xs text-[#8DA2A6]">
            Bakat dominan: <b className="text-[#FFB319]">{traitEmoji(profile.topTrait)} {traitLabel(profile.topTrait)}</b>
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-[#FFB319]/30 bg-[#0F3943] p-6">
          <h2 className="font-outfit text-xl font-extrabold text-white">Skor Tiap Dimensi</h2>
          <div className="flex flex-col gap-3">
            {profile.traits.map((t) => (
              <div key={t.key}>
                <div className="flex items-center justify-between font-manrope text-sm">
                  <span className="font-semibold text-[#E2ECEF]">
                    {t.emoji} {t.label}
                  </span>
                  <span className="font-outfit font-extrabold text-[#FFB319]">{t.score}<span className="text-xs text-[#8DA2A6]">/100</span></span>
                </div>
                <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-[#09242B]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FFB319] to-[#19D29F]"
                    style={{ width: `${Math.max(2, Math.min(100, t.score))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bakat dominan */}
      <section className="rounded-3xl border border-[#FFB319]/30 bg-[#0F3943] p-6">
        <h2 className="font-outfit text-xl font-extrabold text-white">Bakat Dominan</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
          {top3.map((t, i) => (
            <div key={t.key} className="rounded-2xl border border-[#FFB319]/40 bg-[#09242B] p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#144955] text-lg text-[#FFB319]">
                  {t.emoji}
                </span>
                <div>
                  <h3 className="font-outfit text-base font-extrabold text-white">{t.label}</h3>
                  <span className="font-manrope text-[11px] text-[#8DA2A6]">
                    {i === 0 ? <Star size={11} className="mr-1 inline text-[#FFB319]" /> : `Peringkat ${i + 1} • `}
                    Skor {t.score}
                  </span>
                </div>
              </div>
              <p className="mt-3 font-manrope text-[13px] leading-relaxed text-[#E2ECEF]">
                {STRENGTH_DESC[t.key] || "Bakat yang terus berkembang lewat setiap petualangan."}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Rincian pulau */}
      <section className="rounded-3xl border border-[#FFB319]/30 bg-[#0F3943] p-6">
        <h2 className="font-outfit text-xl font-extrabold text-white">Rincian Eksplorasi Pulau</h2>
        <p className="mt-1 font-manrope text-sm text-[#8DA2A6]">
          Seluruh 5 pulau telah dijelajahi. Berikut ringkasan pengamatan per pulau.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {ISLAND_META.map((is) => {
            const done = doneIslands.includes(is.id);
            return (
              <div key={is.id} className={`rounded-2xl bg-[#09242B] p-5 ${done ? "" : "opacity-60"}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-outfit text-base font-extrabold text-[#FFB319]">
                    {is.emoji} {is.name}
                  </h3>
                  <span className={`rounded-full px-2.5 py-0.5 font-manrope text-[11px] font-bold ${done ? "bg-[#19D29F]/20 text-[#19D29F]" : "bg-[#144955] text-[#8DA2A6]"}`}>
                    {done ? "Selesai ✓" : "Belum"}
                  </span>
                </div>
                <p className="mt-2 font-manrope text-xs leading-relaxed text-[#E2ECEF]">
                  {ISLAND_BLURB_DESC(is.id)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Karir */}
      <section className="rounded-3xl border border-[#FFB319]/30 bg-[#0F3943] p-6">
        <h2 className="font-outfit text-xl font-extrabold text-white">Rekomendasi Karir Masa Depan (Tren 2030)</h2>
        <p className="mt-1 font-manrope text-sm text-[#8DA2A6]">
          Dipetakan dari tiga dimensi bakat paling dominan anak.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {careers.map((c, i) => (
            <div key={i} className="rounded-2xl border border-[#FFB319]/40 bg-[#09242B] p-5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFB319] font-outfit text-xs font-extrabold text-[#0B1D23]">
                  {i + 1}
                </span>
                <h3 className="font-outfit text-sm font-extrabold text-white">{c.title}</h3>
              </div>
              <span className="mt-2 inline-block rounded bg-[#144955] px-2 py-0.5 font-manrope text-[10px] text-[#FFB319]">
                Koneksi: {c.tag}
              </span>
              <p className="mt-2 font-manrope text-xs leading-relaxed text-[#E2ECEF]">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Langkah stimulasi */}
      <section className="rounded-3xl border border-[#FFB319] bg-[#0F3943] p-6">
        <h2 className="font-outfit text-xl font-extrabold text-[#FFB319]">Langkah Stimulasi Selanjutnya</h2>
        <p className="mt-1 font-manrope text-sm text-[#8DA2A6]">
          Saran aktivitas untuk menumbuhkan bakat dominan <b className="text-[#19D29F]">{traitLabel(profile.topTrait)}</b>.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#FFB319] font-outfit text-xs font-extrabold text-[#0B1D23]">
                {i + 1}
              </div>
              <p className="font-manrope text-sm leading-relaxed text-[#E2ECEF]">{s}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ISLAND_BLURB_DESC(id: string): string {
  return ISLAND_BLURB[id]?.desc || "—";
}
