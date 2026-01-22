/**
 * Reusable expense-related actions
 * Extracted from ExpensePage for better separation of concerns
 */

import { Page } from '@playwright/test';
import { step } from '../../decorators/test-step';

export class ExpenseActions {
  constructor(private readonly page: Page) {}

  @step
  async fillExpenseForm(amount: string, description: string, category: string) {
    await this.page.getByRole('spinbutton', { name: /Amount(\s*\(\$\))?/i }).fill(amount);
    await this.page.getByRole('textbox', { name: 'Description' }).fill(description);
    await this.page.getByLabel('Category').selectOption([category]);
  }

  @step
  async submitExpense() {
    await this.page.getByRole('button', { name: /Save|Add New Expense/i }).click();
    await this.page.waitForURL('**/expenses');
  }

  @step
  async addExpense(amount: string, description: string, category: string) {
    await this.page.getByRole('button', { name: 'Add New Expense' }).click();
    await this.fillExpenseForm(amount, description, category);
    await this.submitExpense();
  }

  @step
  async editExpense(index: number, amount: string, description: string, category: string) {
    const editButtons = this.page.getByRole('button', { name: 'Edit' });
    await editButtons.nth(index - 1).click();
    await this.fillExpenseForm(amount, description, category);
    await this.page.getByRole('button', { name: /Update Expense/i }).click();
  }

  @step
  async deleteExpense(index: number) {
    const deleteButtons = this.page.getByRole('button', { name: 'Delete' });
    await deleteButtons.nth(index - 1).click();
    await this.page.getByRole('button', { name: 'Confirm' }).click();
  }

  @step
  async searchExpense(description: string) {
    await this.page.getByRole('textbox', { name: 'Search' }).fill(description);
    await this.page.waitForTimeout(1000);
  }
}
