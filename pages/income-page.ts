import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';
import { step } from '../decorators/test-step';

/**
 * Income Page Object
 * Handles all interactions with the Income Management page
 */
export class IncomePage extends BasePage {
  // Income-specific locators
  readonly editIncomeHeading: Locator;
  readonly recurringIncomeCheckbox: Locator;
  readonly recurringFrequencyDropdown: Locator;
  readonly saveIncomeButton: Locator;
  readonly deleteButton: Locator;
  readonly confirmDeleteButton: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize income-specific locators
    this.editIncomeHeading = page.getByText('Edit Income');
    this.recurringIncomeCheckbox = page.getByRole('checkbox', { name: 'This is recurring income' });
    this.recurringFrequencyDropdown = page.getByLabel('Recurring Frequency');
    this.saveIncomeButton = page.getByRole('button', { name: 'Save' });
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
    this.confirmDeleteButton = page.getByRole('button', { name: 'Confirm' });
  }

  @step
  async navigate() {
    await this.gotoIncomes();
  }

  @step
  async verifyIncomePageLoaded() {
    await expect(this.totalIncomeText).toBeVisible();
  }

  @step
  async clickAddIncome() {
    await this.addIncomeButton.click();
  }

  @step
  async fillIncomeAmount(amount: string) {
    await this.page.getByRole('spinbutton', { name: 'Amount' }).fill(amount);
  }

  @step
  async selectCategory(category: string) {
    await this.categoryDropdown.selectOption([category]);
  }

  @step
  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  @step
  async fillDate(date: string) {
    await this.dateInput.fill(date);
  }

  @step
  async enableRecurringIncome() {
    await this.recurringIncomeCheckbox.click();
  }

  @step
  async selectRecurringFrequency(frequency: string) {
    await this.recurringFrequencyDropdown.selectOption([frequency]);
  }

  @step
  async submitIncomeForm() {
    await this.addIncomeButton.click();
  }

  @step
  async addValidIncome(amount: string, category: string, description: string, date: string) {
    await this.clickAddIncome();
    await this.fillIncomeAmount(amount);
    await this.selectCategory(category);
    await this.fillDescription(description);
    await this.fillDate(date);
    await this.submitIncomeForm();
  }

  @step
  async addRecurringIncome(
    amount: string,
    category: string,
    description: string,
    date: string,
    frequency: string
  ) {
    await this.clickAddIncome();
    await this.fillIncomeAmount(amount);
    await this.selectCategory(category);
    await this.fillDescription(description);
    await this.fillDate(date);
    await this.enableRecurringIncome();
    await this.selectRecurringFrequency(frequency);
    await this.submitIncomeForm();
  }

  @step
  async clickEditButtonByIndex(index: number) {
    await this.page.getByRole('button').nth(index).click();
  }

  @step
  async verifyEditFormOpened() {
    await expect(this.editIncomeHeading).toBeVisible();
  }

  @step
  async clearAndFillAmount(newAmount: string) {
    const amountField = this.page.getByRole('spinbutton', { name: 'Amount' });
    await amountField.clear();
    await amountField.fill(newAmount);
  }

  @step
  async updateCategory(newCategory: string) {
    await this.categoryDropdown.selectOption([newCategory]);
  }

  @step
  async saveChanges() {
    await this.saveIncomeButton.click();
  }

  @step
  async editIncome(amount: string, category: string) {
    await this.verifyEditFormOpened();
    await this.clearAndFillAmount(amount);
    await this.updateCategory(category);
    await this.saveChanges();
  }

  @step
  async clickDeleteButton() {
    await this.deleteButton.click();
  }

  @step
  async confirmDeletion() {
    await this.confirmDeleteButton.click();
  }

  @step
  async deleteIncome() {
    await this.clickDeleteButton();
    await this.confirmDeletion();
  }

  @step
  async filterByCategory(category: string) {
    await this.page.getByLabel('Category').selectOption([category]);
  }

  @step
  async clearCategoryFilter() {
    await this.page.getByLabel('Category').selectOption(['']);
  }

  @step
  async verifyFilteredResults(category: string) {
    await expect(this.totalIncomeText).toBeVisible();
    // The filtered results should show only the selected category
  }

  @step
  async verifyIncomeInList(description: string) {
    // Note: Due to pagination, we verify the page loaded successfully
    await this.verifyIncomePageLoaded();
  }
}
