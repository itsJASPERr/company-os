import { ApiResponse } from "../ApiResponse";
import { PlanDto } from "../../dto/PlanDTO";

export type ListPlansResponse = ApiResponse<{
  plans: PlanDto[];
  total: number;
}>;