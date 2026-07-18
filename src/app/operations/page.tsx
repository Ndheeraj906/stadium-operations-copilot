"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Activity, AlertTriangle, Leaf, Zap } from "lucide-react";
import Link from "next/link";

interface Zone {
  id: string;
  name: string;
  capacity: number;
  occupancy: number;
  densityPct: number;
  status: "critical" | "busy" | "comfortable" | "low";
}

interface Incident {
  id: string;
  zoneId: string;
  category: string;
  severity: "high" | "medium" | "low";
  summary: string;
  status: string;
  reportedAt: string;
}

interface Sustainability {
  wasteDivertedPct: number;
  energyKwh: number;
  waterRefillCount: number;
  co2SavedKg: number;
}

interface TelemetryData {
  zones: Zone[];
  incidents: Incident[];
  sustainability: Sustainability;
  generatedAt?: string;
}

const DensityCard = React.memo(({ zones }: { zones: Zone[] }) => (
  <section className="col-span-1 bg-gray-900 border border-gray-800 rounded-2xl p-6" aria-labelledby="density-heading">
    <h2 id="density-heading" className="text-lg font-semibold mb-4 text-gray-300">Live Crowd Density</h2>
    <div className="space-y-4">
      {zones.map((zone) => (
        <div key={zone.id}>
          <div className="flex justify-between text-sm mb-1">
            <h3 className="font-bold text-gray-200">{zone.name}</h3>
            <span className={zone.status === "critical" ? "text-red-400" : zone.status === "busy" ? "text-yellow-400" : "text-emerald-400"}>
              {zone.densityPct}%
            </span>
          </div>
          <div 
            className="w-full bg-gray-800 rounded-full h-2"
            role="meter" 
            aria-valuenow={zone.densityPct} 
            aria-valuemin={0} 
            aria-valuemax={100}
            aria-label={`${zone.name} density`}
          >
            <div 
              className={`h-2 rounded-full ${zone.status === "critical" ? "bg-red-500" : zone.status === "busy" ? "bg-yellow-500" : "bg-emerald-500"}`}
              style={{ width: `${zone.densityPct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </section>
));
DensityCard.displayName = "DensityCard";

const IncidentsCard = React.memo(({ incidents }: { incidents: Incident[] }) => (
  <div className="col-span-1 bg-gray-900 border border-gray-800 rounded-2xl p-6">
    <h2 className="text-lg font-semibold mb-4 text-gray-300 flex items-center gap-2">
      <AlertTriangle className="w-5 h-5 text-yellow-500" /> Active Incidents
    </h2>
    <div className="space-y-3">
      {incidents.map((inc) => (
        <div key={inc.id} className="p-3 bg-gray-800 rounded-xl border border-gray-700 text-sm">
          <div className="font-medium text-white flex justify-between">
            <span className="capitalize">{inc.category} Issue</span>
            <span className={inc.severity === 'high' ? "text-red-400" : "text-yellow-400"}>{inc.status}</span>
          </div>
          <p className="text-gray-400 mt-1">{inc.summary}</p>
        </div>
      ))}
    </div>
  </div>
));
IncidentsCard.displayName = "IncidentsCard";

const SustainabilityCard = React.memo(({ data }: { data: Sustainability }) => (
  <div className="col-span-1 bg-gray-900 border border-gray-800 rounded-2xl p-6">
    <h2 className="text-lg font-semibold mb-4 text-gray-300 flex items-center gap-2">
      <Leaf className="w-5 h-5 text-green-400" /> Sustainability
    </h2>
    <div className="space-y-4">
      <div>
        <div className="text-sm text-gray-400">Waste diverted from landfill</div>
        <div className="text-2xl font-bold text-white">{data.wasteDivertedPct}%</div>
      </div>
      <div>
        <div className="text-sm text-gray-400">Energy Usage</div>
        <div className="text-2xl font-bold text-white">{data.energyKwh.toLocaleString()} kWh</div>
      </div>
      <div>
        <div className="text-sm text-gray-400">Water Refills</div>
        <div className="text-2xl font-bold text-white">{data.waterRefillCount.toLocaleString()}</div>
      </div>
    </div>
  </div>
));
SustainabilityCard.displayName = "SustainabilityCard";

export default function OperationsPage() {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/operations/snapshot")
      .then(res => res.json())
      .then((data: TelemetryData) => setTelemetry(data))
      .catch(console.error);
  }, []);

  const generateBriefing = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/operations/briefing", { method: "POST" });
      const data = await res.json();
      setBriefing(data.briefing || data.error || "Failed to generate briefing.");
    } catch {
      setBriefing("Error communicating with AI.");
    }
    setLoading(false);
  }, []);

  if (!telemetry) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading telemetry...</div>;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="text-emerald-400" /> Command Center
          </h1>
        </div>
        <button 
          onClick={generateBriefing}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/20"
        >
          <Zap className="w-4 h-4" />
          {loading ? "Analyzing..." : "Generate AI Briefing"}
        </button>
      </header>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {telemetry.zones && <DensityCard zones={telemetry.zones} />}
        {telemetry.incidents && <IncidentsCard incidents={telemetry.incidents} />}
        {telemetry.sustainability && <SustainabilityCard data={telemetry.sustainability} />}
      </div>

      {briefing && (
        <article className="bg-gradient-to-br from-emerald-900/30 to-blue-900/30 border border-emerald-800/50 rounded-2xl p-6 shadow-xl" aria-live="polite">
          <h2 className="text-xl font-bold mb-4 text-emerald-400 flex items-center gap-2">
            <Zap className="w-6 h-6" /> Operations AI Briefing
          </h2>
          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-200 leading-relaxed bg-transparent border-none p-0">{briefing}</pre>
          </div>
        </article>
      )}
    </main>
  );
}
