import { Task } from "@/types/domain/task";
import ExecutionCard from "./ExecutionCard";

export interface ExecutionListProps {
  dag: Task[];
}

export default function ExecutionList({ dag }: ExecutionListProps) {
  return (
    <div className="space-y-3">
      {dag.length > 0 ? (
        dag.map((task) => (
          <ExecutionCard key={task.id} task={task} />
        ))
      ) : (
        <p className="text-sm text-slate-500 italic">No DAG nodes. Generate a plan first.</p>
      )}
    </div>
  );
}
