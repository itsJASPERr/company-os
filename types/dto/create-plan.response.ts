import { TaskDto } from "./task";

export type CreatePlanResponse = {
    id: string;
    goal: string;
    why: string;
    markdown: string;
    dag: TaskDto[];
    createdAt: string;
    updatedAt: string;
};
