import { generatePlan } from "@/lib/executive-agent";

export async function POST(req: Request) {
  const body = await req.json();

  const goal = body.goal;

  const plan = await generatePlan(goal);

  return Response.json({ plan });
}