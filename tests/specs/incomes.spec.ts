// spec: TEST_PLAN.md - Income Management
// seed: tests/seed.spec.ts
import { test, expect } from '../../fixtures/cleanup-fixture';
import { IncomePage } from '../../src/pages';

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

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
    await incomePage.addValidIncome('3500', 'Salary', uniqueDescription, getTodayDate());
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
    await incomePage.fillDate(getTodayDate());
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
    await page.getByRole('textbox', { name: 'Date' }).fill(getTodayDate());
    
    await incomePage.updateCategory('Freelance');
    
    await incomePage.saveChanges();
    
    await incomePage.verifyIncomePageLoaded();
    await expect(page.getByText('Your Income History')).toBeVisible();
  });

  test('Delete Income Entry', async ({ page, cleanup }) => {
    const incomePage = new IncomePage(page);
    const uniqueDescription = incomePage.generateUniqueDescription('Income to delete test');

    await incomePage.navigate();
    await incomePage.addValidIncome('500', 'Investment', uniqueDescription, getTodayDate());
    await incomePage.verifyIncomePageLoaded();

    cleanup.trackIncome(uniqueDescription);

    // Search for the newly created income to ensure it's visible
    await incomePage.searchIncome(uniqueDescription);
    
    // Wait for the income card with our description to be visible
    // Retry the search if not found initially (handles potential timing issues)
    const incomeHeading = page.getByRole('heading', { name: uniqueDescription });
    
    // If not visible after first search, reload and try again
    const isVisible = await incomeHeading.isVisible().catch(() => false);
    if (!isVisible) {
      await page.reload();
      await incomePage.verifyIncomePageLoaded();
      await incomePage.searchIncome(uniqueDescription);
    }
    
    await expect(incomeHeading).toBeVisible({ timeout: 15000 });

    // Setup dialog handler before clicking delete
    page.once('dialog', dialog => dialog.accept());
    
    // Find the delete button in the same row as our income entry
    // The income card has a container with the heading and a sibling container with buttons
    // Use a more robust locator: find the list item/card containing the description, then its delete button
    const incomeCard = page.locator('div').filter({ has: incomeHeading }).first();
    const buttons = incomeCard.getByRole('button');
    
    // The delete button is the second button (index 1) - first is Edit
    await buttons.nth(1).click();
    
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
    
    await incomePage.addValidIncome('3500', 'Salary', salaryDescription, getTodayDate());
    await incomePage.verifyIncomePageLoaded();
    
    await incomePage.addValidIncome('2000', 'Freelance', freelanceDescription, getTodayDate());
    await incomePage.verifyIncomePageLoaded();
    
    await incomePage.filterByCategory('Salary');
    await expect(page.getByText('Salary').first()).toBeVisible();
    await incomePage.verifyFilteredResults('Salary');
  });
});
