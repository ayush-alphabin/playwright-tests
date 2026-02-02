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
      serverUrl: 'http://localhost',
      token: 'trx_development_21cbe0a39d83ca2afd399e647dbe29ae99dfca74678e6198a5d4575afa0c2d4a',
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