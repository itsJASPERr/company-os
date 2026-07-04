import { TaskDto } from "./task";

export type GetPlanResponse = {
    id: string;
    goal: string;
    why: string;
    markdown: string;
    dag: TaskDto[];
    createdAt: string;
    updatedAt: string;
};
