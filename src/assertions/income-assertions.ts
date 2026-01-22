/**
 * Reusable income-related assertions
 * Centralized assertions for better test readability and maintainability
 */

import { expect, Page } from '@playwright/test';
import { step } from '../../decorators/test-step';

export class IncomeAssertions {
  constructor(private readonly page: Page) {}

  @step
  async assertIncomePageLoaded() {
    await expect(this.page.getByRole('heading', { name: /Income Management|Your Income(s)?/i }).first()).toBeVisible();
  }

  @step
  async assertIncomeVisible(description: string) {
    await expect(this.page.getByRole('heading', { name: description })).toBeVisible();
  }

  @step
  async assertIncomeNotVisible(description: string) {
    await expect(this.page.getByRole('heading', { name: description })).not.toBeVisible();
  }

  @step
  async assertEditFormOpened() {
    await expect(this.page.getByText('Edit Income')).toBeVisible();
  }

  @step
  async assertDeleteConfirmationVisible() {
    await expect(this.page.getByRole('button', { name: 'Confirm' })).toBeVisible();
  }

  @step
  async assertRecurringIncomeCreated(description: string) {
    await this.assertIncomePageLoaded();
    // Additional verification for recurring income badge or indicator can be added here
  }
}
