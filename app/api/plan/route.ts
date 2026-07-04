import { NextResponse } from "next/server";
import { generatePlan } from "@/lib/executive-agent";
import { generateMarkdownFromPlan } from "@/lib/renderMarkdown";
import { planService } from "@/lib/plan.service";
import { CreatePlanRequest } from "@/types/dto/create-plan.request";
import { CreatePlanResponse } from "@/types/dto/create-plan.response";
import { PlanResponse } from "@/types/dto/plan";

export async function POST(req: Request) {
  // 1. Validate DTO
  let requestData: CreatePlanRequest;
  try {
    requestData = await req.json();
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!requestData.goal || typeof requestData.goal !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid 'goal' field" },
      { status: 400 }
    );
  }

  // 2. Generate Plan using AI
  try {
    const result = await generatePlan(requestData.goal);
    
    // 3. Parse model output (AI uses "tasks" in its response)
    const aiResponse: PlanResponse = JSON.parse(result || "");

    if (!aiResponse.goal || !aiResponse.why || !Array.isArray(aiResponse.tasks)) {
      return NextResponse.json(
        { error: "Invalid model output structure" },
        { status: 500 }
      );
    }

    // 4. Transform AI output to domain model (tasks -> dag)
    const dagItems = aiResponse.tasks;

    // 5. Generate markdown from AI response
    const markdownPlan: CreatePlanResponse = {
      id: "temp",
      goal: aiResponse.goal,
      why: aiResponse.why,
      markdown: "",
      dag: dagItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const markdown = generateMarkdownFromPlan(markdownPlan);

    // 6. Create domain Plan object and persist
    const savedPlan = planService.createPlan({
      goal: aiResponse.goal,
      why: aiResponse.why,
      markdown,
      dag: dagItems,
      updatedAt: new Date().toISOString(),
    });

    // 7. Return CreatePlanResponse (full created resource with ID & timestamps)
    const response: CreatePlanResponse = {
      id: savedPlan.id,
      goal: savedPlan.goal,
      why: savedPlan.why,
      markdown: savedPlan.markdown,
      dag: savedPlan.dag,
      createdAt: savedPlan.createdAt,
      updatedAt: savedPlan.updatedAt,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (e) {
    console.error("Plan generation error:", e);
    return NextResponse.json(
      { error: "Failed to generate plan", details: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}