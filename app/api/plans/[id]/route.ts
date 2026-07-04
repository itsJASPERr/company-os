import { NextResponse } from "next/server";
import { planService } from "@/lib/plan.service";
import { GetPlanResponse } from "@/types/dto/get-plan.response";

interface Params {
  id: string;
}

export async function GET(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Invalid plan ID" },
        { status: 400 }
      );
    }

    const plan = planService.getPlan(id);

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    const response: GetPlanResponse = {
      id: plan.id,
      goal: plan.goal,
      why: plan.why,
      markdown: plan.markdown,
      dag: plan.dag,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    console.error("Get plan error:", e);
    return NextResponse.json(
      { error: "Failed to get plan", details: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Invalid plan ID" },
        { status: 400 }
      );
    }

    const plan = planService.getPlan(id);
    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    planService.deletePlan(id);

    return NextResponse.json(
      { success: true, id },
      { status: 200 }
    );
  } catch (e) {
    console.error("Delete plan error:", e);
    return NextResponse.json(
      { error: "Failed to delete plan", details: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
