import { NextResponse } from "next/server";
import { generatePlan } from "@/lib/executive-agent";

export async function POST(req: Request) {
  const { goal } = await req.json();

  if (!goal) {
    return NextResponse.json(
      { error: "Missing goal" },
      { status: 400 }
    );
  }

  const result = await generatePlan(goal);

  try {
    const parsed = JSON.parse(result || "");
    return NextResponse.json(parsed);
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid model output", raw: result },
      { status: 500 }
    );
  }
}