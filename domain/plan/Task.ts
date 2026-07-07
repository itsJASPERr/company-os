export interface Task {
  id: string;
  title: string;
  description: string;
  file: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "done";
  dependsOn: string[];
}
