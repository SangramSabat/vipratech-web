import {defineConfig, devices} from '@playwright/test';
import {existsSync} from 'node:fs';

/**
 * End-to-end verification of the locked spec (docs/05-ui-ux-spec.md §11).
 *
 * These tests run against the *built* artifact rather than the dev server,
 * because the things most worth protecting only exist after a production
 * build: the prerendered HTML, hydration, and the shipped bundle.
 */

// Sandboxes here ship a Chromium that predates the revision this Playwright
// version downloads. Prefer the local binary when it exists; in CI the browser
// is installed by `playwright install` and this stays undefined.
const LOCAL_CHROMIUM = '/opt/pw-browsers/chromium';
const executablePath = existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined;

export const BASE_URL = 'http://127.0.0.1:4173';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    launchOptions: {
      executablePath,
      // Required in the containerised sandbox; harmless elsewhere.
      args: ['--no-sandbox'],
    },
  },
  projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
  webServer: {
    command: 'bun run build && bun run preview --port 4173 --strictPort',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
