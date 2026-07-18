import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AssistantPage from '../app/assistant/page';
import { vi, beforeAll, beforeEach, describe, it, expect } from 'vitest';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('Fan Assistant UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renders the chat interface securely', () => {
    render(<AssistantPage />);
    const heading = screen.getByRole('heading', { name: /Fan Copilot/i });
    expect(heading).toBeDefined();
    
    const input = screen.getByRole('textbox', { name: /Ask about/i });
    expect(input).toBeDefined();
    expect(input.getAttribute('aria-label')).toBeDefined();
  });

  it('allows user to send a message and get a response', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ reply: "Gate A is open." })
    });

    render(<AssistantPage />);
    
    const input = screen.getByRole('textbox', { name: /Ask about/i });
    const button = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'Where is gate A?' } });
    fireEvent.click(button);

    // Should render the user message
    expect(screen.getByText('Where is gate A?')).toBeDefined();
    
    // Should render loading state
    expect(screen.getByText('Thinking...')).toBeDefined();

    // Should render AI response
    await waitFor(() => {
      expect(screen.getByText('Gate A is open.')).toBeDefined();
    });
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error("Network Error"));

    render(<AssistantPage />);
    
    const input = screen.getByRole('textbox', { name: /Ask about/i });
    const button = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'Where is gate A?' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Failed to connect/i)).toBeDefined();
    });
  });
});
