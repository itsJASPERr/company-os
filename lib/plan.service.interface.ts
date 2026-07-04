import { Plan } from "@/types/domain/plan";

export interface IPlanService {
  generateAndSave(goal: string): Promise<Plan>;
  listPlans(): Promise<Plan[]>;
  getPlan(id: string): Promise<Plan | null>;
}