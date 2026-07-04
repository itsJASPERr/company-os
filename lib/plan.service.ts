import crypto from "node:crypto";
import db from "@/lib/db";
import { generatePlan } from "@/lib/executive-agent";
import { generateMarkdownFromPlan } from "@/lib/renderMarkdown";
import { Plan } from "@/types/domain/plan";

type PlanRow = {
  id: string;
  goal: string;
  why: string;
  markdown: string;
  dag_json: string;
  created_at: string;
  updated_at: string;
};

type GeneratedPlan = {
  goal: string;
  why: string;
  tasks: Plan["dag"];
};

export class PlanService {
  async generateAndCreatePlan(goal: string): Promise<Plan> {
    const result = await generatePlan(goal);

    const generatedPlan = this.parseGeneratedPlan(result);
    const markdown = generateMarkdownFromPlan({
      goal: generatedPlan.goal,
      why: generatedPlan.why,
      dag: generatedPlan.tasks,
    });

    return this.createPlan({
      goal: generatedPlan.goal,
      why: generatedPlan.why,
      markdown,
      dag: generatedPlan.tasks,
    });
  }

  createPlan(plan: Omit<Plan, "id" | "createdAt" | "updatedAt">): Plan {
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
      updatedAt: createdAt,
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
      .get(id) as PlanRow | undefined;

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
      .all() as PlanRow[];

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

  private parseGeneratedPlan(result: string | null): GeneratedPlan {
    if (!result) {
      throw new Error("Model returned no output");
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(result);
    } catch {
      throw new Error("Model returned invalid JSON");
    }

    if (!this.isGeneratedPlan(parsed)) {
      throw new Error("Invalid model output structure");
    }

    return parsed;
  }

  private isGeneratedPlan(value: unknown): value is GeneratedPlan {
    if (!value || typeof value !== "object") {
      return false;
    }

    const plan = value as Partial<GeneratedPlan>;

    return (
      typeof plan.goal === "string" &&
      typeof plan.why === "string" &&
      Array.isArray(plan.tasks)
    );
  }

  private mapRow(row: PlanRow): Plan {
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