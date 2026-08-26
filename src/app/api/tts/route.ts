import { NextRequest } from "next/server";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

// ============================================================
// Route Text-to-Speech untuk suara NALA (anak perempuan).
//
// Prioritas:
//  1) ElevenLabs (kalau ELEVENLABS_API_KEY diset & berhasil)
//     -> suara dari .env.local (mis. TrU3igk19A4aIUi2GAA2)
//  2) Fallback: Edge TTS id-ID-GadisNeural (GRATIS, natural,
//     "Gadis" = anak perempuan Indonesia)
// ============================================================
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- Edge TTS fallback ---
async function edgeTTS(text: string): Promise<Buffer> {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(
    "id-ID-GadisNeural",
    OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3
  );
  const { audioStream } = tts.toStream(text);
  const chunks: Buffer[] = [];
  for await (const chunk of audioStream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  tts.close();
  return Buffer.concat(chunks);
}

// --- ElevenLabs (prioritas) ---
async function elevenLabsTTS(text: string): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY!;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "TrU3igk19A4aIUi2GAA2";
  const modelId = process.env.ELEVENLABS_MODEL_ID || "eleven_flash_v2_5";
  const stability = Number(process.env.ELEVENLABS_STABILITY ?? 0.8);
  const similarity = Number(process.env.ELEVENLABS_SIMILARITY ?? 0.8);

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability,
          similarity_boost: similarity,
          style: 0,
          use_speaker_boost: false,
        },
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    console.error("ElevenLabs error", res.status, err.slice(0, 200));
    throw new Error("elevenlabs failed");
  }
  return Buffer.from(await res.arrayBuffer());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    if (!text) {
      return Response.json({ error: "No text provided" }, { status: 400 });
    }

    let audio: Buffer;
    if (process.env.ELEVENLABS_API_KEY) {
      try {
        audio = await elevenLabsTTS(text);
      } catch {
        audio = await edgeTTS(text); // ElevenLabs gagal → Edge gratis
      }
    } else {
      audio = await edgeTTS(text);
    }

    return new Response(new Uint8Array(audio), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("TTS error:", err);
    return Response.json({ error: "TTS failed" }, { status: 500 });
  }
}
