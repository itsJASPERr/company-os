import { NextResponse } from "next/server";
import { planService } from "@/lib/plan.service";
import { GetPlanResponse } from "@/types/dto/get-plan.response";
import { UpdatePlanRequest } from "@/types/dto/plan";

interface Params {
  id: string;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;

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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Invalid plan ID" },
        { status: 400 }
      );
    }

    let body: UpdatePlanRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const updated = planService.updatePlan(id, body);

    if (!updated) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (e) {
    console.error("Update plan error:", e);
    return NextResponse.json(
      { error: "Failed to update plan", details: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;

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
