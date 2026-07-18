import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getLiveTelemetry } from "@/data/stadium";

export async function GET() {
  try {
    const telemetry = getLiveTelemetry();
    return NextResponse.json(telemetry, {
      headers: {
        'Cache-Control': 's-maxage=10, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error("Telemetry Error:", error);
    return NextResponse.json({ error: "Failed to fetch telemetry" }, { status: 500 });
  }
}

export async function POST() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const telemetry = getLiveTelemetry();

    const prompt = `
      You are the AI Operations Commander for the stadium.
      Review the current live stadium telemetry:
      ${JSON.stringify(telemetry, null, 2)}
      
      Generate a concise, prioritized operations briefing.
      1. Highlight any critical crowd density issues and recommend redirects.
      2. Address any open incidents.
      3. Give a 1-sentence summary of sustainability impact.
      Format your response with clear headings or bullet points.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({ briefing: response.text });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("AI Generation Error:", err.message);
    }
    return NextResponse.json({ error: "Failed to generate briefing" }, { status: 500 });
  }
}
