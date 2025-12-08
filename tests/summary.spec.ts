// spec: TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { SummaryPage } from '../pages';

test.describe('Summary Page Functionality', () => {
  test('View Complete Summary', async ({ page }) => {
    const summaryPage = new SummaryPage(page);

    await summaryPage.navigate();
    await summaryPage.verifyCompleteSummaryDisplay();
  });

  test('Filter Summary by Time Period', async ({ page }) => {
    const summaryPage = new SummaryPage(page);

    await summaryPage.navigate();
    await summaryPage.filterByThisMonth();
    await summaryPage.verifySummaryAfterFilter();
    await summaryPage.filterByThisYear();
    await summaryPage.verifySummaryAfterFilter();
    await summaryPage.filterByAllTime();
    await summaryPage.verifySummaryAfterFilter();
  });

  test('Verify Category Breakdowns', async ({ page }) => {
    const summaryPage = new SummaryPage(page);

    await summaryPage.navigate();
    await summaryPage.verifyAllCategoryBreakdownDetails();
  });
});