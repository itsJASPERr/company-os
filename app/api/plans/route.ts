import { NextResponse } from "next/server";
import { planService } from "@/lib/plan.service";
import { ListPlansResponse } from "@/types/dto/list-plans.response";

export async function GET() {
  try {
    const plans = planService.listPlans();

    const response: ListPlansResponse = plans.map((plan) => ({
      id: plan.id,
      goal: plan.goal,
      why: plan.why,
      markdown: plan.markdown,
      dag: plan.dag,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    }));

    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    console.error("List plans error:", e);
    return NextResponse.json(
      { error: "Failed to list plans", details: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
