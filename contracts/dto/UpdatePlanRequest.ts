import { TaskDto } from "./TaskDTO";

export type UpdatePlanRequest = {
    goal?: string;
    why?: string;
    dag?: TaskDto[];
}   