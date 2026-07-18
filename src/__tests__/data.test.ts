import { describe, it, expect } from 'vitest';
import { getLiveTelemetry, STADIUM_DATA } from '../data/stadium';

describe('Data Layer (stadium.ts)', () => {
  it('has stadium data defined', () => {
    expect(STADIUM_DATA.name).toBe('Lumen Field');
    expect(STADIUM_DATA.zones.length).toBeGreaterThan(0);
  });

  it('generates live telemetry with valid bounds', () => {
    const telemetry = getLiveTelemetry();
    
    expect(telemetry.crowdDensity.length).toBe(STADIUM_DATA.zones.length);
    telemetry.crowdDensity.forEach(zone => {
      expect(zone.occupancyPercent).toBeGreaterThanOrEqual(0);
      expect(zone.occupancyPercent).toBeLessThanOrEqual(100);
      expect(["Low", "Busy", "Critical"]).toContain(zone.status);
    });

    expect(telemetry.incidents).toBeInstanceOf(Array);
    
    expect(telemetry.sustainability.wasteDivertedPercent).toBeGreaterThanOrEqual(40);
    expect(telemetry.sustainability.wasteDivertedPercent).toBeLessThanOrEqual(95);
  });
});
