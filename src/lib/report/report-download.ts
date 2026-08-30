// ============================================================
// Pembuat Laporan HTML yang proper (self-contained, inline CSS)
// untuk tombol "Unduh Laporan" di Peta Bakat.
// ============================================================

import type { Session, SessionEvent } from "@/lib/session/session";
import type { TalentProfile } from "@/lib/scoring/engine";

export interface BuildReportInput {
  player: { name: string; characterId: string };
  session: Session;
  events: SessionEvent[];
  profile: TalentProfile | null;
  narrative: string;
  gameCode: string;
}

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

const ISLAND_LABELS: Record<string, string> = {
  candi: "Pulau Candi",
  rimba: "Pulau Rimba",
  harmoni: "Pulau Harmoni",
  aksara: "Pulau Aksara",
  terapung: "Pulau Terapung",
};

const CHARACTER_LABELS: Record<string, string> = {
  bayu: "Bayu",
  siti: "Siti",
  nyoman: "Nyoman",
  ulan: "Ulan",
};

/** Durasi manusiawi dari dua timestamp ISO. */
export function formatDuration(startIso?: string, endIso?: string): string {
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

/** Susun laporan HTML mandiri. Return string HTML penuh. */
export function buildReportHtml(input: BuildReportInput): string {
  const { player, session, events, profile, narrative, gameCode } = input;
  const name = player.name || "Penjelajah";

  // Statistik bantuan & aktivitas dari event nyata.
  const hintCount = events.filter((e) => e.type === "hint_opened").length;
  const wrongCount = events.filter((e) => e.type === "minigame_wrong").length;
  const assessmentCount = events.filter((e) => e.type === "assessment_answer").length;
  const reflectionCount = events.filter((e) => e.type === "reflection_answer").length;
  const actCount = events.filter((e) => e.type === "act_complete").length;
  const totalEvents = events.length;

  const islandsCompleted = new Set(session.completedIslands).size;
  const doneIslandNames = session.completedIslands
    .map((id) => ISLAND_LABELS[id] || id)
    .join(", ") || "Belum ada";

  // Lencana (badges) disimpan di session.
  const badges = Array.isArray(session.badges) ? session.badges : [];

  // Bakat: bar untuk 8 dimensi + top 3.
  const top3 = profile
    ? [...profile.traits].sort((a, b) => b.score - a.score).slice(0, 3)
    : [];

  const traitBars = profile
    ? profile.traits
        .map((t) => {
          const pct = Math.max(2, Math.min(100, t.score));
          return `
          <div class="trait">
            <div class="trait-head">
              <span class="trait-label">${t.emoji} ${esc(t.label)}</span>
              <span class="trait-score">${t.score}</span>
            </div>
            <div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>
          </div>`;
        })
        .join("")
    : "<p class='muted'>Belum ada data asesmen untuk menghitung bakat.</p>";

  const top3Html = top3
    .map(
      (t) => `
      <div class="top-card">
        <div class="top-card-title">${t.emoji} ${esc(t.label)}</div>
        <p>${esc(STRENGTH_DESC[t.key] || "Bakat yang terus berkembang lewat setiap petualangan.")}</p>
      </div>`
    )
    .join("");

  const narrativeHtml = narrative
    ? `<div class="narrative"><p>${esc(narrative)}</p></div>`
    : "";

  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Laporan Peta Bakat — ${esc(name)} (${esc(gameCode)})</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Roboto, Arial, sans-serif;
    background: #f4f7f8;
    color: #0B1D23;
    line-height: 1.55;
    padding: 28px 16px;
  }
  .sheet {
    max-width: 820px;
    margin: 0 auto;
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(6, 15, 20, 0.12);
    border: 1px solid #e2ecf0;
  }
  header {
    background: linear-gradient(135deg, #0F3943, #09242B);
    color: #fff;
    padding: 28px 32px;
  }
  header h1 { font-size: 24px; font-weight: 800; color: #FFB319; }
  header p { font-size: 13px; color: #BBD4DA; margin-top: 6px; }
  .gamecode {
    display: inline-block; margin-top: 12px;
    background: #FFB319; color: #0B1D23;
    font-weight: 800; font-size: 14px; letter-spacing: 1px;
    padding: 6px 14px; border-radius: 999px;
  }
  .body { padding: 28px 32px; }
  h2 {
    font-size: 16px; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.5px; color: #0F3943;
    border-bottom: 2px solid #FFB319;
    padding-bottom: 6px; margin: 26px 0 14px;
  }
  h2:first-child { margin-top: 0; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 600px){ .grid2 { grid-template-columns: 1fr; } }
  .kv { background: #f2f8fa; border: 1px solid #dbe8ed; border-radius: 10px; padding: 12px 14px; }
  .kv .k { font-size: 11px; font-weight: 700; color: #19A07E; text-transform: uppercase; letter-spacing: 0.4px; }
  .kv .v { font-size: 15px; font-weight: 700; color: #0B1D23; margin-top: 2px; word-break: break-word; }
  .kv.full { grid-column: 1 / -1; }
  ul.chips { list-style: none; display: flex; flex-wrap: wrap; gap: 6px; }
  ul.chips li {
    background: #0F3943; color: #fff; font-size: 12px; font-weight: 600;
    padding: 4px 10px; border-radius: 999px;
  }
  .trait { margin-bottom: 10px; }
  .trait-head { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  .trait-score { font-weight: 800; color: #0F3943; }
  .bar { height: 12px; background: #e3edf1; border-radius: 999px; overflow: hidden; }
  .bar-fill { height: 100%; background: linear-gradient(90deg, #FFB319, #F7C948); border-radius: 999px; }
  .top3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 6px; }
  @media (max-width: 600px){ .top3 { grid-template-columns: 1fr; } }
  .top-card { background: #f2f8fa; border: 1px solid #dbe8ed; border-left: 4px solid #FFB319; border-radius: 10px; padding: 12px; }
  .top-card-title { font-weight: 800; font-size: 14px; color: #0F3943; margin-bottom: 4px; }
  .top-card p { font-size: 12px; color: #415a63; }
  .narrative {
    background: #FFF8E6; border: 1px solid #F7C948; border-radius: 12px;
    padding: 16px; font-size: 14px; font-style: italic; color: #5a4a10;
  }
  .stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  @media (max-width: 600px){ .stat-row { grid-template-columns: 1fr 1fr; } }
  .stat { text-align: center; background: #0F3943; color: #fff; border-radius: 12px; padding: 14px 8px; }
  .stat .num { font-size: 24px; font-weight: 800; color: #FFB319; }
  .stat .lbl { font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px; color: #BBD4DA; }
  footer { background: #f2f8fa; border-top: 1px solid #e2ecf0; padding: 16px 32px; font-size: 11px; color: #7a919b; }
  .muted { color: #7a919b; font-size: 13px; }
</style>
</head>
<body>
  <div class="sheet">
    <header>
      <h1>📊 Laporan Peta Bakat — Tenun Nusantara</h1>
      <p>Analisis kecerdasan majemuk dari eksplorasi pulau Nusantara.</p>
      <span class="gamecode">KODE GAME: ${esc(gameCode)}</span>
    </header>

    <div class="body">
      <h2>Data Pemain</h2>
      <div class="grid2">
        <div class="kv"><div class="k">Nama</div><div class="v">${esc(name)}</div></div>
        <div class="kv"><div class="k">Karakter</div><div class="v">${esc(CHARACTER_LABELS[player.characterId] || player.characterId || "-")}</div></div>
        <div class="kv"><div class="k">Tanggal Mulai</div><div class="v">${esc(fmtDate(session.startedAt))}</div></div>
        <div class="kv"><div class="k">Terakhir Aktif</div><div class="v">${esc(fmtDate(session.lastActiveAt))}</div></div>
        <div class="kv"><div class="k">Durasi Eksplorasi</div><div class="v">${esc(formatDuration(session.startedAt, session.lastActiveAt))}</div></div>
        <div class="kv"><div class="k">Level</div><div class="v">${session.level} • ${session.xp} XP</div></div>
      </div>

      <h2>Perkembangan Petualangan</h2>
      <div class="grid2">
        <div class="kv full"><div class="k">Pulau Selesai</div><div class="v">${islandsCompleted}/5 — ${esc(doneIslandNames)}</div></div>
        <div class="kv"><div class="k">Total Babak Selesai</div><div class="v">${actCount}</div></div>
        <div class="kv"><div class="k">Lencana Diraih</div><div class="v">${badges.length}</div></div>
      </div>
      ${badges.length > 0 ? `<div style="margin-top:10px"><ul class="chips">${badges.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div>` : ""}

      <h2>Statistik Bantuan &amp; Aktivitas</h2>
      <div class="stat-row">
        <div class="stat"><div class="num">${hintCount}</div><div class="lbl">Bantuan (Petunjuk)</div></div>
        <div class="stat"><div class="num">${wrongCount}</div><div class="lbl">Salah Klik</div></div>
        <div class="stat"><div class="num">${assessmentCount}</div><div class="lbl">Jawaban Asesmen</div></div>
        <div class="stat"><div class="num">${reflectionCount}</div><div class="lbl">Refleksi</div></div>
        <div class="stat"><div class="num">${totalEvents}</div><div class="lbl">Total Aksi</div></div>
      </div>

      <h2>Profil Kecerdasan Majemuk</h2>
      ${traitBars}

      ${top3.length > 0 ? `
        <h2>Bakat Dominan</h2>
        <div class="top3">${top3Html}</div>
      ` : ""}

      ${narrativeHtml ? `<h2>Pesan NALA</h2>${narrativeHtml}` : ""}
    </div>

    <footer>
      Laporan ini dibuat otomatis oleh Tenun Nusantara (gamified talent-mapping).<br />
      Kode permainan <b>${esc(gameCode)}</b> dapat digunakan untuk membagikan atau melanjutkan hasil di <span>${esc(windowLocationReport(gameCode))}</span>.
    </footer>
  </div>
</body>
</html>`;
}

function windowLocationReport(gameCode: string): string {
  return `/report/${gameCode}`;
}

/** Pemicu unduhan laporan sebagai file .html. */
export function downloadReportHtml(input: BuildReportInput): void {
  const html = buildReportHtml(input);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Laporan-Bakat-${(input.player.name || "Penjelajah").replace(/[^\w\-]+/g, "-")}-${input.gameCode}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
