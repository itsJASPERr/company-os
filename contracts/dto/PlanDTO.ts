// Request DTOs
import { TaskDto } from "./TaskDTO";

export type PlanDto = {
    id: string;
    goal: string;
    why: string;
    dag: TaskDto[];
    createdAt: string;
    updatedAt: string;
};

export default PlanDto;

// AI Model Output (external interface - uses 'tasks')
export type PlanResponse = {
    tasks: TaskDto[];
    goal: string;
    why: string;
};
