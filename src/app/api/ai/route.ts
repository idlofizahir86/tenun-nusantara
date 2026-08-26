import { NextResponse } from "next/server";
import { chatWithNala, type NalaMessage, type NalaContext } from "@/lib/ai/nala-agent";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      messages?: NalaMessage[];
      context?: NalaContext;
    };
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const context = body?.context;

    const reply = await chatWithNala(messages, context);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("API /api/ai error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}
