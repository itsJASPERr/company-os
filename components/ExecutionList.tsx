import { TaskDto } from "@/contracts/dto/TaskDTO";
import ExecutionCard from "./ExecutionCard";

export interface ExecutionListProps {
  dag: TaskDto[];
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
