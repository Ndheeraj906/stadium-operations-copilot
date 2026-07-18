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

describe('AssistantPage Interactive', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renders the chat interface securely', () => {
    render(<AssistantPage />);
    expect(screen.getByText('Fan Copilot')).toBeDefined();
    expect(screen.getByRole('textbox', { name: /Your question/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Ask StadiumIQ/i })).toBeDefined();
  });

  it('allows user to send a message and get a response', async () => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({ reply: "Gate A is open." })
    });

    render(<AssistantPage />);
    
    const input = screen.getByRole('textbox', { name: /Your question/i });
    const button = screen.getByRole('button', { name: /Ask StadiumIQ/i });

    fireEvent.change(input, { target: { value: 'Where is gate A?' } });
    fireEvent.click(button);

    expect(input).toHaveProperty('value', '');
    expect(screen.getByText('Where is gate A?')).toBeDefined();
    
    await waitFor(() => {
      expect(screen.getByText('Gate A is open.')).toBeDefined();
    });
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("Network Error"));

    render(<AssistantPage />);
    
    const input = screen.getByRole('textbox', { name: /Your question/i });
    const button = screen.getByRole('button', { name: /Ask StadiumIQ/i });

    fireEvent.change(input, { target: { value: 'Broken?' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Failed to connect/i)).toBeDefined();
    });
  });
});
