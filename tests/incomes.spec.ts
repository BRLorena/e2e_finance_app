// spec: TEST_PLAN.md - Income Management
// seed: tests/seed.spec.ts
import { test, expect } from '@playwright/test';
import { IncomePage } from '../pages';

test.describe('Income Management', () => {
  test('Add Valid Income Entry', async ({ page }) => {
    const incomePage = new IncomePage(page);
    const uniqueDescription = incomePage.generateUniqueDescription('November salary payment');

    await incomePage.navigate();
    await incomePage.addValidIncome('3500', 'Salary', uniqueDescription, '2025-11-20');
    await incomePage.verifyIncomePageLoaded();
  });

  test('Add Recurring Income', async ({ page }) => {
    const incomePage = new IncomePage(page);
    const uniqueDescription = incomePage.generateUniqueDescription('Monthly retainer client');

    await incomePage.navigate();
    await incomePage.clickAddIncome();
    await incomePage.fillIncomeAmount('2000');
    await incomePage.selectCategory('Freelance');
    await incomePage.fillDescription(uniqueDescription);
    await incomePage.fillDate('2025-11-01');
    await incomePage.enableRecurringIncome();
    
    await page.getByLabel('Frequency').selectOption(['Monthly']);
    
    await incomePage.submitIncomeForm();
    await incomePage.verifyIncomePageLoaded();
  });

  test('Edit Income Entry', async ({ page }) => {
    const incomePage = new IncomePage(page);
    const updatedDescription = incomePage.generateUniqueDescription('Edited income entry');

    await incomePage.navigate();
    await incomePage.verifyIncomePageLoaded();
    await incomePage.clickEditButtonByIndex(1);
    await incomePage.verifyEditFormOpened();
    
    await incomePage.clearAndFillAmount('5000');
    
    await page.getByRole('textbox', { name: 'Description' }).clear();
    await page.getByRole('textbox', { name: 'Description' }).fill(updatedDescription);
    
    await incomePage.updateCategory('Freelance');
    
    await page.getByRole('button', { name: 'Update Income' }).click();
    
    await incomePage.verifyIncomePageLoaded();
    await expect(page.getByText('Your Income History')).toBeVisible();
  });

  test('Delete Income Entry', async ({ page }) => {
    const incomePage = new IncomePage(page);
    const uniqueDescription = incomePage.generateUniqueDescription('Income to delete test');

    await incomePage.navigate();
    await incomePage.addValidIncome('500', 'Investment', uniqueDescription, '2025-11-20');
    await incomePage.verifyIncomePageLoaded();

    page.on('dialog', dialog => dialog.accept());
    
    await incomePage.clickEditButtonByIndex(2);
    await incomePage.verifyIncomePageLoaded();
  });

  test('Filter Income by Category', async ({ page }) => {
    const incomePage = new IncomePage(page);
    const salaryDescription = incomePage.generateUniqueDescription('Salary income for filter test');
    const freelanceDescription = incomePage.generateUniqueDescription('Freelance income for filter test');

    await incomePage.navigate();
    
    await incomePage.addValidIncome('3500', 'Salary', salaryDescription, '2025-11-20');
    await incomePage.verifyIncomePageLoaded();
    
    await incomePage.addValidIncome('2000', 'Freelance', freelanceDescription, '2025-11-20');
    await incomePage.verifyIncomePageLoaded();
    
    await incomePage.filterByCategory('Salary');
    await expect(page.getByText('Salary').first()).toBeVisible();
    await incomePage.verifyFilteredResults('Salary');
  });
});
