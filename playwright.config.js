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
    ['@testdino/playwright', {
      serverUrl: 'https://staging-api.testdino.com',
      token: 'trx_staging_4aa7ba96f02c8c0339159af527d7380f5a9ae051258358495bd71cc0bc1d7b37',
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