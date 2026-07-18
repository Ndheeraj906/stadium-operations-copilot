import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { STADIUM_DATA } from "../../../../data/stadium";

import { z } from "zod";

const requestSchema = z.object({
  message: z.string().min(1).max(1000),
  language: z.string().optional()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, language } = requestSchema.parse(body);

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = `
      You are the StadiumSync Matchday Assistant for ${STADIUM_DATA.name}.
      Respond ONLY using the following venue data: ${JSON.stringify(STADIUM_DATA)}.
      Your responses must be in ${language || "English"}.
      If the user asks about accessibility (wheelchairs, prams), prioritize accessible routes and gates.
      Be helpful, concise, and friendly.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.1
      }
    });

    return NextResponse.json({ reply: response.text });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("AI Error:", err.message);
    }
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}
