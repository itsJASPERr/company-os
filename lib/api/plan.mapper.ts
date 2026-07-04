import { Plan } from '@/types/domain/plan';
import { PlanDto } from '@/types/dto/plan';

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