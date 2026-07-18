export const STADIUM_DATA = {
  name: "Estadio Azteca",
  gates: [
    { id: "gate-a", name: "Gate A", accessibility: ["wheelchair", "step-free"], description: "Main north entrance." },
    { id: "gate-b", name: "Gate B", accessibility: [], description: "East entrance with stairs." },
    { id: "gate-6", name: "Gate 6", accessibility: ["wheelchair", "step-free", "elevators"], description: "Fully accessible entrance with sensory room nearby." },
  ],
  transport: [
    { type: "metro", details: "Line 2 connects directly to the stadium. Fully accessible." },
    { type: "bus", details: "Fan shuttle stops at North Plaza." },
    { type: "rideshare", details: "Designated drop-off at South lot." }
  ],
  facilities: [
    { type: "sensory-room", location: "Near Gate 6", description: "Quiet space for fans with sensory needs." },
    { type: "elevators", location: "All major gates", description: "Provides step-free access to all concourses." }
  ]
};

export function getLiveTelemetry() {
  return {
    zones: [
      {
        id: 'south-concourse',
        name: 'South Concourse',
        capacity: 6000,
        occupancy: 5300,
        densityPct: 88,
        status: 'critical',
      },
      {
        id: 'north-stand',
        name: 'North Stand',
        capacity: 18000,
        occupancy: 9900,
        densityPct: 55,
        status: 'comfortable',
      },
      {
        id: 'east-plaza',
        name: 'East Plaza',
        capacity: 10000,
        occupancy: 4500,
        densityPct: 45,
        status: 'comfortable',
      }
    ],
    incidents: [
      {
        id: 'inc-001',
        zoneId: 'south-concourse',
        category: 'crowd',
        severity: 'high',
        summary: 'Congestion at the South Concourse food court.',
        status: 'open',
        reportedAt: new Date().toISOString(),
      },
    ],
    sustainability: {
      wasteDivertedPct: 68,
      energyKwh: 41200,
      waterRefillCount: 5230,
      co2SavedKg: 1840,
    },
    generatedAt: new Date().toISOString(),
  };
}
