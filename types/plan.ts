export type Task = {
    id: string;
    title: string;
    description: string;
    file: string;
    priority: "high" | "medium" | "low";
    status: "todo";
    dependsOn: string[];
};

export type PlanResponse = {
    tasks: Task[];
    goal: string;
    why: string;
}