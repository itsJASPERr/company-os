"use client";

import { useState } from "react";

export default function Home() {
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generatePlan() {
    setLoading(true);
    setPlan("");
    setCopied(false);

    const res = await fetch("/api/plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ goal }),
    });

    const data = await res.json();
    setPlan(data.plan);
    setLoading(false);
  }

  async function copyPlan() {
    if (!plan) return;

    await navigator.clipboard.writeText(plan);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Company OS</h1>

      <textarea
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter a goal..."
        style={{ width: "100%", height: 120, marginTop: 12 }}
      />

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button onClick={generatePlan} disabled={loading || !goal}>
          {loading ? "Generating..." : "Generate Plan"}
        </button>

        <button onClick={copyPlan} disabled={!plan}>
          {copied ? "Copied ✓" : "Copy Plan"}
        </button>
      </div>

      <pre style={{ marginTop: 24, whiteSpace: "pre-wrap" }}>
        {plan}
      </pre>
    </div>
  );
}