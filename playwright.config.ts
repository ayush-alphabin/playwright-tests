// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  snapshotDir: './__screenshots__', // ✅ Baseline image storage
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 1, // Enable retries for flaky test behavior
  workers: isCI ? 10 : 10,

  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: './playwright-report/report.json' }],

    [
      '@testdino/playwright',
      {
        token: process.env.TESTDINO_TOKEN || 'trx_staging_e3cef70bdf4748327f1a9fa2b12e56b9cb3260f29819651cf69bf52a42368047',
        serverUrl: process.env.TESTDINO_SERVER_URL || 'https://stg-api.testdino.com',
        debug: true,
        artifacts: true,
        ciRunId: `gh-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT}`
      },
    ],
  ],

  use: {
    baseURL: 'https://storedemo.testdino.com/products',
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },

  projects: [
    {
      name: 'api',
      use: { ...devices['API'] },
      // grep: /@api/,
    },
  ],
});
