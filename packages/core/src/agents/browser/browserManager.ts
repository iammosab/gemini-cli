/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Browser, BrowserContext, Page } from 'playwright';
import module from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { Storage } from '../../config/storage.js';
import { debugLogger } from '../../utils/debugLogger.js';

export class BrowserManager {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  async getPage(): Promise<Page> {
    if (!this.browser || !this.browser.isConnected()) {
      let chromium;
      try {
        const playwright = await import('playwright');
        chromium = playwright.chromium;
      } catch (_e) {
        try {
          const requireUser = module.createRequire(
            path.join(process.cwd(), 'package.json'),
          );
          const playwrightPath = requireUser.resolve('playwright');
          const playwright = await import(playwrightPath);
          chromium = playwright.chromium;
        } catch (_e2) {
          // Fallback: Managed installation in ~/.gemini/dependencies
          chromium = await this.ensureManagedPlaywrightAvailable();
        }
      }

      this.browser = await chromium.launch({
        headless: false,
        // channel: 'chrome', // Use actual Google Chrome
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--window-size=1024,1024',
        ],
      });

      this.context = await this.browser!.newContext({
        viewport: null,
      });

      this.page = await this.context.newPage();

      // Handle page close
      this.page.on('close', () => {
        this.page = null;
      });

      // Handle browser close
      this.browser!.on('disconnected', () => {
        this.browser = null;
        this.context = null;
        this.page = null;
      });
    }

    if (!this.page || this.page.isClosed()) {
      if (!this.context) {
        // This case might happen if browser is open but context was closed somehow,
        // though typically they close together.
        if (this.browser) {
          this.context = await this.browser.newContext({
            viewport: null,
          });
        }
      }
      if (this.context) {
        this.page = await this.context.newPage();
      }
    }

    if (!this.page) {
      throw new Error('Failed to create page');
    }

    return this.page;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async ensureManagedPlaywrightAvailable(): Promise<any> {
    const depDir = Storage.getGlobalDependenciesDir();
    const depPkgJson = path.join(depDir, 'package.json');

    if (!fs.existsSync(depDir)) {
      fs.mkdirSync(depDir, { recursive: true });
    }
    if (!fs.existsSync(depPkgJson)) {
      fs.writeFileSync(depPkgJson, '{}');
    }

    const requireGlobal = module.createRequire(depPkgJson);
    try {
      const playwrightPath = requireGlobal.resolve('playwright');
      const playwright = await import(playwrightPath);
      return playwright.chromium;
    } catch (_e3) {
      debugLogger.log('Playwright not found globally. Installing...');
      try {
        await this.installPlaywright(depDir);

        const playwrightPath = requireGlobal.resolve('playwright');
        const playwright = await import(playwrightPath);
        return playwright.chromium;
      } catch (installError: unknown) {
        const errorMessage =
          installError instanceof Error
            ? installError.message
            : String(installError);
        throw new Error(
          `Failed to install Playwright in ${depDir}: ${errorMessage}`,
        );
      }
    }
  }

  private async installPlaywright(cwd: string): Promise<void> {
    // We use spawn to inherit stdio so user sees progress
    const { spawn } = await import('node:child_process');

    const installPackage = () =>
      new Promise<void>((resolve, reject) => {
        const npm = spawn('npm', ['install', 'playwright'], {
          cwd,
          stdio: 'inherit',
          shell: true,
        });
        npm.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(
              new Error(`npm install playwright exited with code ${code}`),
            );
          }
        });
        npm.on('error', reject);
      });

    const installBrowsers = () =>
      new Promise<void>((resolve, reject) => {
        const npx = spawn('npx', ['playwright', 'install', 'chromium'], {
          cwd,
          stdio: 'inherit',
          shell: true,
        });
        npx.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(
              new Error(
                `npx playwright install chromium exited with code ${code}`,
              ),
            );
          }
        });
        npx.on('error', reject);
      });

    console.log(
      'Playwright is required for the Browser Agent. Installing to ' +
        cwd +
        '...',
    );
    await installPackage();
    console.log('Installing Chromium browser...');
    await installBrowsers();
    console.log('Playwright installation complete.');
  }

  async close() {
    await this.browser?.close();
    this.browser = null;
    this.context = null;
    this.page = null;
  }
}

export const browserManager = new BrowserManager();
