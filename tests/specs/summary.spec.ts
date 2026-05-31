// spec: TEST_PLAN.md
// seed: tests/seed.spec.ts

import { test, expect } from "../../fixtures/cleanup-fixture";
import { SummaryPage } from "../../src/pages";

test.describe("Summary Page Functionality", () => {
  test("View Complete Summary", async ({ browser }) => {
    const context = await browser.newContext({
      recordHar: { path: "./reports/summary-view.har", mode: "full" },
      storageState: ".auth/session.json",
    });
    const page = await context.newPage();
    const summaryPage = new SummaryPage(page);

    await summaryPage.navigate();
    await summaryPage.verifyCompleteSummaryDisplay();

    await context.close();
  });

  test("Filter Summary by Time Period", async ({ page }) => {
    const summaryPage = new SummaryPage(page);

    await summaryPage.navigate();
    await summaryPage.filterByThisMonth();
    await summaryPage.verifySummaryAfterFilter();
    await summaryPage.filterByThisYear();
    await summaryPage.verifySummaryAfterFilter();
    await summaryPage.filterByAllTime();
    await summaryPage.verifySummaryAfterFilter();
  });

  test("Verify Category Breakdowns", async ({ page }) => {
    const summaryPage = new SummaryPage(page);

    await summaryPage.navigate();
    await summaryPage.verifyAllCategoryBreakdownDetails();
  });
});
