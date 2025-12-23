import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://finance-app-five-rosy.vercel.app',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video on first retry */
    video: 'retain-on-failure',
  },

  /* Increase timeout for cloud environments like Checkly */
  timeout: 60000, // 90 seconds per test
  expect: {
    timeout: 30000, // 60 seconds for assertions
  },

  /* Configure projects for major browsers */
  projects: [
    // Setup project - runs authentication and saves state
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      teardown: 'cleanup-setup',
    },

    // Regular tests - fast, run first
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Use saved authentication state
        storageState: '.auth/session.json',
      },
      dependencies: ['setup'],
      testIgnore: [/.*\.setup\.ts/, /ai-.*.spec.ts/], // Exclude AI tests
    },
    
    // AI tests - slower, longer timeouts
    {
      name: 'ai-tests',
      use: { 
        ...devices['Desktop Chrome'], 
        storageState: '.auth/session.json',
      },
      dependencies: ['setup'],
      testMatch: /ai-.*.spec.ts/, // Only AI tests
      timeout: 30000, // 30 seconds for AI API calls
    },
    
    // Cleanup after setup (hidden project)
    {
      name: 'cleanup-setup',
      testMatch: /no-tests-to-match/,
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
