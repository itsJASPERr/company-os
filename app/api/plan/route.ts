import { NextResponse } from "next/server";
import { planService } from "@/lib/plan.service";

export async function POST(req: Request) {
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
    return NextResponse.json({ plan }, { status: 201 });
  } catch (e) {
    console.error("Plan generation error:", e);
    return NextResponse.json(
      { error: "Failed to generate plan" },
      { status: 500 }
    );
  }
}
