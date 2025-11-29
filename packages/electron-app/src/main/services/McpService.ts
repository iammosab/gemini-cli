/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import os from 'node:os';
import { join } from 'node:path';
import { GEMINI_CLI_DIST } from '../config/paths';
import type { CliSettings } from '../config/types';

export class McpService {
  async getConfiguredServers(): Promise<Record<string, unknown>> {
    const { loadSettings } = await import(
      join(GEMINI_CLI_DIST, 'src/config/settings.js')
    );
    const settings = await loadSettings(os.homedir());
    const merged = settings.merged as CliSettings;

    return (merged.mcpServers as Record<string, unknown>) || {};
  }
}
