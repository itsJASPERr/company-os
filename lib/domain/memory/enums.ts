export enum MemoryType {
  DECISION = "decision",
  REQUIREMENT = "requirement",
  KNOWLEDGE = "knowledge",
  ARCHITECTURE = "architecture",
  RISK = "risk",
  ASSUMPTION = "assumption",
  OPPORTUNITY = "opportunity",
  MEETING = "meeting",
  PROCESS = "process",
  POLICY = "policy",
}

export enum MemoryStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  SUPERSEDED = "superseded",
  ARCHIVED = "archived",
}

export enum Importance {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum ReferenceTargetType {
  MEMORY = "memory",
  PLAN = "plan",
  PROJECT = "project",
  TASK = "task",
  DECISION = "decision",
}