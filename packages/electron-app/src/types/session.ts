/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Session {
  sessionId: string;
  displayName: string;
  messageCount: number;
  projectPath: string;
  mtime: string; // ISO string
  hash: string;
  fileName: string;
  tag?: string; // Deprecated
}