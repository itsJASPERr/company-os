import { NextResponse } from "next/server";
import { planService } from "@/lib/plan.service";

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
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
    }

    const plan = planService.getPlan(id);

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json(plan, { status: 200 });
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
