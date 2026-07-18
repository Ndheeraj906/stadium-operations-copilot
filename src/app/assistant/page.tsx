"use client";
import { useState } from "react";
import { Send, Bot, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AssistantPage() {
  const [messages, setMessages] = useState<{role: "user"|"ai", text: string}[]>([
    { role: "ai", text: "Hello! I am your StadiumSync Matchday Assistant. How can I help you navigate the stadium today?" }
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, language })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        role: "ai", 
        text: data.reply || data.error || "An error occurred." 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", text: "Failed to connect to the assistant." }]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Bot className="text-blue-400" /> Fan Copilot
          </h1>
        </div>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-1.5 text-sm outline-none"
        >
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
          <option>Arabic</option>
        </select>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-4xl mx-auto w-full" aria-live="polite">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`p-2 rounded-full ${msg.role === "user" ? "bg-blue-500" : "bg-gray-800"}`}>
              {msg.role === "user" ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-blue-400" />}
            </div>
            <div className={`px-5 py-3 rounded-2xl max-w-[80%] ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-gray-800 text-gray-100 rounded-tl-none"}`} role="article">
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-4" aria-busy="true">
            <div className="p-2 rounded-full bg-gray-800"><Bot className="w-5 h-5 text-blue-400 animate-pulse" /></div>
            <div className="px-5 py-3 rounded-2xl bg-gray-800 text-gray-400 rounded-tl-none animate-pulse">Thinking...</div>
          </div>
        )}
      </main>

      <footer className="p-4 border-t border-gray-800 bg-gray-900">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about gates, accessibility, transport..."
            aria-label="Ask about gates, accessibility, transport"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button 
            type="submit" 
            aria-label="Send message"
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-xl font-medium transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}
