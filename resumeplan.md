# Session Resumption Update Plan

This plan details the necessary changes to `packages/electron-app` to support the new session storage and resumption mechanism introduced in the CLI.

## Context

The CLI has moved from storing sessions as `checkpoint-<tag>.json` files in project hash directories to storing them as `chats/session-<timestamp>-<uuid>.json` files containing a `ConversationRecord`. The Electron app needs to be updated to list these new session files and resume from them using the `sessionId`.

## Steps

### 1. Update Session Type Definition

**File:** `packages/electron-app/src/types/session.ts`

Update the `Session` interface to match the new metadata structure.

```typescript
export interface Session {
  sessionId: string;      // Unique ID (UUID)
  displayName: string;    // First user message or "Empty conversation"
  messageCount: number;   // Number of messages
  projectPath: string;    // Path to the project directory
  mtime: string;         // ISO string (last updated)
  hash: string;          // Project hash
  fileName: string;      // Filename (e.g., session-....json)
  tag?: string;          // Deprecated, keep for compatibility if needed, or map to displayName
}
```

### 2. Update Session Service (Main Process)

**File:** `packages/electron-app/src/main/services/SessionService.ts`

**Goal:** Update `getRecentSessions` to scan for `chats/session-*.json` files.

1.  **Imports:**
    *   Import `ConversationRecord`, `partListUnionToString`, `SESSION_FILE_PREFIX` from `@google/gemini-cli-core`.
    *   Ensure `SESSION_FILE_PREFIX` is used to filter files.

2.  **`getRecentSessions` Logic:**
    *   Iterate through subdirectories in `this.globalTempDir` (each represents a project hash).
    *   Inside each project hash directory, check for a `chats` subdirectory.
    *   If `chats` exists, list all files starting with `SESSION_FILE_PREFIX` and ending in `.json`.
    *   Read and parse each file as `ConversationRecord`.
    *   **Extract Metadata:**
        *   `sessionId`: from `record.sessionId`.
        *   `mtime`: from `record.lastUpdated`.
        *   `messageCount`: `record.messages.length`.
        *   `displayName`: Extract first user message using logic similar to CLI's `extractFirstUserMessage` (filter out slash commands, find first user message).
        *   `projectPath`:
            *   The `ConversationRecord` contains `projectHash`, but not the full path.
            *   **Strategy:** Attempt to find the "I'm currently working in the directory: ..." string in the messages (first message or system prompt).
            *   If not found, set to `"Unknown Project"`.
    *   Sort sessions by `mtime` (descending).
    *   Return `Session[]`.

3.  **`deleteSession` Logic:**
    *   Update signature to `deleteSession(hash: string, sessionId: string)`.
    *   Locate the file in `<globalTempDir>/<hash>/chats/`.
    *   Since filename contains timestamp, we might need to find the file that contains the `sessionId` or iterate files to find the match.
    *   **Better:** The CLI filename format is `session-<timestamp>-<uuid_prefix>.json`. We can try to match the `sessionId` (full UUID) against the file content or try to reconstruct the filename if we had the timestamp.
    *   **Recommended:** in `getRecentSessions`, store the `fileName` in the `Session` object. Pass `fileName` to `deleteSession`.
    *   Update signature: `deleteSession(hash: string, fileName: string)`.
    *   Delete `<globalTempDir>/<hash>/chats/<fileName>`.

### 3. Update IPC Handlers

**File:** `packages/electron-app/src/main/ipc/ipc-handlers.ts`

*   Update `sessions:delete` handler:
    ```typescript
    ipcMain.handle('sessions:delete', async (_event, hash: string, fileName: string) => {
      return sessionService.deleteSession(hash, fileName);
    });
    ```

### 4. Update Welcome Screen (Renderer)

**File:** `packages/electron-app/src/renderer/components/Welcome/WelcomeScreen.tsx`

1.  **Display:**
    *   Use `session.displayName` for the main text.
    *   Show `session.messageCount` if desired.
    *   Use `session.sessionId` as key.

2.  **Actions:**
    *   **Select:** Call `onSelectSession(session)`.
    *   **Delete:** Call `window.electron.sessions.delete(session.hash, session.fileName)`.

### 5. Update App Component (Renderer)

**File:** `packages/electron-app/src/renderer/App.tsx`

1.  **`handleSessionSelect`:**
    *   Use `session.sessionId` instead of `tag`.
    *   `restartTerminal` is called with `sessionId`. This logic is already correct as `restartTerminal` passes the ID to `--resume`.

### 6. Clean up `SessionService`

*   Remove old logic for `checkpoint-*.json` files.
*   Ensure robust error handling for corrupted JSON files.

## Verification

1.  **List Sessions:** Start the app. The Welcome Screen should populate with sessions from the `chats` directory.
2.  **Verify Metadata:** Check if project paths and timestamps are correct.
3.  **Resume:** Click a session. The terminal should start with `gemini --resume <sessionId>`. Verify that history is restored (CLI output).
4.  **Delete:** Delete a session and verify it disappears from the list and the file is removed.
