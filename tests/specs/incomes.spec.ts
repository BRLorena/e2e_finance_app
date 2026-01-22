// spec: TEST_PLAN.md - Income Management
// seed: tests/seed.spec.ts
import { test, expect } from '../../fixtures/cleanup-fixture';
import { IncomePage } from '../../src/pages';

test.describe('Income Management', () => {
  test('Add Valid Income Entry', async ({ browser, cleanup }) => {
    // Create context with HAR recording for income creation flow
    const context = await browser.newContext({
      recordHar: { 
        path: './reports/income-create.har',
        mode: 'full'
      },
      storageState: '.auth/session.json'
    });
    const page = await context.newPage();
    const incomePage = new IncomePage(page);
    const uniqueDescription = incomePage.generateUniqueDescription('November salary payment');
    cleanup.trackIncome(uniqueDescription);

    await incomePage.navigate();
    await incomePage.addValidIncome('3500', 'Salary', uniqueDescription, '2025-11-20');
    await incomePage.verifyIncomePageLoaded();
    
    // Close context to save HAR file
    await context.close();
  });

  test('Add Recurring Income', async ({ page, cleanup }) => {
    const incomePage = new IncomePage(page);
    const uniqueDescription = incomePage.generateUniqueDescription('Monthly retainer client');
    cleanup.trackIncome(uniqueDescription);

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

  test('Edit Income Entry', async ({ page, cleanup }) => {
    const incomePage = new IncomePage(page);
    const updatedDescription = incomePage.generateUniqueDescription('Edited income entry');
    cleanup.trackIncome(updatedDescription);

    await incomePage.navigate();
    await incomePage.verifyIncomePageLoaded();
    await incomePage.clickEditButtonByIndex(1);
    await incomePage.verifyEditFormOpened();
    
    await incomePage.clearAndFillAmount('5000');
    
    await page.getByRole('textbox', { name: 'Description' }).clear();
    await page.getByRole('textbox', { name: 'Description' }).fill(updatedDescription);
    
    // Fill date field (UI bug: date may be empty in edit mode)
    await page.getByRole('textbox', { name: 'Date' }).fill('2025-12-23');
    
    await incomePage.updateCategory('Freelance');
    
    await incomePage.saveChanges();
    
    await incomePage.verifyIncomePageLoaded();
    await expect(page.getByText('Your Income History')).toBeVisible();
  });

  test('Delete Income Entry', async ({ page, cleanup }) => {
    const incomePage = new IncomePage(page);
    const uniqueDescription = incomePage.generateUniqueDescription('Income to delete test');

    await incomePage.navigate();
    await incomePage.addValidIncome('500', 'Investment', uniqueDescription, '2025-11-20');
    await incomePage.verifyIncomePageLoaded();

    cleanup.trackIncome(uniqueDescription);

    // Setup dialog handler before clicking delete
    page.once('dialog', dialog => dialog.accept());
    
    // Find the income card and click its delete button
    // Locate the card containing our income description, then find the delete button within it
    const incomeCard = page.locator('div').filter({ hasText: uniqueDescription }).first();
    await incomeCard.waitFor();
    await incomeCard.getByRole('button').nth(1).click(); // nth(0) is Edit, nth(1) is Delete
    await page.waitForTimeout(1000);
    await incomePage.verifyIncomePageLoaded();
  });

  test('Filter Income by Category', async ({ page, cleanup }) => {
    const incomePage = new IncomePage(page);
    const salaryDescription = incomePage.generateUniqueDescription('Salary income for filter test');
    const freelanceDescription = incomePage.generateUniqueDescription('Freelance income for filter test');
    cleanup.trackIncome(salaryDescription);
    cleanup.trackIncome(freelanceDescription);

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
