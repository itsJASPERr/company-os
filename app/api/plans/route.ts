import { NextResponse } from "next/server";
import { planService } from "@/lib/plan.service";
import { CreatePlanRequest } from "@/types/dto/create-plan.request";
import { CreatePlanResponse } from "@/types/dto/create-plan.response";
import { ListPlansResponse } from "@/types/dto/list-plans.response";

export async function POST(req: Request) {
  let requestData: CreatePlanRequest;

  try {
    requestData = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!requestData.goal || typeof requestData.goal !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid 'goal' field" },
      { status: 400 }
    );
  }

  try {
    const savedPlan = await planService.generateAndCreatePlan(requestData.goal);

    const response: CreatePlanResponse = {
      id: savedPlan.id,
      goal: savedPlan.goal,
      why: savedPlan.why,
      markdown: savedPlan.markdown,
      dag: savedPlan.dag,
      createdAt: savedPlan.createdAt,
      updatedAt: savedPlan.updatedAt,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (e) {
    console.error("Plan generation error:", e);
    return NextResponse.json(
      { error: "Failed to generate plan" },
      { status: 500 }
    );
  }
}

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
      { error: "Failed to list plans" },
      { status: 500 }
    );
  }
}
