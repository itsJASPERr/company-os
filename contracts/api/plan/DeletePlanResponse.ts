import { ApiResponse } from "../ApiResponse";

export type DeletePlanResponse = ApiResponse<{
    success: boolean;
    id: string;
}>;