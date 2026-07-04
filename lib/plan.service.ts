import crypto from "node:crypto";
import db from "@/lib/db";
import { generatePlan } from "@/lib/executive-agent";
import { TaskDto } from "@/types/dto/task";

const PLAN_STATUS_ACTIVE = "active";

export type PlanRecord = {
  id: string;
  goal_id: string;
  goal: string;
  why: string;
  markdown: string;
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

export class PlanService {
  async generateAndSave(goal: string): Promise<PlanRecord> {
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
          "INSERT INTO plans (id, goal_id, why, markdown, dag, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
        ).run(
          planId,
          goalId,
          output.why,
          output.markdown,
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
      goal_id: goalId,
      goal: output.goal,
      why: output.why,
      markdown: output.markdown,
      dag: output.tasks,
      status: PLAN_STATUS_ACTIVE,
      created_at: now,
    };
  }

  listPlans(): PlanRecord[] {
    const rows = db
      .prepare(
        `SELECT p.id, p.goal_id, g.title AS goal, p.why, p.markdown, p.dag, p.status, p.created_at
         FROM plans p
         JOIN goals g ON g.id = p.goal_id
         ORDER BY p.created_at DESC`
      )
      .all() as PlanRow[];
    return rows.map(rowToRecord);
  }

  getPlan(id: string): PlanRecord | null {
    const row = db
      .prepare(
        `SELECT p.id, p.goal_id, g.title AS goal, p.why, p.markdown, p.dag, p.status, p.created_at
         FROM plans p
         JOIN goals g ON g.id = p.goal_id
         WHERE p.id = ?`
      )
      .get(id) as PlanRow | null;
    return row ? rowToRecord(row) : null;
  }
}

export const planService = new PlanService();