/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import { Session } from '../../types/session';
import {
  type ConversationRecord,
  partListUnionToString,
  SESSION_FILE_PREFIX,
  getProjectHash,
} from '@google/gemini-cli-core';
import { GEMINI_CLI_DIST } from '../config/paths';
import type { CliSettings } from '../config/types';

export class SessionService {
  private globalTempDir: string;

  constructor() {
    this.globalTempDir = path.join(os.homedir(), '.gemini', 'tmp');
  }

  async getRecentSessions(): Promise<Session[]> {
    try {
      const sessions: Session[] = [];
      // Directories in globalTempDir are project hashes
      let projectHashes: string[] = [];
      try {
        projectHashes = await fs.readdir(this.globalTempDir);
      } catch (e) {
        if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
          return [];
        }
        throw e;
      }

      // Load settings to help resolve project paths from hashes
      let candidatePaths: string[] = [];
      try {
        const { loadSettings } = await import(
          path.join(GEMINI_CLI_DIST, 'src/config/settings.js')
        );
        const settings = await loadSettings(os.homedir());
        const merged = settings.merged as CliSettings;
        if (merged.terminalCwd) candidatePaths.push(merged.terminalCwd);
        if (merged.context?.includeDirectories) {
          candidatePaths.push(...merged.context.includeDirectories);
        }
        // Deduplicate
        candidatePaths = [...new Set(candidatePaths)];
      } catch (e) {
        console.warn('Failed to load settings for session path resolution:', e);
      }

      // Pre-calculate hashes for candidate paths
      const pathHashMap = new Map<string, string>();
      for (const p of candidatePaths) {
        try {
          // Resolve path to ensure consistent hashing
          const resolved = path.resolve(p);
          pathHashMap.set(getProjectHash(resolved), resolved);
        } catch (e) {
          // Ignore invalid paths
        }
      }

      for (const hash of projectHashes) {
        const projectDir = path.join(this.globalTempDir, hash);
        const chatsDir = path.join(projectDir, 'chats');

        try {
          // Check if chats directory exists
          const stats = await fs.stat(chatsDir);
          if (!stats.isDirectory()) continue;

          const files = await fs.readdir(chatsDir);
          for (const file of files) {
            if (
              file.startsWith(SESSION_FILE_PREFIX) &&
              file.endsWith('.json')
            ) {
              const filePath = path.join(chatsDir, file);
              try {
                const content = await fs.readFile(filePath, 'utf-8');
                const record = JSON.parse(content) as ConversationRecord;

                // Validate basic fields
                if (!record.sessionId || !record.messages) continue;

                // Extract Metadata
                const sessionId = record.sessionId;
                const mtime = record.lastUpdated || record.startTime;
                const messageCount = record.messages.length;

                // Determine display name from first user message
                let displayName = 'Empty conversation';
                const firstUserMessage = record.messages.find(
                  (msg) =>
                    msg.type === 'user' &&
                    !partListUnionToString(msg.content).startsWith('/') &&
                    partListUnionToString(msg.content).trim().length > 0,
                );

                if (firstUserMessage) {
                  displayName = partListUnionToString(firstUserMessage.content);
                } else {
                  // Fallback to any user message
                  const anyUserMessage = record.messages.find(
                    (msg) => msg.type === 'user',
                  );
                  if (anyUserMessage) {
                    displayName = partListUnionToString(anyUserMessage.content);
                  }
                }

                // Truncate display name if too long
                if (displayName.length > 60) {
                  displayName = displayName.substring(0, 57) + '...';
                }

                // Attempt to find project path
                let projectPath = 'Unknown Project';
                
                // Strategy 1: check for "I'm currently working in the directory: "
                const findPath = (text: string) => {
                  const match = text.match(
                    /I'm currently working in the directory: ([^\n]+)/,
                  );
                  return match ? match[1].trim() : null;
                };

                // Check first few messages (system prompt usually)
                for (const msg of record.messages.slice(0, 5)) {
                  const text = partListUnionToString(msg.content);
                  const found = findPath(text);
                  if (found) {
                    projectPath = found;
                    break;
                  }
                }

                // Strategy 2: If path is unknown, check if hash matches a known project
                if (projectPath === 'Unknown Project') {
                   const matchedPath = pathHashMap.get(hash);
                   if (matchedPath) {
                       projectPath = matchedPath;
                   }
                }

                sessions.push({
                  sessionId,
                  displayName,
                  messageCount,
                  projectPath,
                  mtime,
                  hash,
                  fileName: file,
                  tag: displayName, // Backward compatibility or just use display name
                });
              } catch (e) {
                console.error(`Failed to process session ${file}:`, e);
              }
            }
          }
        } catch (e) {
          // Ignore if chats dir doesn't exist or other access errors
        }
      }

      return sessions.sort(
        (a, b) => new Date(b.mtime).getTime() - new Date(a.mtime).getTime(),
      );
    } catch (error) {
      console.error('Failed to get recent sessions:', error);
      return [];
    }
  }

  async ensureSessionInProject(
    sourceHash: string,
    fileName: string,
    targetCwd: string,
  ): Promise<void> {
    try {
      const targetHash = getProjectHash(targetCwd);
      if (sourceHash === targetHash) {
        return;
      }

      const sourcePath = path.join(
        this.globalTempDir,
        sourceHash,
        'chats',
        fileName,
      );
      const targetDir = path.join(this.globalTempDir, targetHash, 'chats');
      const targetPath = path.join(targetDir, fileName);

      // Check if source exists
      try {
        await fs.access(sourcePath);
      } catch {
        console.warn(
          `Source session file not found at ${sourcePath}, cannot migrate.`,
        );
        return;
      }

      // Ensure target directory exists
      await fs.mkdir(targetDir, { recursive: true });

      // Copy file
      await fs.copyFile(sourcePath, targetPath);
    } catch (error) {
      console.error(
        `Failed to migrate session ${fileName} from ${sourceHash} to ${targetCwd}:`,
        error,
      );
      // Don't throw, just log. Resumption might fail but app shouldn't crash.
    }
  }

  async deleteSession(hash: string, fileName: string): Promise<void> {
    try {
      const sessionPath = path.join(
        this.globalTempDir,
        hash,
        'chats',
        fileName,
      );
      await fs.unlink(sessionPath);
    } catch (error) {
      console.error(`Failed to delete session ${fileName} in ${hash}:`, error);
      throw error;
    }
  }
}
