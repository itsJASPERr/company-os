// lib/plan.service.ts

import crypto from "node:crypto";
import db from "@/lib/db";

import { Plan } from "@/types/domain/plan";

export class PlanService {
  createPlan(plan: Omit<Plan, "id" | "createdAt">): Plan {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    db.prepare(
      `
      INSERT INTO plans (
        id,
        goal,
        why,
        markdown,
        dag_json,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `
    ).run(
      id,
      plan.goal,
      plan.why,
      plan.markdown,
      JSON.stringify(plan.dag),
      createdAt,
      createdAt
    );

    return {
      id,
      ...plan,
      createdAt,
    };
  }

  getPlan(id: string): Plan | null {
    const row = db
      .prepare(
        `
        SELECT *
        FROM plans
        WHERE id = ?
        `
      )
      .get(id);

    if (!row) {
      return null;
    }

    return this.mapRow(row);
  }

  listPlans(): Plan[] {
    const rows = db
      .prepare(
        `
        SELECT *
        FROM plans
        ORDER BY created_at DESC
        `
      )
      .all();

    return rows.map((row) => this.mapRow(row));
  }

  deletePlan(id: string): void {
    db.prepare(
      `
      DELETE FROM plans
      WHERE id = ?
      `
    ).run(id);
  }

  private mapRow(row: any): Plan {
    return {
      id: row.id,
      goal: row.goal,
      why: row.why,
      markdown: row.markdown,
      dag: JSON.parse(row.dag_json),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export const planService = new PlanService();