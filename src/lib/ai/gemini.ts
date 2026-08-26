import { createGoogleGenerativeAI } from "@ai-sdk/google";

// Daftar model default yang valid & stabil. "gemini-2.5-flash" adalah model
// generasi terbaru yang murah & cepat; sisanya fallback bila model pertama
// gagal/tidak tersedia di akun.
const DEFAULT_MODELS = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];

function hasValidKey(): boolean {
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) return false;
  const trimmed = key.trim();
  if (trimmed.startsWith("your_")) return false;
  return true;
}

type GeminiModel = ReturnType<ReturnType<typeof createGoogleGenerativeAI>["languageModel"]>;

/** Daftar model yang akan dicoba berurutan (fallback). Kosong bila tak ada key. */
export function getGeminiModels(): GeminiModel[] {
  if (!hasValidKey()) return [];
  const provider = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_AI_API_KEY!.trim() });
  const configured = process.env.GEMINI_MODEL?.trim();
  const list = configured ? [configured, ...DEFAULT_MODELS] : DEFAULT_MODELS;
  // dedupe (jaga urutan)
  return [...new Set(list)].map((m) => provider.languageModel(m));
}

/** Model pertama (untuk kompatibilitas / penggunaan sederhana). */
export function getGeminiModel() {
  const models = getGeminiModels();
  return models.length > 0 ? models[0] : null;
}
