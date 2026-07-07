import { NextRequest, NextResponse } from "next/server";
import { planService } from "@/application/plan/DefaultPlanService";
import { toDto } from "@/application/plan/PlanMapper";
import { UpdatePlanResponse } from "@/contracts/api/plan/UpdatePlsnResponse";
import { UpdatePlanRequest } from "@/contracts/api/plan/UpdatePlanRequest";
import { ErrorCode } from "@/contracts/api/ErrorCode";

export async function POST(req: NextRequest): Promise<NextResponse<UpdatePlanResponse>> {
  let body: UpdatePlanRequest;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: { code: ErrorCode.INVALID_REQUEST, message: "Invalid JSON body" } }, { status: 400 });
  }

  if (!body.goal || typeof body.goal !== "string") {
    return NextResponse.json(
      { success: false, error: { code: ErrorCode.INVALID_REQUEST, message: "Missing or invalid 'goal' field" } },
      { status: 400 }
    );
  }

  try {
    const plan = await planService.generateAndSave(body.goal);
    return NextResponse.json({ success: true, data: { plan: toDto(plan) } }, { status: 201 });
  } catch (e) {
    console.error("Plan generation error:", e);
    return NextResponse.json(
      { success: false, error: { code: ErrorCode.UNKNOWN_ERROR, message: "Failed to generate plan" } },
      { status: 500 }
    );
  }
}
