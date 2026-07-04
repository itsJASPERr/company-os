// types/domain/plan.ts
import { Task } from "./task";

export interface Plan {
    id: string;
    goal: string;
    why: string;
    markdown: string;
    dag: Task[];
    createdAt: string;
    updatedAt: string;
}