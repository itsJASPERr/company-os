import { NextResponse } from "next/server";
import { planService } from "@/application/plan/DefaultPlanService";
import { GetPlanRequestParams } from "@/contracts/dto/GetPlanRequestParams";
import { GetPlanResponse } from "@/contracts/dto/GetPlanResponse";
import { Plan } from "@/domain/plan/Plan";
import { toDto } from "@/application/plan/PlanMapper";

type ResponseBody = GetPlanResponse | { error: string; details?: string };

export async function GET(
  _req: Request,
  { params }: { params: Promise<GetPlanRequestParams> }
): Promise<NextResponse<ResponseBody>> {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
    }

    const plan: Plan | null = await planService.getPlan(id);

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json(toDto(plan), { status: 200 });
  } catch (e) {
    console.error("Get plan error:", e);
    return NextResponse.json(
      {
        error: "Failed to get plan",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
