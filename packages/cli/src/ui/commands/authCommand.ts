/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  OpenDialogActionReturn,
  SlashCommand,
  LogoutActionReturn,
} from './types.js';
import { CommandKind } from './types.js';
import {
  clearCachedCredentialFile,
  UserAccountManager,
  AuthType,
  type MessageActionReturn,
} from '@google/gemini-cli-core';
import { SettingScope } from '../../config/settings.js';

const userAccountManager = new UserAccountManager();

const authLoginCommand: SlashCommand = {
  name: 'login',
  description: 'Login or change the auth method',
  kind: CommandKind.BUILT_IN,
  autoExecute: true,
  action: (_context, _args): OpenDialogActionReturn => ({
    type: 'dialog',
    dialog: 'auth',
  }),
};

const authLogoutCommand: SlashCommand = {
  name: 'logout',
  description: 'Log out and clear all cached credentials',
  kind: CommandKind.BUILT_IN,
  action: async (context, _args): Promise<LogoutActionReturn> => {
    await clearCachedCredentialFile();
    // Clear the selected auth type so user sees the auth selection menu
    context.services.settings.setValue(
      SettingScope.User,
      'security.auth.selectedType',
      undefined,
    );
    // Strip thoughts from history instead of clearing completely
    context.services.config?.getGeminiClient()?.stripThoughtsFromHistory();
    // Return logout action to signal explicit state change
    return {
      type: 'logout',
    };
  },
};

const authListCommand: SlashCommand = {
  name: 'list',
  description: 'List all authenticated accounts',
  kind: CommandKind.BUILT_IN,
  action: async (_context, _args): Promise<MessageActionReturn> => {
    const accounts = userAccountManager.getAccounts();
    const active = userAccountManager.getCachedGoogleAccount();

    if (accounts.length === 0) {
      return {
        type: 'message',
        messageType: 'info',
        content: 'No accounts found.',
      };
    }

    const list = accounts
      .map((acc) => (acc === active ? `* ${acc} (active)` : `  ${acc}`))
      .join('\n');

    return {
      type: 'message',
      messageType: 'info',
      content: `Authenticated accounts:\n${list}`,
    };
  },
};

const authSwitchCommand: SlashCommand = {
  name: 'switch',
  description: 'Switch to another authenticated account',
  kind: CommandKind.BUILT_IN,
  action: async (context, args): Promise<MessageActionReturn> => {
    const email = args[0];
    if (!email) {
      return {
        type: 'message',
        messageType: 'error',
        content: 'Please provide an email address to switch to.',
      };
    }

    const accounts = userAccountManager.getAccounts();
    if (!accounts.includes(email)) {
      return {
        type: 'message',
        messageType: 'error',
        content: `Account ${email} not found. Please login first.`,
      };
    }

    if (!context.services.config) {
      return {
        type: 'message',
        messageType: 'error',
        content: 'Config service not available.',
      };
    }

    await userAccountManager.cacheGoogleAccount(email);

    try {
      await context.services.config.refreshAuth(AuthType.LOGIN_WITH_GOOGLE);
    } catch (e) {
      return {
        type: 'message',
        messageType: 'error',
        content: `Failed to switch account: ${e}`,
      };
    }

    return {
      type: 'message',
      messageType: 'info',
      content: `Switched to account: ${email}`,
    };
  },
};

export const authCommand: SlashCommand = {
  name: 'auth',
  description: 'Manage authentication',
  kind: CommandKind.BUILT_IN,
  subCommands: [
    authLoginCommand,
    authLogoutCommand,
    authListCommand,
    authSwitchCommand,
  ],
  action: (context, args) =>
    // Default to login if no subcommand is provided
    authLoginCommand.action!(context, args),
};
