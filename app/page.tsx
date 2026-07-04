"use client";

import { generateMarkdownFromPlan } from "@/lib/renderMarkdown";
import { PlanResponse } from "@/types/plan";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

type TabType = "plan" | "execution" | "debug";

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function Home() {
  const [tab, setTab] = useState<TabType>("plan");
  const [goalInput, setGoalInput] = useState("");
  const [data, setData] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const markdown = generateMarkdownFromPlan(data);
  const tasks = data?.tasks ?? [];

  async function runGoal() {
    if (!goalInput) return;
    setLoading(true);
    
    try {
      // 🚨 UPDATED ENDPOINT HERE 🚨
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goalInput }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server returned ${res.status}: ${errorText.slice(0, 100)}`);
      }

      const json = await res.json();
      setData(json);
      setTab("plan");

    } catch (error) {
      console.error("Execution Error:", error);
      alert(error instanceof Error ? error.message : "Failed to connect to the API.");
    } finally {
      setLoading(false);
    }
  }

  function copyOutput() {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main className="max-w-4xl mx-auto p-6 min-h-screen text-slate-100 bg-slate-950 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          companyOS
        </h1>
        <p className="text-sm text-slate-400 mt-1">Execution Planner</p>
      </header>

      {/* Input Action Bar */}
      <section className="flex flex-col sm:flex-row gap-3 mb-4 items-start">
        <textarea
          value={goalInput}
          onChange={(e) => setGoalInput(e.target.value)}
          placeholder="Enter a goal (e.g., build auth system, create billing API...)"
          className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-500 transition-all resize-y min-h-[52px] max-h-[200px]"
          rows={2}
        />
        <button
          onClick={runGoal}
          disabled={!goalInput || loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white text-sm font-semibold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/10 active:scale-[0.98] whitespace-nowrap h-auto"
        >
          {loading ? "Running..." : "Execute"}
        </button>
      </section>

      {/* Developer Utility Bar */}
      <section className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setGoalInput("Create a simple user profile system for Meeting Memory.")}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
        >
          Load Test Goal
        </button>
        {data && (
          <>
            <div className="w-px h-4 bg-slate-800 mx-1"></div>
            <button
              onClick={copyOutput}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors"
            >
              {copied ? "Copied ✓" : "Copy Output"}
            </button>
          </>
        )}
      </section>

      {/* Tabs */}
      <nav className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 mb-4 max-w-xs">
        {(["plan", "execution", "debug"] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 text-xs font-medium py-2 rounded-lg capitalize transition-all ${
              tab === t 
                ? "bg-slate-800 text-white shadow-sm" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      {/* Content Container */}
      <section className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 min-h-[360px] backdrop-blur-sm">
        
        {/* TAB: PLAN */}
        {tab === "plan" && (
          <article className="prose prose-invert prose-slate max-w-none prose-headings:font-semibold prose-h1:text-xl prose-h1:text-slate-200 prose-p:text-slate-300 prose-li:text-slate-300">
            {markdown ? (
              <ReactMarkdown>{markdown}</ReactMarkdown>
            ) : (
              <p className="text-sm text-slate-500 italic">No plan generated yet. Enter a goal above.</p>
            )}
          </article>
        )}

        {/* TAB: EXECUTION */}
        {tab === "execution" && (
          <div className="space-y-3">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-medium text-sm text-slate-200">
                      <span className="text-indigo-400 font-mono mr-2">{task.id}</span>
                      {task.title}
                    </h3>
                    <div className="flex gap-2">
                      {task.status && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {task.status}
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  <div className="text-xs text-slate-400 font-mono bg-slate-950/60 inline-block px-2 py-1 rounded border border-slate-800/50">
                    {task.file}
                  </div>
                  
                  {task.dependsOn.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/60 text-[11px] text-slate-500">
                      <span className="text-slate-400 font-medium">Requires:</span>{" "}
                      {task.dependsOn.map((dep) => (
                        <span key={dep} className="font-mono bg-slate-850 px-1.5 py-0.5 rounded text-slate-400 ml-1 border border-slate-800">{dep}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic">No tasks mapped. Generate a plan first.</p>
            )}
          </div>
        )}

        {/* TAB: DEBUG */}
        {tab === "debug" && (
          <pre className="text-xs font-mono text-emerald-400 bg-slate-950 p-4 rounded-xl overflow-auto max-h-[450px] border border-slate-800/60 custom-scrollbar whitespace-pre-wrap break-words">
            {data ? JSON.stringify(data, null, 2) : "// No data available"}
          </pre>
        )}
      </section>
    </main>
  );
}
