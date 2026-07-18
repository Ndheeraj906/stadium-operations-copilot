import { describe, it, expect, vi } from 'vitest';
import { GET, POST } from '../app/api/operations/route';
import { NextResponse } from 'next/server';

// Mock genai
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: "Mocked AI Briefing"
      })
    }
  }))
}));

describe('Operations API Route', () => {
  it('GET returns telemetry data', async () => {
    const response = await GET();
    const data = await response.json();
    expect(data).toHaveProperty('crowdDensity');
    expect(data).toHaveProperty('incidents');
    expect(data).toHaveProperty('sustainability');
  });

  it('POST generates an AI briefing', async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const response = await POST();
    const data = await response.json();
    expect(data).toHaveProperty('briefing');
    expect(data.briefing).toBe('Mocked AI Briefing');
  });

  it('POST returns 500 if GEMINI_API_KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    const response = await POST();
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Missing GEMINI_API_KEY');
  });
});
