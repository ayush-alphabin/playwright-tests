import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/coverage',
  fullyParallel: true,
  retries: 0,
  workers: 4,
  timeout: 30_000,

  reporter: [
    ['list'],
    [
      '@testdino/playwright',
      {
        token: process.env.TESTDINO_TOKEN || 'trx_development_8c9b8ba394b90b19e91298eed255479a1995f05943e4a27f5fb797eb7981a01d',
        serverUrl: process.env.TESTDINO_SERVER_URL || 'http://localhost:3001',
        debug: true,
        artifacts: true,
        coverage: {
          enabled: true,
        },
      },
    ],
  ],

  use: {
    baseURL: 'http://localhost:5199',
    headless: true,
    screenshot: 'off',
    video: 'off',
    trace: 'off',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'cd app && npx vite --port 5199',
    port: 5199,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
