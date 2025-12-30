/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule, Argv } from 'yargs';
import {
  UserAccountManager,
  AuthType,
  clearCachedCredentialFile,
  sessionId,
  debugLogger,
} from '@google/gemini-cli-core';
import { loadCliConfig } from '../config/config.js';
import { initializeOutputListenersAndFlush } from '../gemini.js';
import { loadSettings } from '../config/settings.js';
import { exitCli } from './utils.js';

const userAccountManager = new UserAccountManager();

const listCommand: CommandModule = {
  command: 'list',
  describe: 'List all authenticated accounts',
  handler: async () => {
    const accounts = userAccountManager.getAccounts();
    const active = userAccountManager.getCachedGoogleAccount();

    if (accounts.length === 0) {
      debugLogger.log('No accounts found.');
      await exitCli();
      return;
    }

    debugLogger.log('Authenticated accounts:');
    accounts.forEach((acc) => {
      debugLogger.log(acc === active ? `* ${acc} (active)` : `  ${acc}`);
    });
    await exitCli();
  },
};

const switchCommand: CommandModule = {
  command: 'switch <email>',
  describe: 'Switch to another authenticated account',
  handler: async (argv) => {
    const email = argv['email'] as string;
    const accounts = userAccountManager.getAccounts();

    if (!accounts.includes(email)) {
      debugLogger.log(`Account ${email} not found. Please login first.`);
      await exitCli(1);
      return;
    }

    await userAccountManager.cacheGoogleAccount(email);
    debugLogger.log(`Switched to account: ${email}`);
    await exitCli();
  },
};

const loginCommand: CommandModule = {
  command: 'login',
  describe: 'Login with a new account',
  handler: async (argv) => {
    const settings = loadSettings();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = await loadCliConfig(settings.merged, sessionId, argv as any);
    try {
      await config.refreshAuth(AuthType.LOGIN_WITH_GOOGLE, true);
      const active = userAccountManager.getCachedGoogleAccount();
      debugLogger.log(`Successfully logged in as: ${active}`);
    } catch (e) {
      debugLogger.log('Login failed:', e);
      await exitCli(1);
      return;
    }
    await exitCli();
  },
};

const logoutCommand: CommandModule = {
  command: 'logout',
  describe: 'Log out and clear all cached credentials',
  handler: async () => {
    await clearCachedCredentialFile();
    debugLogger.log('Logged out.');
    await exitCli();
  },
};

export const authCommand: CommandModule = {
  command: 'auth',
  describe: 'Manage authentication',
  builder: (yargs: Argv) =>
    yargs
      .middleware(() => initializeOutputListenersAndFlush())
      .command(listCommand)
      .command(switchCommand)
      .command(loginCommand)
      .command(logoutCommand)
      .demandCommand(1, 'You need at least one command before continuing.')
      .version(false),
  handler: () => {},
};
