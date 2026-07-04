import { NextResponse } from "next/server";
import { planService } from "@/lib/plan.service";

export async function GET() {
  try {
    const plans = planService.listPlans();
    return NextResponse.json(plans, { status: 200 });
  } catch (e) {
    console.error("List plans error:", e);
    return NextResponse.json(
      { error: "Failed to list plans" },
      { status: 500 }
    );
  }
}
