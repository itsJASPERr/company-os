// Request DTOs
export type CreateTaskRequest = {
    title: string;
    description: string;
    file: string;
    priority: "high" | "medium" | "low";
    dependsOn?: string[];
};

export type UpdateTaskRequest = {
    title?: string;
    description?: string;
    file?: string;
    priority?: "high" | "medium" | "low";
    status?: "todo" | "in_progress" | "done";
    dependsOn?: string[];
};

// Response DTOs
export type TaskDto = {
    id: string;
    title: string;
    description: string;
    file: string;
    priority: "high" | "medium" | "low";
    status: "todo" | "in_progress" | "done";
    dependsOn: string[];
};

export type CreateTaskResponse = TaskDto;

export type GetTaskResponse = TaskDto;

export type ListTasksResponse = TaskDto[];

export type UpdateTaskResponse = TaskDto;

export type DeleteTaskResponse = {
    success: boolean;
    id: string;
};
