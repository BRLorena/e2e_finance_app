// spec: TEST_PLAN.md Section 5
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages';

test.describe('Dashboard Functionality', () => {
  test('View Dashboard with Data', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.navigate();
    await dashboardPage.verifyWelcomeMessage();
    await dashboardPage.verifyFinancialOverviewSubtitle();
    await dashboardPage.verifyTotalIncomeCard();
    await dashboardPage.verifyTotalExpensesCard();
    await dashboardPage.verifyNetIncomeCard();
    await dashboardPage.verifyThisMonthCard();
    await dashboardPage.verifyIncomeByCategorySection();
    await dashboardPage.verifyExpensesByCategorySection();

    await dashboardPage.verifyInvoicesByStatusSection();
    await dashboardPage.verifyRecentActivitySectionsVisible();
  });

  test('Filter Dashboard by Time Periods', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.navigate();
    await dashboardPage.filterByAllTime();
    await dashboardPage.verifyTimeFiltersVisible();
    await dashboardPage.filterByThisMonth();
    await dashboardPage.verifyTimeFiltersVisible();
    await dashboardPage.filterByThisYear();
    await dashboardPage.verifyTimeFiltersVisible();
  });

  test('Verify Net Income Calculation', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.navigate();
    await dashboardPage.verifyNetIncomeCalculation();
  });

  test('Verify Recent Activity Updates', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const timestamp = Date.now();
    
    await dashboardPage.addNewExpenseFromDashboard(`Dashboard activity test ${timestamp}`, '25.99');
    await dashboardPage.navigate();

    // Wait for dashboard content to fully load
    await new Promise(f => setTimeout(f, 3 * 1000));

    await dashboardPage.verifyRecentActivityUpdated();
    
    // Verify the new expense appears in recent activity
    await expect(page.getByText(`Dashboard activity test ${timestamp}`)).toBeVisible();
  });

  test('Verify Expenses by Category Visualization', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.navigate();
    await dashboardPage.verifyExpensesByCategorySection();
  });

  test('Verify Invoices by Status Breakdown', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.navigate();
    await dashboardPage.verifyInvoicesByStatusSection();
    await dashboardPage.verifyInvoicesByStatus('paid', /\$[\d,]+\.\d{2}/);
    await dashboardPage.verifyInvoicesByStatus('pending', /\(\d+\)/);
    await dashboardPage.verifyInvoicesByStatus('overdue', /\(\d+\)/);
  });

  test('Dashboard with Complete Data Verification', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.navigate();
    await dashboardPage.verifyCompleteDataDisplay();
  });
});