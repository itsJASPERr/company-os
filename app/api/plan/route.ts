import { NextResponse } from "next/server";
import { planService } from "@/application/plan/DefaultPlanService";
import { PlanDto } from "@/contracts/dto/PlanDTO";
import { toDto } from "@/application/plan/PlanMapper";

type ResponseBody = { plan: PlanDto } | { error: string };

export async function POST(req: Request): Promise<NextResponse<ResponseBody>> {
  let body: { goal?: unknown };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.goal || typeof body.goal !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid 'goal' field" },
      { status: 400 }
    );
  }

  try {
    const plan = await planService.generateAndSave(body.goal);
    return NextResponse.json({ plan: toDto(plan) }, { status: 201 });
  } catch (e) {
    console.error("Plan generation error:", e);
    return NextResponse.json(
      { error: "Failed to generate plan" },
      { status: 500 }
    );
  }
}
