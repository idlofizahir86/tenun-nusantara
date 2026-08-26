import { generateText } from "ai";
import { getGeminiModels } from "./gemini";

// Helper pemanggilan Gemini dengan fallback model & timeout, agar narasi/
// refleksi tidak hang selamanya atau langsung gagal bila satu model error.

export interface GenerateOptions {
  system?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

/**
 * Coba generateText ke setiap model Gemini secara berurutan sampai ada yang
 * berhasil. Kembalikan teks, atau null bila semua gagal / tak ada key.
 */
export async function generateWithFallback(
  opts: GenerateOptions
): Promise<string | null> {
  const models = getGeminiModels();
  if (models.length === 0) return null;

  const timeoutMs = opts.timeoutMs ?? 20000;

  for (const model of models) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const { text } = await generateText({
        model,
        system: opts.system,
        prompt: opts.prompt,
        temperature: opts.temperature ?? 0.7,
        maxTokens: opts.maxTokens,
        abortSignal: controller.signal,
      });
      return text;
    } catch (err) {
      console.error("Gemini generateWithFallback error:", err);
    } finally {
      clearTimeout(timer);
    }
  }

  return null;
}
