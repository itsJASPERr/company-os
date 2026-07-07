import { ApiResponse } from "../ApiResponse";
import { PlanDto } from "../../dto/PlanDTO";

export type UpdatePlanResponse = ApiResponse<{
  plan: PlanDto;
}>;