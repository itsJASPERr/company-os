// Request DTOs
import { TaskDto } from "./task";

export type CreatePlanRequest = {
    goal: string;
};

export type UpdatePlanRequest = {
    goal?: string;
    why?: string;
    dag?: TaskDto[];
};

export type PlanDto = {
    id: string;
    goal: string;
    why: string;
    dag: TaskDto[];
    createdAt: string;
    updatedAt: string;
};

// AI Model Output (external interface - uses 'tasks')
export type PlanResponse = {
    tasks: TaskDto[];
    goal: string;
    why: string;
};

export type CreatePlanResponse = PlanDto;

export type GetPlanResponse = PlanDto;

export type ListPlansResponse = PlanDto[];

export type DeletePlanResponse = {
    success: boolean;
    id: string;
};