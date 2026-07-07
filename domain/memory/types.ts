
export interface MemorySource {
  type: string;
  identifier?: string;
  description?: string;
}

export type MemoryMetadata = Record<string, unknown>;

export type RelationshipType = string;