import { test as base } from '@playwright/test';
import { TestCleanup } from '../src/utils/test-cleanup';

/**
 * Extended test fixture with automatic cleanup
 * Usage: import { test } from '../fixtures/cleanup-fixture';
 */
export const test = base.extend<{ cleanup: TestCleanup; failedRequests: void }>({
  cleanup: async ({ page }, use, testInfo) => {
    const cleanup = new TestCleanup();
    await use(cleanup);
    // Automatic cleanup after each test. Failures don't fail the test, but they are
    // annotated so leaked data is visible in the report instead of silently piling up.
    try {
      const failures = await cleanup.cleanup(page);
      for (const failure of failures) {
        testInfo.annotations.push({ type: 'cleanup-failed', description: failure });
      }
    } catch (error) {
      testInfo.annotations.push({
        type: 'cleanup-failed',
        description: error instanceof Error ? error.message : 'unknown error',
      });
    }
  },

  // Records the app's API responses with status >= 400 and attaches them to failed tests.
  // A UI timeout often hides a server error; the Jev triage reads this attachment as evidence.
  failedRequests: [
    async ({ page }, use, testInfo) => {
      const failed: string[] = [];
      page.on('response', async (response) => {
        const url = new URL(response.url());
        if (response.status() < 400 || !url.pathname.startsWith('/api/')) return;
        const body = await response.text().catch(() => '');
        failed.push(`${response.request().method()} ${url.pathname} → ${response.status()} ${body.slice(0, 200)}`);
      });
      await use();
      if (failed.length > 0 && testInfo.status !== testInfo.expectedStatus) {
        await testInfo.attach('failed-requests', {
          body: JSON.stringify(failed),
          contentType: 'application/json',
        });
      }
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
