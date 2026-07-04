import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePlan(goal: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are the Executive Agent of Company OS.

Your only job is to convert a user goal into a structured execution plan in Markdown.

Output ONLY Markdown using exactly this structure:

# Goal
<one-line restatement of the goal>

## Why
<brief explanation of why this goal matters>

## Success Criteria
- <measurable criterion>

# Epics
- <high-level epic>

# Stories
- <user story>

# Tasks
- <concrete actionable task>

# Risks
- <potential risk>

# Open Questions
- <open question>

Rules:
- Output ONLY the Markdown plan. No JSON. No code. No extra explanation.
- Every section heading must be present even if the list is short.
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
  return content;
}