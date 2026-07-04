import { PlanResponse } from "@/types/plan";
import { marked } from "marked";

export function renderMarkdown(md: string) {
    return marked.parse(md);
}

export function generateMarkdownFromPlan(plan: PlanResponse | null) {
    if (!plan) {
        return "# No plan available";
    }

    const { goal, why, tasks = [] } = plan;
    return `
# Goal
${plan.goal}

# Why
${plan.why}

# Tasks

${plan.tasks.map(t => `
- ${t.id}: ${t.title} (${t.file}) [${t.priority}]
  dependsOn: ${t.dependsOn.join(", ") || "none"}
`).join("\n")}
`;
}