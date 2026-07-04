import crypto from "node:crypto";
import db from "@/lib/db";
import { generatePlan } from "@/lib/executive-agent";
import { TaskDto } from "@/types/dto/task";
import { Plan } from "@/types/domain/plan";
import { IPlanService } from "./plan.service.interface";

const PLAN_STATUS_ACTIVE = "active";

// persistence layer type, DAO
export type PlanRecord = {
  id: string;
  goal_id: string;
  goal: string;
  why: string;
  dag: TaskDto[];
  status: string;
  created_at: string;
};

type PlanRow = Omit<PlanRecord, "dag"> & { dag: string };

function parseTasksFromJson(dagJson: string): TaskDto[] {
  try {
    return JSON.parse(dagJson) as TaskDto[];
  } catch {
    return [];
  }
}

function rowToRecord(row: PlanRow): PlanRecord {
  return {
    ...row,
    dag: parseTasksFromJson(row.dag),
  };
}

function recordToDomain(record: PlanRecord): Plan {
  return {
    id: record.id,
    goal: record.goal,
    why: record.why,
    dag: record.dag,
    createdAt: record.created_at,
    updatedAt: record.created_at, // Assuming no separate updated_at field in the database
  };
}

export class PlanService implements IPlanService {
  async generateAndSave(goal: string): Promise<Plan> {
    const output = await generatePlan(goal);

    const goalId = crypto.randomUUID();
    const planId = crypto.randomUUID();
    const now = new Date().toISOString();

    try {
      db.transaction(() => {
        db.prepare(
          "INSERT INTO goals (id, title, created_at) VALUES (?, ?, ?)"
        ).run(goalId, goal, now);

        db.prepare(
          "INSERT INTO plans (id, goal_id, why, dag, status, created_at) VALUES (?, ?, ?, ?, ?, ?)"
        ).run(
          planId,
          goalId,
          output.why,
          JSON.stringify(output.tasks),
          PLAN_STATUS_ACTIVE,
          now
        );
      })();
    } catch (e) {
      throw new Error(
        `Failed to persist goal and plan: ${e instanceof Error ? e.message : String(e)}`
      );
    }

    return {
      id: planId,
      goal: output.goal,
      why: output.why,
      dag: output.tasks,
      createdAt: now,
      updatedAt: now,
    };
  }

  async listPlans(): Promise<Plan[]> {
    const rows = db
      .prepare(
        `SELECT p.id, p.goal_id, g.title AS goal, p.why, p.dag, p.status, p.created_at
         FROM plans p
         JOIN goals g ON g.id = p.goal_id
         ORDER BY p.created_at DESC`
      )
      .all() as PlanRow[];
    return rows.map(rowToRecord).map(recordToDomain);
  }

  async getPlan(id: string): Promise<Plan | null> {
    const row = db
      .prepare(
        `SELECT p.id, p.goal_id, g.title AS goal, p.why, p.dag, p.status, p.created_at
         FROM plans p
         JOIN goals g ON g.id = p.goal_id
         WHERE p.id = ?`
      )
      .get(id) as PlanRow | null;
    return row ? recordToDomain(rowToRecord(row)) : null;
  }
}

export const planService: IPlanService = new PlanService();