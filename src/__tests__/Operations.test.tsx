import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import OperationsPage from '../app/operations/page';

// Mock matchMedia
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

const mockTelemetry = {
  crowdDensity: [
    { zone: "Gate A", occupancyPercent: 80, status: "Busy" }
  ],
  incidents: [
    { id: "INC-1", type: "Medical", location: "Gate A", status: "Active" }
  ],
  sustainability: {
    wasteDivertedPercent: 60,
    energyUsageKwH: 1000,
    waterRefills: 500
  }
};

describe('Operations Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renders loading state initially, then telemetry', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockTelemetry
    });

    render(<OperationsPage />);
    expect(screen.getByText('Loading telemetry...')).toBeDefined();

    expect(await screen.findByText('Gate A')).toBeDefined();
    expect(screen.getByText('80%')).toBeDefined();
  });

  it('generates an AI briefing successfully', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({ json: async () => mockTelemetry }) // init
      .mockResolvedValueOnce({ json: async () => ({ briefing: "Everything is fine." }) }); // POST

    render(<OperationsPage />);
    await waitFor(() => screen.getByText('Live Crowd Density'));

    const button = screen.getByRole('button', { name: /Generate AI Briefing/i });
    fireEvent.click(button);

    expect(screen.getByText('Analyzing...')).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText('Everything is fine.')).toBeDefined();
    });
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({ json: async () => mockTelemetry })
      .mockRejectedValueOnce(new Error("Network error"));

    render(<OperationsPage />);
    await waitFor(() => screen.getByText('Live Crowd Density'));

    const button = screen.getByRole('button', { name: /Generate AI Briefing/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Error communicating with AI.')).toBeDefined();
    });
  });
});
