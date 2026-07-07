// types/domain/plan.ts
import { Task } from "./Task";

export interface Plan {
    id: string;
    goal: string;
    why: string;
    dag: Task[];
    createdAt: string;
    updatedAt: string;
}