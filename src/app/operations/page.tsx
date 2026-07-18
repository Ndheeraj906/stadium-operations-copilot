"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Activity, AlertTriangle, Leaf, Zap } from "lucide-react";
import Link from "next/link";

export default function OperationsPage() {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/operations")
      .then(res => res.json())
      .then(data => setTelemetry(data));
  }, []);

  const generateBriefing = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/operations", { method: "POST" });
      const data = await res.json();
      setBriefing(data.briefing || data.error || "Failed to generate briefing.");
    } catch (err) {
      setBriefing("Error communicating with AI.");
    }
    setLoading(false);
  };

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
        <section className="col-span-1 bg-gray-900 border border-gray-800 rounded-2xl p-6" aria-labelledby="density-heading">
          <h2 id="density-heading" className="text-lg font-semibold mb-4 text-gray-300">Live Crowd Density</h2>
          <div className="space-y-4">
            {telemetry.crowdDensity.map((zone: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{zone.zone}</span>
                  <span className={zone.status === "Critical" ? "text-red-400" : zone.status === "Busy" ? "text-yellow-400" : "text-emerald-400"}>
                    {zone.occupancyPercent}%
                  </span>
                </div>
                <div 
                  className="w-full bg-gray-800 rounded-full h-2"
                  role="meter" 
                  aria-valuenow={zone.occupancyPercent} 
                  aria-valuemin={0} 
                  aria-valuemax={100}
                  aria-label={`${zone.zone} density`}
                >
                  <div 
                    className={`h-2 rounded-full ${zone.status === "Critical" ? "bg-red-500" : zone.status === "Busy" ? "bg-yellow-500" : "bg-emerald-500"}`}
                    style={{ width: `${zone.occupancyPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="col-span-1 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-300 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" /> Active Incidents
          </h2>
          <div className="space-y-3">
            {telemetry.incidents.map((inc: any, i: number) => (
              <div key={i} className="p-3 bg-gray-800 rounded-xl border border-gray-700 text-sm">
                <div className="font-medium text-white">{inc.id} - {inc.type}</div>
                <div className="text-gray-400 flex justify-between mt-1">
                  <span>{inc.location}</span>
                  <span className="text-yellow-400">{inc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-300 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-400" /> Sustainability
          </h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400">Waste Diverted</div>
              <div className="text-2xl font-bold text-white">{telemetry.sustainability.wasteDivertedPercent}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Energy Usage</div>
              <div className="text-2xl font-bold text-white">{telemetry.sustainability.energyUsageKwH.toLocaleString()} kWh</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Water Refills</div>
              <div className="text-2xl font-bold text-white">{telemetry.sustainability.waterRefills.toLocaleString()}</div>
            </div>
          </div>
        </div>
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
