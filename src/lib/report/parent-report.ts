// ============================================================
// Laporan HTML Orang Tua — versi cetak/unduh yang LEBIH DETAIL
// daripada laporan siswa. Self-contained (inline CSS), tema terang.
// Dipakai oleh tombol "Cetak Laporan" / "Unduh Laporan" orang tua.
// ============================================================

import type { SessionEvent } from "@/lib/session/session";
import type { TalentProfile } from "@/lib/scoring/engine";
import { CAREERS, ISLAND_BLURB, NEXT_STEPS } from "@/lib/report/guidance";

export interface ParentReportInput {
  player: { name: string; characterId: string; motif?: string };
  gameCode: string;
  xp: number;
  level: number;
  startedAt: string;
  lastActiveAt: string;
  classCode?: string;
  completedIslands: string[];
  badges: string[];
  profile: TalentProfile;
  events: SessionEvent[];
}

const ALL_ISLAND_IDS = ["candi", "rimba", "harmoni", "aksara", "terapung"];

const CHARACTER_LABELS: Record<string, string> = {
  bayu: "Bayu",
  siti: "Siti",
  nyoman: "Nyoman",
  ulan: "Ulan",
};

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

function esc(str: string): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fmtDate(iso?: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(startIso?: string, endIso?: string): string {
  if (!startIso) return "-";
  const start = new Date(startIso).getTime();
  const end = endIso ? new Date(endIso).getTime() : Date.now();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return "-";
  let s = Math.floor((end - start) / 1000);
  if (s < 60) return `${s} detik`;
  const m = Math.floor(s / 60);
  s = s % 60;
  if (m < 60) return `${m} mnt ${s} dtk`;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h} jam ${mm} mnt`;
}

/** Susun laporan orang tua yang detail. Return string HTML penuh. */
export function buildParentReportHtml(input: ParentReportInput): string {
  const { player, gameCode, profile, events } = input;
  const name = player.name || "Penjelajah";

  // Aktivitas nyata dari event.
  const hintCount = events.filter((e) => e.type === "hint_opened").length;
  const wrongCount = events.filter((e) => e.type === "minigame_wrong").length;
  const assessmentCount = events.filter((e) => e.type === "assessment_answer").length;
  const reflectionCount = events.filter((e) => e.type === "reflection_answer").length;
  const actCount = events.filter((e) => e.type === "act_complete").length;
  const totalEvents = events.length;

  const islandsCompleted = input.completedIslands.length;
  const badges = Array.isArray(input.badges) ? input.badges : [];

  const sortedTraits = [...profile.traits].sort((a, b) => b.score - a.score);
  const top3 = sortedTraits.slice(0, 3);
  const careers = top3.map((t) => CAREERS[t.key]).filter(Boolean);
  const steps = NEXT_STEPS[profile.topTrait] || NEXT_STEPS.logika;

  // Bar tiap dimensi (8) dengan skor + interpretasi.
  const traitBars = profile.traits
    .map((t, i) => {
      const pct = Math.max(2, Math.min(100, t.score));
      const rank = i === 0 ? "Paling dominan" : `#${i + 1}`;
      return `
      <div class="trait">
        <div class="trait-head">
          <span class="trait-label">${t.emoji} ${esc(t.label)} <em>(${esc(rank)})</em></span>
          <span class="trait-score">${t.score}<small>/100</small></span>
        </div>
        <div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>
      </div>`;
    })
    .join("");

  const top3Html = top3
    .map(
      (t) => `
      <div class="top-card">
        <div class="top-card-title">${t.emoji} ${esc(t.label)} <span class="score">${t.score}</span></div>
        <p>${esc(STRENGTH_DESC[t.key] || "Bakat yang terus berkembang lewat setiap petualangan.")}</p>
      </div>`
    )
    .join("");

  const careersHtml = careers
    .map(
      (c, i) => `
      <div class="career">
        <div class="career-rank">${i + 1}</div>
        <div>
          <div class="career-title">${esc(c.title)}</div>
          <span class="career-tag">Koneksi: ${esc(c.tag)}</span>
          <p>${esc(c.desc)}</p>
        </div>
      </div>`
    )
    .join("");

  const stepsHtml = steps
    .map(
      (s, i) => `
      <div class="step">
        <div class="step-num">${i + 1}</div>
        <p>${esc(s)}</p>
      </div>`
    )
    .join("");

  // Rincian tiap pulau (status + narasi).
  const islandsHtml = ALL_ISLAND_IDS.map((id) => {
    const blurb = ISLAND_BLURB[id];
    const done = input.completedIslands.includes(id);
    return `
      <div class="island ${done ? "done" : ""}">
        <div class="island-head">
          <span class="island-name">${esc(blurb?.name || id)}</span>
          <span class="island-status">${done ? "Selesai ✓" : "Belum"}</span>
        </div>
        <p>${esc(blurb?.desc || "—")}</p>
      </div>`;
  }).join("");

  const badgeChips =
    badges.length > 0
      ? `<ul class="chips">${badges.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`
      : `<p class="muted">Belum ada lencana diraih.</p>`;

  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Laporan Perkembangan Orang Tua — ${esc(name)} (${esc(gameCode)})</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Roboto, Arial, sans-serif;
    background: #eef3f5; color: #0B1D23; line-height: 1.55;
    padding: 24px 12px;
  }
  .sheet {
    max-width: 860px; margin: 0 auto; background: #fff;
    border-radius: 16px; overflow: hidden;
    box-shadow: 0 10px 40px rgba(6,15,20,.12); border: 1px solid #dbe8ed;
  }
  header {
    background: linear-gradient(135deg, #0F3943, #09242B); color: #fff;
    padding: 30px 36px; position: relative;
  }
  header .badge { font-size: 11px; letter-spacing: 1px; color: #BBD4DA; text-transform: uppercase; }
  header h1 { font-size: 26px; font-weight: 800; color: #FFB319; margin-top: 4px; }
  header .sub { font-size: 13px; color: #BBD4DA; margin-top: 6px; }
  header .codes { margin-top: 14px; display: flex; gap: 8px; flex-wrap: wrap; }
  .code {
    background: #FFB319; color: #0B1D23; font-weight: 800; font-size: 13px;
    letter-spacing: 1px; padding: 6px 14px; border-radius: 999px;
  }
  .code.ghost { background: rgba(255,255,255,.14); color: #fff; }
  .body { padding: 30px 36px; }
  h2 {
    font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: .5px;
    color: #0F3943; border-bottom: 2px solid #FFB319; padding-bottom: 6px;
    margin: 30px 0 14px;
  }
  h2:first-child { margin-top: 0; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media (max-width:600px){ .grid2 { grid-template-columns: 1fr; } }
  .kv { background: #f2f8fa; border: 1px solid #dbe8ed; border-radius: 10px; padding: 11px 14px; }
  .kv .k { font-size: 11px; font-weight: 700; color: #19A07E; text-transform: uppercase; letter-spacing: .4px; }
  .kv .v { font-size: 15px; font-weight: 700; color: #0B1D23; margin-top: 2px; word-break: break-word; }
  .kv.full { grid-column: 1 / -1; }
  .stat-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
  @media (max-width:600px){ .stat-row { grid-template-columns: repeat(2, 1fr); } }
  .stat { text-align: center; background: #0F3943; color: #fff; border-radius: 12px; padding: 14px 6px; }
  .stat .num { font-size: 24px; font-weight: 800; color: #FFB319; }
  .stat .lbl { font-size: 10px; text-transform: uppercase; letter-spacing: .3px; color: #BBD4DA; margin-top: 2px; }
  ul.chips { list-style: none; display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  ul.chips li { background: #0F3943; color: #fff; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 999px; }
  .trait { margin-bottom: 10px; }
  .trait-head { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  .trait-head em { font-style: normal; font-size: 11px; color: #7a919b; font-weight: 500; }
  .trait-score { font-weight: 800; color: #0F3943; }
  .trait-score small { font-size: 10px; color: #7a919b; }
  .bar { height: 12px; background: #e3edf1; border-radius: 999px; overflow: hidden; }
  .bar-fill { height: 100%; background: linear-gradient(90deg, #FFB319, #F7C948); border-radius: 999px; }
  .top3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 6px; }
  @media (max-width:600px){ .top3 { grid-template-columns: 1fr; } }
  .top-card { background: #f2f8fa; border: 1px solid #dbe8ed; border-left: 4px solid #FFB319; border-radius: 10px; padding: 12px; }
  .top-card-title { font-weight: 800; font-size: 14px; color: #0F3943; margin-bottom: 4px; }
  .top-card-title .score { float: right; color: #0F3943; font-size: 13px; }
  .top-card p { font-size: 12px; color: #415a63; }
  .career { display: flex; gap: 12px; background: #f2f8fa; border: 1px solid #dbe8ed; border-radius: 12px; padding: 14px; margin-bottom: 10px; }
  .career-rank { flex: none; width: 28px; height: 28px; border-radius: 50%; background: #FFB319; color: #0B1D23; font-weight: 800; display: flex; align-items: center; justify-content: center; }
  .career-title { font-weight: 800; font-size: 15px; color: #0F3943; }
  .career-tag { display: inline-block; margin-top: 4px; background: #0F3943; color: #FFB319; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; }
  .career p { font-size: 12px; color: #415a63; margin-top: 6px; }
  .step { display: flex; gap: 12px; margin-bottom: 10px; align-items: flex-start; }
  .step-num { flex: none; width: 24px; height: 24px; border-radius: 50%; background: #FFB319; color: #0B1D23; font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: center; margin-top: 1px; }
  .step p { font-size: 13px; color: #33484f; }
  .island { background: #f2f8fa; border: 1px solid #dbe8ed; border-radius: 12px; padding: 14px; margin-bottom: 10px; }
  .island.done { border-left: 4px solid #19A07E; }
  .island-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .island-name { font-weight: 800; font-size: 14px; color: #0F3943; }
  .island-status { font-size: 11px; font-weight: 700; }
  .island.done .island-status { color: #19A07E; }
  .island:not(.done) .island-status { color: #b08a2a; }
  .island p { font-size: 12px; color: #415a63; }
  footer { background: #f2f8fa; border-top: 1px solid #e2ecf0; padding: 16px 36px; font-size: 11px; color: #7a919b; }
  .muted { color: #7a919b; font-size: 13px; }
</style>
</head>
<body>
  <div class="sheet">
    <header>
      <div class="badge">Laporan Orang Tua • Tenun Nusantara</div>
      <h1>Laporan Perkembangan &amp; Bakat — ${esc(name)}</h1>
      <div class="sub">Analisis kecerdasan majemuk dari eksplorasi 5 pulau Nusantara.</div>
      <div class="codes">
        <span class="code">KODE GAME: ${esc(gameCode)}</span>
        ${input.classCode ? `<span class="code ghost">KELAS: ${esc(input.classCode)}</span>` : ""}
      </div>
    </header>

    <div class="body">
      <h2>Identitas Pemain</h2>
      <div class="grid2">
        <div class="kv"><div class="k">Nama</div><div class="v">${esc(name)}</div></div>
        <div class="kv"><div class="k">Karakter</div><div class="v">${esc(CHARACTER_LABELS[player.characterId] || player.characterId || "-")}</div></div>
        <div class="kv"><div class="k">Sash / Motif</div><div class="v">${esc(player.motif || "-")}</div></div>
        <div class="kv"><div class="k">Level</div><div class="v">Level ${input.level} • ${input.xp} XP</div></div>
        <div class="kv"><div class="k">Tanggal Mulai</div><div class="v">${esc(fmtDate(input.startedAt))}</div></div>
        <div class="kv"><div class="k">Terakhir Aktif</div><div class="v">${esc(fmtDate(input.lastActiveAt))}</div></div>
        <div class="kv full"><div class="k">Durasi Eksplorasi</div><div class="v">${esc(formatDuration(input.startedAt, input.lastActiveAt))}</div></div>
      </div>

      <h2>Perkembangan Petualangan</h2>
      <div class="grid2">
        <div class="kv"><div class="k">Pulau Selesai</div><div class="v">${islandsCompleted}/5</div></div>
        <div class="kv"><div class="k">Total Babak Selesai</div><div class="v">${actCount}</div></div>
        <div class="kv full"><div class="k">Lencana Permata Nusantara (${badges.length})</div><div class="v">${badgeChips}</div></div>
      </div>

      <h2>Statistik Bantuan &amp; Aktivitas</h2>
      <div class="stat-row">
        <div class="stat"><div class="num">${hintCount}</div><div class="lbl">Bantuan</div></div>
        <div class="stat"><div class="num">${wrongCount}</div><div class="lbl">Salah Klik</div></div>
        <div class="stat"><div class="num">${assessmentCount}</div><div class="lbl">Asesmen</div></div>
        <div class="stat"><div class="num">${reflectionCount}</div><div class="lbl">Refleksi</div></div>
        <div class="stat"><div class="num">${totalEvents}</div><div class="lbl">Total Aksi</div></div>
      </div>

      <h2>Rincian Eksplorasi Pulau</h2>
      ${islandsHtml}

      <h2>Profil Kecerdasan Majemuk (8 Dimensi)</h2>
      ${traitBars}

      <h2>Bakat Dominan</h2>
      <div class="top3">${top3Html}</div>

      <h2>Rekomendasi Karir Masa Depan (Tren 2030)</h2>
      ${careersHtml}

      <h2>Langkah Stimulasi Selanjutnya</h2>
      ${stepsHtml}
    </div>

    <footer>
      Laporan ini dibuat otomatis oleh Tenun Nusantara (gamified talent-mapping) untuk orang tua.<br />
      Kode game <b>${esc(gameCode)}</b> dapat dibagikan. Data bersumber dari aktivitas nyata anak selama bermain.
    </footer>
  </div>
</body>
</html>`;
}

/** Buka laporan orang tua di jendela baru dan panggil dialog cetak. */
export function printParentReport(input: ParentReportInput): void {
  const html = buildParentReportHtml(input);
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    try {
      win.print();
    } catch {
      // popup diblokir — abaikan
    }
  }, 400);
}

/** Pemicu unduhan laporan orang tua sebagai PDF otomatis (fallback: .html). */
export async function downloadParentReport(input: ParentReportInput): Promise<void> {
  const html = buildParentReportHtml(input);
  const base = `Laporan-Ortu-${(input.player.name || "Penjelajah").replace(/[^\w\-]+/g, "-")}-${input.gameCode}`;
  const { downloadHtmlAsPdf } = await import("./pdf");
  await downloadHtmlAsPdf(html, `${base}.pdf`);
}
