import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getLiveTelemetry } from "../../../../data/stadium";

export async function POST() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Pass the live telemetry so Gemini can decide based on real-time data
    const telemetry = getLiveTelemetry();
    const prompt = `You are the AI Operations Commander for Estadio Azteca.
    Here is the live stadium telemetry: ${JSON.stringify(telemetry)}
    
    Identify any critical incidents or dense zones, and recommend immediate operational actions.
    Keep it concise, professional, and actionable.`;

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
