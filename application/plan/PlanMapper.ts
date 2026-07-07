import { Plan } from '@/domain/plan/Plan';
import { PlanDto } from '@/contracts/dto/PlanDTO';

export function toDto(plan: Plan): PlanDto {
  return {
    id: plan.id,
    goal: plan.goal,
    why: plan.why,
    dag: plan.dag,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
}

export function toDomain(dto: PlanDto): Plan {
  return {
    id: dto.id,
    goal: dto.goal,
    why: dto.why,
    dag: dto.dag,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}