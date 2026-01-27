import { test as base } from '@playwright/test';
import { TestCleanup } from '../src/utils/test-cleanup';

/**
 * Extended test fixture with automatic cleanup
 * Usage: import { test } from '../fixtures/cleanup-fixture';
 */
export const test = base.extend<{ cleanup: TestCleanup }>({
  cleanup: async ({ page }, use) => {
    const cleanup = new TestCleanup();
    await use(cleanup);
    // Automatic cleanup after each test - wrapped in try-catch to prevent test failures on cleanup errors
    try {
      await cleanup.cleanup(page);
    } catch (error) {
      // Silently ignore cleanup errors - test data may already be deleted or not found
      console.log('Cleanup skipped or failed:', error instanceof Error ? error.message : 'unknown error');
    }
  },
});

export { expect } from '@playwright/test';
