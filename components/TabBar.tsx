import React from "react";

export type TabType = "plan" | "execution" | "json";

export interface TabBarProps {
  tab: TabType;
  setTab: (tab: TabType) => void;
  showHistory: boolean;
  setShowHistory: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TabBar({ tab, setTab, showHistory, setShowHistory }: TabBarProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <nav className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
        {(["plan", "execution", "JSON"] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setShowHistory(false);
            }}
            className={`text-xs font-medium py-2 px-3 rounded-lg capitalize transition-all ${
              !showHistory && tab === t
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
        className={`text-xs font-medium py-2 px-3 rounded-xl border transition-all ${
          showHistory
            ? "bg-slate-700 border-slate-600 text-white shadow-sm"
            : "bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600"
        }`}
      >
        History
      </button>
    </div>
  );
}
