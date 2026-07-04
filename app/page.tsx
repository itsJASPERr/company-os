"use client";

import { CreatePlanResponse } from "@/types/dto/create-plan.response";
import { ListPlansResponse } from "@/types/dto/list-plans.response";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type TabType = "plan" | "execution" | "debug";

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function Home() {
  const [tab, setTab] = useState<TabType>("plan");
  const [showHistory, setShowHistory] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const [data, setData] = useState<CreatePlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<ListPlansResponse>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchHistory() {
      setHistoryLoading(true);
      setHistoryError(null);
      try {
        const res = await fetch("/api/plans");
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const json = await res.json();
        if (!cancelled) setHistory(json);
      } catch (error) {
        console.error("History fetch error:", error);
        if (!cancelled) setHistoryError("Failed to load history.");
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    }

    fetchHistory();
    return () => { cancelled = true; };
  }, []);

  const markdown = data?.markdown ?? "";
  const dag = data?.dag ?? [];

  async function runGoal() {
    if (!goalInput) return;
    setLoading(true);

    try {
      const res = await fetch("/api/plans", {
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
      setHistory((prev) => [json, ...prev]);

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

  async function loadPlanFromHistory(id: string) {
    try {
      const res = await fetch(`/api/plans/${id}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json: CreatePlanResponse = await res.json();
      setData(json);
      setTab("plan");
      setShowHistory(false);
    } catch (error) {
      console.error("Load plan error:", error);
      alert(error instanceof Error ? error.message : "Failed to load plan.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">

      {/* Main Workspace */}
      <main className="p-4 sm:p-6 max-w-4xl mx-auto">
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

        {/* Tabs + History Toggle */}
        <div className="flex items-center gap-3 mb-4">
          <nav className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(["plan", "execution", "debug"] as TabType[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setShowHistory(false); }}
                className={`text-xs font-medium py-2 px-3 rounded-lg capitalize transition-all ${!showHistory && tab === t
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
                  }`}
              >
                {t}
              </button>
            ))}
          </nav>
          <button
            onClick={() => setShowHistory((v) => !v)}
            className={`text-xs font-medium py-2 px-3 rounded-xl border transition-all ${showHistory
              ? "bg-slate-700 border-slate-600 text-white shadow-sm"
              : "bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600"
              }`}
          >
            History
          </button>
        </div>

        {/* Content Container */}
        <section className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 min-h-[360px] backdrop-blur-sm">

          {/* HISTORY */}
          {showHistory && (
            <div className="space-y-1.5">
              {historyLoading ? (
                <p className="text-xs text-slate-500 italic px-2 py-1">Loading...</p>
              ) : historyError ? (
                <p className="text-xs text-red-400 px-2 py-1">{historyError}</p>
              ) : history.length === 0 ? (
                <p className="text-xs text-slate-500 italic px-2 py-1">No plans yet.</p>
              ) : (
                history.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => loadPlanFromHistory(plan.id)}
                    className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-800 ${data?.id === plan.id ? "bg-slate-800 ring-1 ring-indigo-500/40" : ""}`}
                  >
                    <p className="text-xs font-medium text-slate-200 line-clamp-2 leading-snug">{plan.goal}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{new Date(plan.createdAt).toLocaleString()}</p>
                  </button>
                ))
              )}
            </div>
          )}

          {/* TAB: PLAN */}
          {!showHistory && tab === "plan" && (
            // Ensure 'prose' and 'prose-invert' are present to trigger Tailwind Typography
            <article className="prose prose-invert max-w-none [&>h1]:text-3xl [&>h1]:font-bold [&>h2]:text-2xl [&>h2]:mt-6">
              {markdown ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdown}
                </ReactMarkdown>
              ) : (
                <p className="text-sm text-slate-500 italic">No plan generated yet.</p>
              )}
            </article>
          )}

          {/* TAB: EXECUTION */}
          {!showHistory && tab === "execution" && (
            <div className="space-y-3">
              {dag.length > 0 ? (
                dag.map((task) => (
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
                <p className="text-sm text-slate-500 italic">No DAG nodes. Generate a plan first.</p>
              )}
            </div>
          )}

          {/* TAB: DEBUG */}
          {!showHistory && tab === "debug" && (
            <pre className="text-xs font-mono text-emerald-400 bg-slate-950 p-4 rounded-xl overflow-auto max-h-[450px] border border-slate-800/60 custom-scrollbar whitespace-pre-wrap break-words">
              {data ? JSON.stringify(data, null, 2) : "// No data available"}
            </pre>
          )}
        </section>
      </main>
    </div>
  );
}

