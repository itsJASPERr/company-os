import { ReferenceTargetType } from "./enums";
import { RelationshipType } from "./types";

export interface MemoryReference {
  /**
   * Identifier of the referenced domain object.
   */
  targetId: string;

  /**
   * Domain or aggregate being referenced.
   *
   * Examples:
   * - "memory"
   * - "plan"
   * - "project"
   * - "decision"
   */
  targetType: ReferenceTargetType;

  /**
   * Semantic relationship between this memory
   * and the referenced object.
   *
   * Examples:
   * - "relates_to"
   * - "depends_on"
   * - "derived_from"
   * - "supersedes"
   */
  relationship: RelationshipType;
}