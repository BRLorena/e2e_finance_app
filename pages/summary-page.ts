import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';
import { step } from '../decorators/test-step';

/**
 * Summary Page Object
 * Handles all interactions with the Summary page
 */
export class SummaryPage extends BasePage {
  // Summary-specific locators
  readonly financialSummaryHeading: Locator;
  readonly comprehensiveOverviewText: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize summary-specific locators
    this.financialSummaryHeading = page.getByRole('heading', { name: 'Financial Summary' });
    this.comprehensiveOverviewText = page.getByText('Comprehensive overview of your financial data');
  }

  @step
  async navigate() {
    await this.gotoSummary();
  }

  @step
  async verifyPageHeader() {
    await expect(this.financialSummaryHeading).toBeVisible();
  }

  @step
  async verifyPageSubtitle() {
    await expect(this.comprehensiveOverviewText).toBeVisible();
  }

  @step
  async verifyAllTimeFilterButtons() {
    await this.verifyTimeFiltersVisible();
  }

  @step
  async verifyAllMetricCards() {
    await this.verifyMetricCardsVisible();
  }

  @step
  async verifyIncomeDataDisplay() {
    await expect(this.page.getByText(/\$[\d,]+\.\d{2}/).first()).toBeVisible();
    await expect(this.page.getByText(/\d+ income entries recorded/)).toBeVisible();
  }

  @step
  async verifyAllCategoryBreakdowns() {
    await this.verifyCategoryBreakdownsVisible();
  }

  @step
  async verifyAllRecentActivitySections() {
    await this.verifyRecentActivitySectionsVisible();
  }

  @step
  async verifyCompleteSummaryDisplay() {
    await this.verifyPageHeader();
    await this.verifyPageSubtitle();
    await this.verifyAllTimeFilterButtons();
    await this.verifyAllMetricCards();
    await this.verifyIncomeDataDisplay();
    await this.verifyAllCategoryBreakdowns();
    await this.verifyAllRecentActivitySections();
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
  async verifySummaryAfterFilter() {
    await expect(this.financialSummaryHeading).toBeVisible();
    await expect(this.totalIncomeHeading).toBeVisible();
    await expect(this.incomeByCategoryHeading).toBeVisible();
  }

  @step
  async verifyIncomeCategoryBreakdown() {
    await expect(this.page.getByText(/Salary.*\(\d+\)/)).toBeVisible();
    await expect(this.page.getByText(/Freelance.*\(\d+\)/)).toBeVisible();
    await expect(this.page.getByText(/Business.*\(\d+\)/)).toBeVisible();
    await expect(this.page.getByText(/Investment.*\(\d+\)/)).toBeVisible();
  }

  @step
  async verifyIncomeCategoryAmounts() {
    await expect(this.page.getByText(/\$[\d,]+\.\d{2}/).nth(1)).toBeVisible();
    await expect(this.page.getByText(/\$[\d,]+\.\d{2}/).nth(2)).toBeVisible();
  }

  @step
  async verifyExpenseCategoryBreakdown() {
    await expect(this.page.getByText(/Food & Dining.*\(\d+\)/)).toBeVisible();
    await expect(this.page.getByText(/Entertainment.*\(\d+\)/)).toBeVisible();
  }

  @step
  async verifyInvoiceStatusBreakdown() {
    await expect(this.page.getByText(/paid.*\(\d+\)/)).toBeVisible();
    await expect(this.page.getByText(/pending.*\(\d+\)/)).toBeVisible();
    await expect(this.page.getByText(/overdue.*\(\d+\)/)).toBeVisible();
  }

  @step
  async verifyInvoiceStatusTotals() {
    await expect(this.page.getByText(/\$[\d,]+\.\d{2}/).nth(3)).toBeVisible();
    await expect(this.page.getByText(/\$[\d,]+\.\d{2}/).nth(4)).toBeVisible();
    await expect(this.page.getByText(/\$[\d,]+\.\d{2}/).nth(5)).toBeVisible();
  }

  @step
  async verifyRecentActivityFormats() {
    await expect(this.page.getByText(/\+\$[\d,]+\.\d{2}/).first()).toBeVisible();
    await expect(this.page.getByText(/-\$[\d,]+\.\d{2}/).first()).toBeVisible();
    await expect(this.page.getByText(/INV-[\w-]+/).first()).toBeVisible();
  }

  @step
  async verifyAllCategoryBreakdownDetails() {
    await this.verifyIncomeCategoryBreakdown();
    await this.verifyIncomeCategoryAmounts();
    await this.verifyExpenseCategoryBreakdown();
    await this.verifyInvoiceStatusBreakdown();
    await this.verifyInvoiceStatusTotals();
    await this.verifyRecentActivityFormats();
  }
}
