import { NextResponse } from "next/server";
import { generateReport, type ReportRequest } from "@/lib/ai/report";

export const runtime = "nodejs";

// POST /api/reports — terima data hasil petualangan, kembalikan narasi Peta Bakat.
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<ReportRequest>;
    const request: ReportRequest = {
      playerName: body.playerName || "Penjelajah",
      profile: body.profile as ReportRequest["profile"],
      islandsCompleted: body.islandsCompleted || 0,
      totalActsCompleted: body.totalActsCompleted || 0,
    };
    if (!request.profile?.traits || !Array.isArray(request.profile.traits)) {
      return NextResponse.json({ error: "Data profil tidak lengkap." }, { status: 400 });
    }
    const result = await generateReport(request);
    return NextResponse.json(result);
  } catch (err) {
    console.error("API /api/reports error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
