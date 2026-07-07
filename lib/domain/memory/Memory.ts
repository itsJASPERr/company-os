import { Importance, MemoryStatus, MemoryType } from './enums';
import { MemoryMetadata, MemorySource } from './types';
import { MemoryReference } from './MemoryReference';

export interface Memory {
  readonly id: string;

  readonly type: MemoryType;

  readonly title: string;

  readonly content: string;

  readonly summary?: string;

  readonly tags: readonly string[];

  readonly status: MemoryStatus;

  readonly importance: Importance;

  readonly confidence: number;

  readonly source?: MemorySource;

  readonly references: readonly MemoryReference[];

  readonly metadata: MemoryMetadata;

  readonly createdBy: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  readonly version: number;
}