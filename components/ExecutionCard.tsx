import { Task } from "@/types/domain/task";

interface ExecutionCardProps {
  task: Task;
}

export default function ExecutionCard({ task }: ExecutionCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
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
            <span
              key={dep}
              className="font-mono bg-slate-850 px-1.5 py-0.5 rounded text-slate-400 ml-1 border border-slate-800"
            >
              {dep}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
