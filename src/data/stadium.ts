export const STADIUM_DATA = {
  name: "Estadio Azteca (StadiumSync Demo)",
  location: "Mexico City",
  capacity: 83264,
  gates: [
    { id: "G1", access: "General", accessible: true, nearestTransport: "Metro Line 2" },
    { id: "G2", access: "VIP", accessible: true, nearestTransport: "Valet Parking" },
    { id: "G3", access: "General", accessible: false, nearestTransport: "Bus Stop 4" },
    { id: "G4", access: "Staff", accessible: true, nearestTransport: "Staff Shuttle" }
  ],
  facilities: [
    { name: "First Aid", location: "Level 1, Section 104" },
    { name: "Sensory Room", location: "Level 2, VIP Concourse" },
    { name: "Accessible Toilets", location: "All Levels near elevators" },
    { name: "Food Court", location: "Level 1, Concourse A & Level 3" }
  ],
  transportation: {
    metro: "Take Line 2 to Estadio Azteca station. 5 minute walk to Gate 1.",
    bus: "Bus routes 14 and 22 drop off near Gate 3.",
    rideshare: "Designated pickup/dropoff zone is near Gate 4."
  }
};

// Simulated dynamic telemetry for the operations dashboard
export const getLiveTelemetry = () => {
  return {
    crowdDensity: [
      { zone: "Gate 1", status: "Critical", occupancyPercent: 95 },
      { zone: "Gate 3", status: "Busy", occupancyPercent: 70 },
      { zone: "Food Court L1", status: "Comfortable", occupancyPercent: 40 },
    ],
    incidents: [
      { id: "INC-01", type: "Medical", location: "Section 108", status: "Investigating" },
      { id: "INC-02", type: "Maintenance", location: "Elevator B", status: "Open" }
    ],
    sustainability: {
      wasteDivertedPercent: 65,
      energyUsageKwH: 4500,
      waterRefills: 12500
    }
  };
};
