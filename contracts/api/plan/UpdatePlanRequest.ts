import { TaskDto } from "../../dto/TaskDTO";

export type UpdatePlanRequest = {
    goal?: string;
    why?: string;
    dag?: TaskDto[];
}   