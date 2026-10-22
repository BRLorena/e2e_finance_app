import { test as base } from '@playwright/test';
import { TestCleanup } from '../src/utils/test-cleanup';

/**
 * Extended test fixture with automatic cleanup
 * Usage: import { test } from '../fixtures/cleanup-fixture';
 */
export const test = base.extend<{ cleanup: TestCleanup }>({
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
});

export { expect } from '@playwright/test';
