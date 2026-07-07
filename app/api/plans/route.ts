import { NextRequest, NextResponse } from "next/server";
import { planService } from "@/application/plan/DefaultPlanService";
import { ListPlansResponse } from "@/contracts/api/plan/ListPlansResponse";
import { toDto } from "@/application/plan/PlanMapper";
import { ErrorCode } from "@/contracts/api/ErrorCode";

type ResponseBody = ListPlansResponse;

export async function GET(request: NextRequest): Promise<NextResponse<ResponseBody>> {
  try {
    const plans = (await planService.listPlans()).map(toDto);
    return NextResponse.json({ success: true, data: { plans, total: plans.length } }, { status: 200 });
  } catch (e) {
    console.error("List plans error:", e);
    return NextResponse.json(
      { success: false, error: { code: ErrorCode.UNKNOWN_ERROR, message: "Failed to list plans" } },
      { status: 500 }
    );
  }
}
