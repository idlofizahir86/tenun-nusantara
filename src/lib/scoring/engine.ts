// ============================================================
// Mesin Penilaian — mengubah data nyata (event + asesmen) menjadi
// profil kecerdasan majemuk (Peta Bakat).
//
// Sumber data:
//  - Event "assessment_answer" (trait terpilih) dari tenun-events
//  - Event "act_complete" (kemajuan per babak) dari tenun-events
//  - Jumlah pulau selesai (tenun-session / tenun-progress)
// ============================================================

export interface IntelligenceDim {
  key: string;
  label: string;
  emoji: string;
  score: number; // 0..100
}

export interface TalentProfile {
  traits: IntelligenceDim[];
  topTrait: string; // key dimensi tertinggi
  islandsCompleted: number;
  totalActsCompleted: number;
  assessmentCount: number;
}

// Petakan trait asesmen ke dimensi kecerdasan majemuk.
const TRAIT_MAP: Record<string, string> = {
  // Linguistik / Bahasa
  linguistik: "linguistik",
  naratif: "linguistik",
  penulis: "linguistik",
  pembaca: "linguistik",
  pendongeng: "linguistik",
  imajinatif: "linguistik",
  // Logis-Matematika
  logis: "logika",
  analitis: "logika",
  adil: "logika",
  efisien: "logika",
  cerdas: "logika",
  // Visual-Ruang
  visual: "visual",
  apresiatif: "visual",
  estetis: "visual",
  // Kinestetik
  kinestetik: "kinestetik",
  pemberani: "kinestetik",
  // Musikal
  musikal: "musikal",
  // Interpersonal (sosial)
  sosial: "sosial",
  pemimpin: "sosial",
  pendukung: "sosial",
  kolaboratif: "sosial",
  empati: "sosial",
  suportif: "sosial",
  pendengar: "sosial",
  jujur: "sosial",
  ramah: "sosial",
  // Intrapersonal
  eksploratif: "intrapersonal",
  teliti: "intrapersonal",
  sensorik: "intrapersonal",
  "ingin tahu": "intrapersonal",
  penasaran: "intrapersonal",
  intuitif: "intrapersonal",
  "percaya diri": "intrapersonal",
  pembelajar: "intrapersonal",
  kreatif: "intrapersonal",
  ekspresif: "intrapersonal",
  // Naturalis
  ekologis: "naturalis",
  konservatif: "naturalis",
};

const DIMENSIONS: IntelligenceDim[] = [
  { key: "linguistik", label: "Linguistik", emoji: "📖", score: 0 },
  { key: "logika", label: "Logika-Matematika", emoji: "🧮", score: 0 },
  { key: "visual", label: "Visual-Ruang", emoji: "🎨", score: 0 },
  { key: "kinestetik", label: "Kinestetik", emoji: "🤸", score: 0 },
  { key: "musikal", label: "Musikal", emoji: "🎵", score: 0 },
  { key: "sosial", label: "Interpersonal", emoji: "🤝", score: 0 },
  { key: "intrapersonal", label: "Intrapersonal", emoji: "🧘", score: 0 },
  { key: "naturalis", label: "Naturalis", emoji: "🌿", score: 0 },
];

export interface ReportEvent {
  type: string;
  trait?: string;
  islandId?: string;
  [key: string]: unknown;
}

/** Hitung profil bakat dari daftar event (assessment_answer + act_complete). */
export function computeTalentProfile(
  events: ReportEvent[],
  islandsCompleted = 0
): TalentProfile {
  const dims = DIMENSIONS.map((d) => ({ ...d }));
  const counts: Record<string, number> = {};
  let totalActs = 0;
  let assessmentCount = 0;

  for (const ev of events) {
    if (ev.type === "assessment_answer" && typeof ev.trait === "string") {
      assessmentCount++;
      const dim = TRAIT_MAP[ev.trait];
      if (dim) counts[dim] = (counts[dim] || 0) + 1;
    } else if (ev.type === "act_complete") {
      totalActs++;
    }
  }

  // Skor awal dari frekuensi trait (0..100).
  let maxCount = 0;
  for (const k in counts) if (counts[k] > maxCount) maxCount = counts[k];
  for (const d of dims) {
    const c = counts[d.key] || 0;
    d.score = maxCount > 0 ? Math.round((c / maxCount) * 100) : 0;
  }

  // Jika belum ada data asesmen, beri nilai dasar agar grafik tidak kosong.
  if (assessmentCount === 0) {
    for (const d of dims) d.score = 15;
  }

  // Bonus kecil per pulau selesai ke semua dimensi (eksplorasi menambah wawasan).
  if (islandsCompleted > 0) {
    for (const d of dims) {
      d.score = Math.min(100, d.score + islandsCompleted * 4);
    }
  }

  const sorted = [...dims].sort((a, b) => b.score - a.score);
  return {
    traits: dims,
    topTrait: sorted[0]?.key || "intrapersonal",
    islandsCompleted,
    totalActsCompleted: totalActs,
    assessmentCount,
  };
}

export function traitLabel(key: string): string {
  return DIMENSIONS.find((d) => d.key === key)?.label || key;
}

export function traitEmoji(key: string): string {
  return DIMENSIONS.find((d) => d.key === key)?.emoji || "⭐";
}
