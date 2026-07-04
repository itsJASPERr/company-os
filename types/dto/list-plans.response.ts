import { TaskDto } from "./task";

export type ListPlansResponse = {
    id: string;
    goal: string;
    why: string;
    markdown: string;
    dag: TaskDto[];
    createdAt: string;
    updatedAt: string;
}[];
