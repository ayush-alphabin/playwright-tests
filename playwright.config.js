require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');
const { debug } = require('console');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 1,
  timeout: process.env.CI ? 10000 : 5000,
  workers: process.env.CI ? 3 : 5,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: './playwright-report/report.json' }],
    ['@testdino/playwright', {
      serverUrl: process.env.TESTDINO_SERVER_URL || 'http://localhost:3005',
      token: process.env.TESTDINO_TOKEN,
      ciRunId: `ci-run-${new Date().toISOString().slice(0,10)}`,
      debug: true,
      artifacts: false
    }]
  ],
  use: {
    trace: "retry-with-trace",
    screenshot: "on-first-failure",
    video: "on-first-retry",
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});