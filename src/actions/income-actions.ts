/**
 * Reusable income-related actions
 * Extracted from IncomePage for better separation of concerns
 */

import { Page } from '@playwright/test';
import { step } from '../../decorators/test-step';

export class IncomeActions {
  constructor(private readonly page: Page) {}

  @step
  async fillIncomeForm(amount: string, category: string, description: string, date: string) {
    await this.page.getByRole('spinbutton', { name: 'Amount' }).fill(amount);
    await this.page.getByLabel('Category').selectOption([category]);
    await this.page.getByRole('textbox', { name: 'Description' }).fill(description);
    await this.page.getByLabel('Date').fill(date);
  }

  @step
  async submitIncome() {
    await this.page.getByRole('button', { name: /Save|Add Income/i }).click();
  }

  @step
  async addIncome(amount: string, category: string, description: string, date: string) {
    await this.page.getByRole('button', { name: 'Add New Income' }).click();
    await this.fillIncomeForm(amount, category, description, date);
    await this.submitIncome();
  }

  @step
  async addRecurringIncome(
    amount: string,
    category: string,
    description: string,
    date: string,
    frequency: string
  ) {
    await this.page.getByRole('button', { name: 'Add New Income' }).click();
    await this.fillIncomeForm(amount, category, description, date);
    await this.page.getByRole('checkbox', { name: 'This is recurring income' }).click();
    await this.page.getByLabel('Frequency').selectOption([frequency]);
    await this.submitIncome();
  }

  @step
  async editIncome(index: number, amount: string, category: string, description: string) {
    const editButtons = this.page.getByRole('button', { name: 'Edit' });
    await editButtons.nth(index - 1).click();
    
    await this.page.getByRole('spinbutton', { name: 'Amount' }).clear();
    await this.page.getByRole('spinbutton', { name: 'Amount' }).fill(amount);
    await this.page.getByLabel('Category').selectOption([category]);
    await this.page.getByRole('textbox', { name: 'Description' }).clear();
    await this.page.getByRole('textbox', { name: 'Description' }).fill(description);
    
    await this.page.getByRole('button', { name: /Update Income/i }).click();
  }

  @step
  async deleteIncome(index: number) {
    const deleteButtons = this.page.getByRole('button', { name: 'Delete' });
    await deleteButtons.nth(index - 1).click();
    await this.page.getByRole('button', { name: 'Confirm' }).click();
  }
}
