import { defineConfig, devices } from "@playwright/test";
import { env } from "./src/config/environment";

// When BASE_URL is set (e.g. CI against Vercel) tests run against it;
// otherwise the local finance_app dev server is started.
const useLocalServer = !process.env.BASE_URL;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry once on CI to absorb free-tier cold starts; tests that pass only on
     retry are reported as flaky in the job summary and treated as bugs */
  retries: process.env.CI ? 1 : 0,
  /* Run tests in parallel on CI with 4 workers */
  workers: process.env.CI ? 4 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["html"],
    ["list"],
    ["json", { outputFile: "reports/results.json" }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: env.baseUrl,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    /* Take screenshot on failure */
    screenshot: "only-on-failure",

    /* Video on first retry */
    video: "retain-on-failure",
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
      name: "setup",
      testMatch: /.*\.setup\.ts/,
      teardown: "cleanup-setup",
    },

    // Chromium tests
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: ".auth/session.json",
      },
      dependencies: ["setup"],
      testIgnore: [/.*\.setup\.ts/, /ai-.*.spec.ts/],
    },

    // AI tests on Chromium (slower, longer timeouts)
    {
      name: "ai-tests",
      use: {
        ...devices["Desktop Chrome"],
        storageState: ".auth/session.json",
      },
      dependencies: ["setup"],
      testMatch: /ai-.*.spec.ts/,
      timeout: 30000,
    },

    // Cleanup after setup (hidden project)
    {
      name: "cleanup-setup",
      testMatch: /no-tests-to-match/,
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: useLocalServer
    ? {
        command: 'cd ../finance_app && npm run dev',
        url: 'http://127.0.0.1:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
      }
    : undefined,
});
