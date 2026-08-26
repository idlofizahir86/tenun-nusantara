import { generateWithFallback } from "./generate";
import { NALA_SYSTEM_PROMPT, fallbackNalaReply } from "./prompts";

export interface NalaMessage {
  role: "user" | "assistant";
  content: string;
}

export interface NalaContext {
  islandName?: string;
  act?: string;
  hint?: string;
  reflectionQuestion?: string;
  playerName?: string;
}

// Bersihkan preambul "penalaran" / meta yang kadang dikeluarkan model
// (mis. "Let's check constraint: ...", "Reasoning: ...") sehingga hanya
// dialog NALA yang tersisa.
const REASONING_RE =
  /^(let's|okay,? let me|constraint|reasoning|think|thought|note:|i'll|here(?:'s| is)|sure,? here|analysis|kalimat|check |hmm,?|hmm\.?\s|aku akan|aku harus|aku perlu)/i;

function cleanNalaOutput(raw: string): string {
  let text = raw.replace(/\s+/g, " ").trim();

  // Buang trailing echo dari prompt/system (model kadang mengulang constraint).
  const quoteIdx = text.search(/"(Kalimat|Gunakan bahasa|Jangan|Konteks)/);
  if (quoteIdx > 10) text = text.slice(0, quoteIdx).trim();

  // Hapus baris-baris awal yang berupa penalaran/meta.
  const sentences = text.split(/(?<=[.!?])\s+/);
  let start = 0;
  while (start < sentences.length && REASONING_RE.test(sentences[start].trim())) {
    start++;
  }
  const cleaned = sentences.slice(start).join(" ").trim();
  return cleaned || text;
}

// Obrolan dengan NALA via Gemini. Fallback ke balasan statis bila tak ada key.
export async function chatWithNala(
  messages: NalaMessage[],
  context?: NalaContext
): Promise<string> {
  const contextText = context
    ? `\n\nKONTEKS LOKASI:
- Pulau: ${context.islandName || "-"}
- Babak: ${context.act || "-"}
- Pemain: ${context.playerName || "Penjelajah"}
${context.hint ? `- Petunjuk yang diminta: ${context.hint}` : ""}
${context.reflectionQuestion ? `- Pertanyaan refleksi: ${context.reflectionQuestion}` : ""}`
    : "";

  const history = messages
    .map((m) => (m.role === "user" ? `Anak: ${m.content}` : `NALA: ${m.content}`))
    .join("\n");

  const prompt = `${history}\nNALA:`;

  const raw = await generateWithFallback({
    system: NALA_SYSTEM_PROMPT + contextText,
    prompt,
    temperature: 0.8,
    maxTokens: 1024,
    timeoutMs: 20000,
  });

  if (raw === null) {
    const last = [...messages].reverse().find((m) => m.role === "user");
    return fallbackNalaReply(last?.content || "");
  }
  return cleanNalaOutput(raw);
}
