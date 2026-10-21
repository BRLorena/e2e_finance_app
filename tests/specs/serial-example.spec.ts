// Example: serial suite — one browser context shared across all tests in order.
// Tests run sequentially; a failure stops the remaining tests.
import { test, expect } from "../../fixtures/cleanup-fixture";
import { DashboardPage, ExpensePage } from "../../src/pages";

test.describe.serial("Serial flow example", () => {
  let sharedPage: import("@playwright/test").Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({
      storageState: ".auth/session.json",
    });
    sharedPage = await context.newPage();
  });

  test.afterAll(async () => {
    await sharedPage.context().close();
  });

  test("Step 1 — load dashboard", async () => {
    const dashboardPage = new DashboardPage(sharedPage);
    await dashboardPage.navigate();
    await dashboardPage.verifyWelcomeMessage();
  });

  test("Step 2 — navigate to expenses", async () => {
    const expensePage = new ExpensePage(sharedPage);
    await expensePage.navigate();
    await expect(sharedPage).toHaveURL(/expense/i);
  });

  test("Step 3 — verify expense page loaded", async () => {
    await expect(
      sharedPage.getByRole("heading", {
        name: "Expense Management",
        exact: true,
      }),
    ).toBeVisible();
  });
});
