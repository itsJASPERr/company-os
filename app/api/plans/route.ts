import { NextRequest, NextResponse } from "next/server";
import { planService } from "@/lib/plan.service";
import { ListPlansResponse } from "@/types/dto/list-plans.response";
import { toDto } from "@/lib/api/plan.mapper"

type ResponseBody = ListPlansResponse | { error: string };

export async function GET(request: NextRequest): Promise<NextResponse<ResponseBody>> {
  try {
    const plans = (await planService.listPlans()).map(toDto)
    return NextResponse.json(plans , { status: 200 });
  } catch (e) {
    console.error("List plans error:", e);
    return NextResponse.json(
      { error: "Failed to list plans" },
      { status: 500 }
    );
  }
}
