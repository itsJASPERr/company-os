import { Plan } from "@/domain/plan/Plan";

export interface PlanService {
  generateAndSave(goal: string): Promise<Plan>;
  listPlans(): Promise<Plan[]>;
  getPlan(id: string): Promise<Plan | null>;
}