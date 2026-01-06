import { test as base } from '@playwright/test';
import { TestCleanup } from '../utils/test-cleanup';

/**
 * Extended test fixture with automatic cleanup
 * Usage: import { test } from '../fixtures/cleanup-fixture';
 */
export const test = base.extend<{ cleanup: TestCleanup }>({
  cleanup: async ({ page }, use) => {
    const cleanup = new TestCleanup();
    await use(cleanup);
    // Automatic cleanup after each test
    await cleanup.cleanup(page);
  },
});

export { expect } from '@playwright/test';
