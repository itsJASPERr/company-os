import { NextResponse } from "next/server";
import { planService } from "@/application/plan/DefaultPlanService";
import { GetPlanRequestParams } from "@/contracts/api/plan/GetPlanRequestParams";
import { GetPlanResponse } from "@/contracts/api/plan/GetPlanResponse";
import { Plan } from "@/domain/plan/Plan";
import { toDto } from "@/application/plan/PlanMapper";
import { ErrorCode } from "@/contracts/api/ErrorCode";

type ResponseBody = GetPlanResponse

export async function GET(
  _req: Request,
  { params }: { params: Promise<GetPlanRequestParams> }
): Promise<NextResponse<ResponseBody>> {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ success: false, error: { code: ErrorCode.INVALID_REQUEST, message: "Invalid plan ID" } }, { status: 400 });
    }

    const plan: Plan | null = await planService.getPlan(id);

    if (!plan) {
      return NextResponse.json({ success: false, error: { code: ErrorCode.PLAN_NOT_FOUND, message: "Plan not found" } }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: toDto(plan) }, { status: 200 });
  } catch (e) {
    console.error("Get plan error:", e);
    return NextResponse.json(
      {
        success: false,
        error: { code: ErrorCode.UNKNOWN_ERROR, message: "Failed to get plan", details: e instanceof Error ? e.message : "Unknown error" },
      },
      { status: 500 }
    );
  }
}
