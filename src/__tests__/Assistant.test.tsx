import { render, screen } from '@testing-library/react';
import AssistantPage from '../app/assistant/page';
import { vi, beforeAll, describe, it, expect } from 'vitest';

// Mock matchMedia if not present in jsdom
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('Fan Assistant UI', () => {
  it('renders the chat interface securely', () => {
    render(<AssistantPage />);
    const heading = screen.getByRole('heading', { name: /Fan Copilot/i });
    expect(heading).toBeDefined();
    
    const input = screen.getByRole('textbox', { name: /Ask about/i });
    expect(input).toBeDefined();
    expect(input.getAttribute('aria-label')).toBeDefined();
  });
});
