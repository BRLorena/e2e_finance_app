/**
 * Reusable expense-related assertions
 * Centralized assertions for better test readability and maintainability
 */

import { expect, Page } from '@playwright/test';
import { step } from '../../decorators/test-step';

export class ExpenseAssertions {
  constructor(private readonly page: Page) {}

  @step
  async assertExpensePageLoaded() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.getByText('Total Expenses')).toBeVisible();
    await expect(this.page.getByText('Count')).toBeVisible();
  }

  @step
  async assertExpenseVisible(description: string) {
    await expect(this.page.getByRole('heading', { name: description })).toBeVisible();
  }

  @step
  async assertExpenseNotVisible(description: string) {
    await expect(this.page.getByRole('heading', { name: description })).not.toBeVisible();
  }

  @step
  async assertExpenseCount(expectedCount: number) {
    const countElement = this.page.locator('p:has-text("Count") + p');
    await expect(countElement).toBeVisible();
    const count = await countElement.textContent();
    const actualCount = parseInt(count?.replace(/"/g, '') || '0');
    expect(actualCount).toBe(expectedCount);
  }

  @step
  async assertExpenseCountGreaterThan(minCount: number) {
    const countElement = this.page.locator('p:has-text("Count") + p');
    await expect(countElement).toBeVisible();
    const count = await countElement.textContent();
    const actualCount = parseInt(count?.replace(/"/g, '') || '0');
    expect(actualCount).toBeGreaterThan(minCount);
  }

  @step
  async assertTotalExpensesGreaterThan(minAmount: number) {
    const totalElement = this.page.locator('p:has-text("Total Expenses") + p');
    await expect(totalElement).toBeVisible();
    const total = await totalElement.textContent();
    const actualTotal = parseFloat(total?.replace(/[$",]/g, '') || '0');
    expect(actualTotal).toBeGreaterThan(minAmount);
  }

  @step
  async assertEditFormOpened() {
    await expect(this.page.getByText('Edit Expense')).toBeVisible();
  }

  @step
  async assertDeleteConfirmationVisible() {
    await expect(this.page.getByRole('button', { name: 'Confirm' })).toBeVisible();
  }
}
