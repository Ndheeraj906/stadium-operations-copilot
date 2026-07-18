import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OperationsPage from '../app/operations/page';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockTelemetry = {
  zones: [
    {
      id: 'south-concourse',
      name: 'South Concourse',
      capacity: 6000,
      occupancy: 5300,
      densityPct: 88,
      status: 'critical',
    },
  ],
  incidents: [
    {
      id: 'inc-001',
      zoneId: 'south-concourse',
      category: 'crowd',
      severity: 'high',
      summary: 'Congestion at the South Concourse food court.',
      status: 'open',
      reportedAt: '2026-07-06T17:05:00.000Z',
    },
  ],
  sustainability: {
    wasteDivertedPct: 68,
    energyKwh: 41200,
    waterRefillCount: 5230,
    co2SavedKg: 1840,
  },
  generatedAt: '2026-07-06T17:10:00.000Z',
};

describe('OperationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially, then telemetry', async () => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => mockTelemetry
    });

    render(<OperationsPage />);
    expect(screen.getByText(/Loading telemetry/i)).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText('South Concourse')).toBeDefined();
    });

    expect(screen.getByText('Congestion at the South Concourse food court.')).toBeDefined();
    expect(screen.getByText(/68%/)).toBeDefined();
  });

  it('generates an AI briefing successfully', async () => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ json: async () => mockTelemetry }) 
      .mockResolvedValueOnce({ json: async () => ({ briefing: "Redirect fans to North Stand." }) }); 

    render(<OperationsPage />);
    await waitFor(() => {
      expect(screen.getByText('South Concourse')).toBeDefined();
    });

    const btn = screen.getByRole('button', { name: /Generate AI Briefing/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText('Redirect fans to North Stand.')).toBeDefined();
    });
  });

  it('displays an error if AI briefing fails', async () => {
    (global.fetch as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ json: async () => mockTelemetry }) 
      .mockRejectedValueOnce(new Error("API Error"));

    render(<OperationsPage />);
    await waitFor(() => {
      expect(screen.getByText('South Concourse')).toBeDefined();
    });

    const btn = screen.getByRole('button', { name: /Generate AI Briefing/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText(/Error communicating/i)).toBeDefined();
    });
  });
});
