import Link from "next/link";
import { MessageSquare, LayoutDashboard } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
          StadiumSync
        </h1>
        <p className="text-xl text-gray-400">
          The next-generation stadium operations and fan experience platform. 
          Powered by Generative AI for the FIFA World Cup 2026.
        </p>

        <div className="grid md:grid-cols-2 gap-6 pt-12">
          <Link href="/assistant" className="group relative p-8 rounded-2xl bg-gray-900 border border-gray-800 hover:border-blue-500 transition-all flex flex-col items-center text-center gap-4">
            <div className="p-4 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
              <MessageSquare className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold">Fan Copilot</h2>
            <p className="text-gray-400">Multilingual matchday assistant for navigation and accessibility.</p>
          </Link>

          <Link href="/operations" className="group relative p-8 rounded-2xl bg-gray-900 border border-gray-800 hover:border-emerald-500 transition-all flex flex-col items-center text-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-full group-hover:bg-emerald-500/20 transition-colors">
              <LayoutDashboard className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-semibold">Command Center</h2>
            <p className="text-gray-400">Live crowd telemetry, incident tracking, and AI briefings.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
