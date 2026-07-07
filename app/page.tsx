"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { PlanDto } from "@/contracts/dto/PlanDTO";
import TabBar, { TabType } from "@/components/TabBar";
import ExecutionList from "@/components/ExecutionList";


function tasksToMarkdown(plan: PlanDto): string {
  const lines: string[] = [
    `# Goal`,
    ``,
    plan.goal,
    ``,
    `## Why`,
    ``,
    plan.why,
    ``,
    `## Tasks`,
    ``,
  ];
  for (const task of plan.dag) {
    lines.push(`### ${task.id}: ${task.title}`);
    lines.push(``);
    if (task.description) {
      lines.push(task.description);
      lines.push(``);
    }
    lines.push(`- **Priority:** ${task.priority}`);
    lines.push(`- **Status:** ${task.status}`);
    if (task.file) lines.push(`- **File:** \`${task.file}\``);
    if (task.dependsOn?.length) lines.push(`- **Depends on:** ${task.dependsOn.join(", ")}`);
    lines.push(``);
  }
  return lines.join("\n");
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function Home() {
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("plan");
  const [goalInput, setGoalInput] = useState("");
  const [currentPlan, setCurrentPlan] = useState<PlanDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<PlanDto[]>([]);
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
        const json: PlanDto[] = await res.json();
        if (!cancelled) setHistory(json);
      } catch (error) {
        console.error("History fetch error:", error);
        if (!cancelled) setHistoryError("Failed to load history.");
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    }

    fetchHistory();
    return () => {
      cancelled = true;
    };
  }, []);

  async function runGoal() {
    if (!goalInput) return;
    setLoading(true);

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goalInput }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Server returned ${res.status}: ${errorText.slice(0, 100)}`
        );
      }

      await res.json(); // consume { plan: string } response

      // Refresh history and source currentPlan from backend (persisted record)
      const histRes = await fetch("/api/plans");
      if (histRes.ok) {
        const histJson: PlanDto[] = await histRes.json();
        setHistory(histJson);
        if (histJson.length > 0) setCurrentPlan(histJson[0]);
      }
      setShowHistory(false);
      setActiveTab("plan");

    } catch (error) {
      console.error("Execution Error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to connect to the API."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadPlanFromHistory(id: string) {
    try {
      const res = await fetch(`/api/plans/${id}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const plan: PlanDto = await res.json();
      setCurrentPlan(plan);
      setShowHistory(false);
      setActiveTab("plan");
    } catch (error) {
      console.error("Load plan error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to load plan."
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <main className="p-4 sm:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            companyOS
          </h1>
          <p className="text-sm text-slate-400 mt-1">Execution Planner</p>
        </header>

        {/* GoalInput */}
        <section className="flex flex-col sm:flex-row gap-3 mb-8 items-start">
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

        {/* Toolbar */}
        <TabBar
          tab={activeTab}
          setTab={setActiveTab}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
        />
        
        {/* Content */}
        <section className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 min-h-[360px] backdrop-blur-sm">

          {/* PlanHistory */}
          {showHistory && (
            <div className="space-y-1.5">
              {historyLoading ? (
                <p className="text-xs text-slate-500 italic px-2 py-1">
                  Loading...
                </p>
              ) : historyError ? (
                <p className="text-xs text-red-400 px-2 py-1">{historyError}</p>
              ) : history.length === 0 ? (
                <p className="text-xs text-slate-500 italic px-2 py-1">
                  No plans yet.
                </p>
              ) : (
                history.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => loadPlanFromHistory(plan.id)}
                    className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-800 ${
                      currentPlan?.id === plan.id
                        ? "bg-slate-800 ring-1 ring-indigo-500/40"
                        : ""
                    }`}
                  >
                    <p className="text-xs font-medium text-slate-200 line-clamp-2 leading-snug">
                      {plan.goal}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {new Date(plan.createdAt).toLocaleString()}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}

          {/* PlanViewer — Markdown */}
          {!showHistory && activeTab === "plan" && (
            <article className="prose prose-invert max-w-none [&>h1]:text-3xl [&>h1]:font-bold [&>h2]:text-2xl [&>h2]:mt-6">
              {currentPlan ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {tasksToMarkdown(currentPlan)}
                </ReactMarkdown>
              ) : (
                <p className="text-sm text-slate-500 italic">
                  No plan generated yet.
                </p>
              )}
            </article>
          )}

          {/* PlanViewer — JSON */}
          {!showHistory && activeTab === "json" && (
            <div>
              {currentPlan ? (
                <pre className="text-xs text-slate-300 bg-slate-950/60 rounded-xl p-4 overflow-auto max-h-[600px] whitespace-pre-wrap break-words">
                  {JSON.stringify(
                    { goal: currentPlan.goal, why: currentPlan.why, tasks: currentPlan.dag },
                    null,
                    2
                  )}
                </pre>
              ) : (
                <p className="text-sm text-slate-500 italic">
                  No plan generated yet.
                </p>
              )}
            </div>
          )}

          {/* PlanViewer — Execution List */}
          {!showHistory && activeTab === "execution" && (
            <ExecutionList dag={currentPlan ? currentPlan.dag : []} />
          )}

        </section>
      </main>
    </div>
  );
}

