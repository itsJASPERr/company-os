import crypto from "node:crypto";
import db from "@/lib/db";
import { generatePlan } from "@/lib/executive-agent";

export type PlanRecord = {
  id: string;
  goal_id: string;
  goal: string;
  markdown: string;
  status: string;
  created_at: string;
};

export class PlanService {
  async generateAndSave(goal: string): Promise<string> {
    const markdown = await generatePlan(goal);

    const goalId = crypto.randomUUID();
    const planId = crypto.randomUUID();
    const now = new Date().toISOString();

    db.transaction(() => {
      db.prepare(
        "INSERT INTO goals (id, title, created_at) VALUES (?, ?, ?)"
      ).run(goalId, goal, now);

      db.prepare(
        "INSERT INTO plans (id, goal_id, markdown, status, created_at) VALUES (?, ?, ?, ?, ?)"
      ).run(planId, goalId, markdown, "active", now);
    })();

    return markdown;
  }

  listPlans(): PlanRecord[] {
    return db
      .prepare(
        `SELECT p.id, p.goal_id, g.title AS goal, p.markdown, p.status, p.created_at
         FROM plans p
         JOIN goals g ON g.id = p.goal_id
         ORDER BY p.created_at DESC`
      )
      .all() as PlanRecord[];
  }

  getPlan(id: string): PlanRecord | null {
    return (
      db
        .prepare(
          `SELECT p.id, p.goal_id, g.title AS goal, p.markdown, p.status, p.created_at
           FROM plans p
           JOIN goals g ON g.id = p.goal_id
           WHERE p.id = ?`
        )
        .get(id) as PlanRecord | null
    );
  }
}

export const planService = new PlanService();