import { Plan } from "@/types/domain/plan";

export interface PlanService {
  generateAndSave(goal: string): Promise<Plan>;
  listPlans(): Promise<Plan[]>;
  getPlan(id: string): Promise<Plan | null>;
}