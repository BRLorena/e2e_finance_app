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
  readonly novemberMonthText: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize dashboard-specific locators
    this.welcomeHeading = page.getByRole('heading', { name: 'Welcome back, John Doe!' });
    this.financialOverviewSubtitle = page.getByText('Here\'s your financial overview for today');
    this.novemberMonthText = page.getByText('November 2025');
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
    await expect(this.novemberMonthText).toBeVisible();
  }

  @step
  async verifyIncomeByCategorySection() {
    await expect(this.incomeByCategoryHeading).toBeVisible();
    await expect(this.page.getByText('Salary').first()).toBeVisible();
    await expect(this.getCountLocator(0)).toBeVisible();
  }

  @step
  async verifyExpensesByCategorySection() {
    await expect(this.expensesByCategoryHeading).toBeVisible();
    await expect(this.page.getByText('Food & Dining').first()).toBeVisible();
  }

  @step
  async verifyInvoicesByStatusSection() {
    await expect(this.invoicesByStatusHeading).toBeVisible();
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
    await this.page.getByRole('spinbutton', { name: 'Amount ($)' }).fill(amount);
    await this.descriptionInput.fill(description);
    await this.page.getByLabel('Category').selectOption(['Food & Dining']);
    await this.addExpenseButton.click();
  }

  @step
  async verifyRecentActivityUpdated() {
    await this.gotoDashboard();
    await expect(this.recentExpensesHeading).toBeVisible();
  }

  @step
  async verifyInvoicesByStatus(status: string, pattern: RegExp) {
    await expect(this.page.getByText(new RegExp(status, 'i')).first()).toBeVisible();
    await expect(this.page.getByText(pattern).first()).toBeVisible();
  }

  @step
  async verifyCompleteDataDisplay() {
    await expect(this.welcomeHeading).toBeVisible();
    await expect(this.totalIncomeHeading).toBeVisible();
    await expect(this.totalExpensesHeading).toBeVisible();
    await expect(this.netIncomeHeading).toBeVisible();
    await expect(this.thisMonthHeading).toBeVisible();
    await expect(this.incomeByCategoryHeading).toBeVisible();
    await expect(this.expensesByCategoryHeading).toBeVisible();
    await expect(this.invoicesByStatusHeading).toBeVisible();
  }
}
