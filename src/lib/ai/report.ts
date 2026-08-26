import { generateWithFallback } from "./generate";
import type { TalentProfile } from "@/lib/scoring/engine";
import { traitLabel } from "@/lib/scoring/engine";

export interface ReportRequest {
  playerName: string;
  profile: TalentProfile;
  islandsCompleted: number;
  totalActsCompleted: number;
}

export interface ReportResult {
  narrative: string; // narasi pribadi dari NALA
  topTrait: string;
}

const REPORT_SYSTEM_PROMPT = `Kamu adalah NALA, kawan petualang anak-anak Indonesia dalam platform edukasi "Tenun Nusantara".
Tugasmu: menulis narasi "Peta Bakat" yang hangat dan memotivasi anak (usia 7-14) berdasarkan hasil eksplorasi mereka.

Aturan:
- Bahasa Indonesia sederhana, ramah anak, kalimat pendek (2-4 kalimat per paragraf, maksimal 3 paragraf).
- Sebut nama anak dan kecerdasan terkuatnya dengan bangga.
- Beri 1 kalimat apresiasi dan 1 dorongan untuk terus berkembang.
- Jangan menyebut "AI" atau "model bahasa". Kamu NALA.
- Jangan menilai benar/salah. Fokus pada kekuatan dan potensi.
- Keluarkan HANYA narasi teks, tanpa judul, tanpa "NALA:", tanpa tanda kutip berlebih.`;

function fallbackReport(req: ReportRequest): ReportResult {
  const top = traitLabel(req.profile.topTrait);
  const name = req.playerName || "Penjelajah";
  const n = req.profile.assessmentCount;
  const islands = req.islandsCompleted;
  return {
    topTrait: req.profile.topTrait,
    narrative:
      `Halo, ${name}! Wah, kamu sudah menjelajah ${islands} pulau dan menyelesaikan ${req.profile.totalActsCompleted} babak petualangan. ` +
      `Dari semua pilihan dan permainanmu, aku melihat bakat terkuatmu ada di bidang ${top}. ` +
      `Kamu punya cara berpikir dan berperasaan yang istimewa! Terus asah bakatmu ya, karena setiap langkahmu membuat Nusantara makin berwarna. Ayo lanjutkan petualanganmu!`,
  };
}

export async function generateReport(req: ReportRequest): Promise<ReportResult> {
  const dimsText = req.profile.traits
    .map((d) => `- ${d.label}: ${d.score}/100`)
    .join("\n");

  const userPrompt =
    `Data hasil petualangan anak bernama "${req.playerName || "Penjelajah"}":\n` +
    `- Pulau selesai: ${req.islandsCompleted}\n` +
    `- Babak selesai: ${req.totalActsCompleted}\n` +
    `- Jumlah jawaban asesmen: ${req.profile.assessmentCount}\n` +
    `- Skor kecerdasan:\n${dimsText}\n` +
    `- Kecerdasan terkuat: ${traitLabel(req.profile.topTrait)}\n\n` +
    `Tuliskan narasi Peta Bakat yang hangat dan memotivasi untuk anak ini.`;

  const text = await generateWithFallback({
    system: REPORT_SYSTEM_PROMPT,
    prompt: userPrompt,
    maxTokens: 512,
    timeoutMs: 20000,
  });

  if (!text) return fallbackReport(req);

  const cleaned = text.trim();
  return {
    topTrait: req.profile.topTrait,
    narrative: cleaned || fallbackReport(req).narrative,
  };
}
