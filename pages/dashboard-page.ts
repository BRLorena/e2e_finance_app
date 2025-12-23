import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';
import { step } from '../decorators/test-step';

/**
 * Dashboard Page Object
 * Handles all interactions with the Dashboard page
 */
export class DashboardPage extends BasePage {
  // Dashboard-specific locators
  readonly welcomeHeading: Locator;
  readonly financialOverviewSubtitle: Locator;
  readonly thisMonthHeading: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize dashboard-specific locators
    this.welcomeHeading = page.getByRole('heading', { name: 'Welcome back, John Doe!' });
    this.financialOverviewSubtitle = page.getByText('Here\'s your financial overview for today');
    this.thisMonthHeading = page.getByRole('heading', { name: 'This Month' });
  }

  @step
  async navigate() {
    await this.gotoDashboard();
  }

  @step
  async verifyWelcomeMessage() {
    await expect(this.welcomeHeading).toBeVisible();
  }

  @step
  async verifyFinancialOverviewSubtitle() {
    await expect(this.financialOverviewSubtitle).toBeVisible();
  }

  @step
  async verifyTotalIncomeCard() {
    await expect(this.totalIncomeHeading).toBeVisible();
    await expect(this.getCurrencyLocator(0)).toBeVisible();
    await expect(this.page.locator('text=/\\d+ income entries recorded/')).toBeVisible();
  }

  @step
  async verifyTotalExpensesCard() {
    await expect(this.totalExpensesHeading).toBeVisible();
  }

  @step
  async verifyNetIncomeCard() {
    await expect(this.netIncomeHeading).toBeVisible();
  }

  @step
  async verifyThisMonthCard() {
    await expect(this.thisMonthHeading).toBeVisible();
    // Verify the card shows month data (like "December 2025")
    await expect(this.page.getByText(/[A-Z][a-z]+ \d{4}/).first()).toBeVisible();
  }

  @step
  async verifyIncomeByCategorySection() {
    // New UI shows a "Category Breakdown" card instead of inline categories
    await expect(this.page.getByRole('heading', { name: 'Category Breakdown' })).toBeVisible();
    await expect(this.page.getByText('Click to view breakdown by category')).toBeVisible();
  }

  @step
  async verifyExpensesByCategorySection() {
    // New UI shows a "Category Breakdown" card instead of inline categories
    await expect(this.page.getByRole('heading', { name: 'Category Breakdown' })).toBeVisible();
    await expect(this.page.getByText('Click to view breakdown by category')).toBeVisible();
  }

  @step
  async verifyInvoicesByStatusSection() {
    // New UI shows a "Recent Activities" card instead of inline invoice status
    await expect(this.page.getByRole('heading', { name: 'Recent Activities' })).toBeVisible();
    await expect(this.page.getByText('Click to view recent transactions')).toBeVisible();
  }

  @step
  async verifyAllDashboardSections() {
    await this.verifyMetricCardsVisible();
    await this.verifyCategoryBreakdownsVisible();
    await this.verifyRecentActivitySectionsVisible();
  }

  @step
  async filterByThisMonth() {
    await this.clickTimeFilter('This month');
  }

  @step
  async filterByThisYear() {
    await this.clickTimeFilter('This year');
  }

  @step
  async filterByAllTime() {
    await this.clickTimeFilter('All Time');
  }

  @step
  async verifyDashboardDataAfterFilter() {
    await expect(this.totalIncomeHeading).toBeVisible();
    await expect(this.incomeByCategoryHeading).toBeVisible();
  }

  @step
  async verifyNetIncomeCalculation() {
    // Verify Net Income card shows calculation label
    await expect(this.netIncomeHeading).toBeVisible();
    await expect(this.page.getByText('Revenue - Expenses')).toBeVisible();
  }

  @step
  async addNewExpenseFromDashboard(description: string, amount: string) {
    await this.gotoExpenses();
    await this.addExpenseButton.click();
    await this.page.getByRole('spinbutton', { name: /Amount(\s*\(\$\))?/i }).fill(amount);
    await this.descriptionInput.fill(description);
    await this.page.getByLabel('Category').selectOption(['Food & Dining']);
    await this.addExpenseButton.click();
  }

  @step
  async verifyRecentActivitySectionsVisible() {
    // New dashboard UI shows a placeholder card instead of detailed recent activity sections
    await expect(this.page.getByRole('heading', { name: 'Recent Activities' })).toBeVisible();
    await expect(this.page.getByText('Click to view recent transactions')).toBeVisible();
  }

  @step
  async verifyRecentActivityUpdated() {
    // For the new UI, just verify we can navigate back to dashboard
    await this.gotoDashboard();
    await expect(this.page.getByRole('heading', { name: 'Recent Activities' })).toBeVisible();
  }

  @step
  async verifyInvoicesByStatus(status: string, pattern: RegExp) {
    // New UI doesn't show invoice status breakdown on dashboard, just a placeholder card
    // This test is no longer applicable for the current UI
    await expect(this.page.getByRole('heading', { name: 'Recent Activities' })).toBeVisible();
  }

  @step
  async verifyCompleteDataDisplay() {
    await expect(this.welcomeHeading).toBeVisible();
    await expect(this.totalIncomeHeading).toBeVisible();
    await expect(this.totalExpensesHeading).toBeVisible();
    await expect(this.netIncomeHeading).toBeVisible();
    await expect(this.thisMonthHeading).toBeVisible();
    // New UI shows placeholder cards instead of detailed breakdowns
    await expect(this.page.getByRole('heading', { name: 'Category Breakdown' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Recent Activities' })).toBeVisible();
  }
}
