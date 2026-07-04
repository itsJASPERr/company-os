import OpenAI from "openai";
import { TaskDto } from "@/types/dto/task";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type AgentPlanOutput = {
  goal: string;
  why: string;
  tasks: TaskDto[];
};

export async function generatePlan(goal: string): Promise<AgentPlanOutput> {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are the Executive Agent of Company OS. You are a DAG compiler, NOT a renderer, NOT a markdown generator, and NOT a documentation writer.

Your ONLY job is to convert a user goal into a structured JSON task graph.

You must NOT output markdown under any condition.

Respond ONLY with a valid JSON object that follows this exact schema:

{
  "goal": "<one-line restatement of the goal>",
  "why": "<brief explanation of why this goal matters>",
  "tasks": [
    {
      "id": "TASK-1",
      "title": "<short task title>",
      "description": "<what needs to be done>",
      "file": "<path/to/relevant/file or empty string>",
      "priority": "high|medium|low",
      "status": "todo",
      "dependsOn": []
    }
  ]
}

Rules:
- Output ONLY the JSON object. No extra text before or after.
- tasks must be a flat array of concrete, actionable items derived from the goal.
- dependsOn contains task ids that must complete before this task can start.
- Be concise and deterministic.`,
      },
      {
        role: "user",
        content: goal,
      },
    ],
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("Executive Agent returned no output");
  }

  let parsed: AgentPlanOutput;
  try {
    parsed = JSON.parse(content) as AgentPlanOutput;
  } catch {
    throw new Error("Executive Agent returned invalid JSON");
  }

  if (
    !parsed.goal.trim() ||
    !parsed.why.trim() ||
    !Array.isArray(parsed.tasks) ||
    parsed.tasks.length === 0
  ) {
    throw new Error("Executive Agent response missing required fields");
  }

  return parsed;
}