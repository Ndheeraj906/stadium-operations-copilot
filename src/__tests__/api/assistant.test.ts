import { describe, it, expect, vi } from 'vitest';
import { POST } from '../app/api/assistant/route';

vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: "Mocked AI Response"
      })
    }
  }))
}));

describe('Assistant API Route', () => {
  it('POST returns 500 if GEMINI_API_KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    const request = new Request('http://localhost:3000/api/assistant', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello' })
    });
    
    const response = await POST(request);
    expect(response.status).toBe(500);
  });

  it('POST generates an AI response', async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const request = new Request('http://localhost:3000/api/assistant', {
      method: 'POST',
      body: JSON.stringify({ message: 'Where is gate A?' })
    });
    
    const response = await POST(request);
    const data = await response.json();
    expect(data.reply).toBe('Mocked AI Response');
  });

  it('POST fails with 500 on validation error (empty message)', async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const request = new Request('http://localhost:3000/api/assistant', {
      method: 'POST',
      body: JSON.stringify({ message: '' }) // fails zod min(1)
    });
    
    const response = await POST(request);
    expect(response.status).toBe(500);
  });
});
