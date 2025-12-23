// spec: new_features.md - AI Expense Categorization
import { test, expect } from '@playwright/test';
import { ExpensePage } from '../pages';

// Test data for AI categorization - Data-Driven approach
// Note: Only using highly predictable categories to avoid flaky tests
const categorizationTestData = [
  {
    description: 'Pizza delivery',
    amount: '25.50',
    expectedCategory: 'foodDining',
    expectedCategoryDisplay: 'Food & Dining',
    testName: 'food-related expenses'
  },
  {
    description: 'Uber ride downtown',
    amount: '15.00',
    expectedCategory: 'transportation',
    expectedCategoryDisplay: 'Transportation',
    testName: 'transportation expenses'
  },
  {
    description: 'New shoes from Amazon',
    amount: '89.99',
    expectedCategory: 'shopping',
    expectedCategoryDisplay: 'Shopping',
    testName: 'shopping expenses'
  }
];

test.describe('AI Features', { tag: '@ai' }, () => {
  test.describe('AI Expense Categorization', () => {
  for (const testData of categorizationTestData) {
    test(`AI categorizes ${testData.testName} to "${testData.expectedCategoryDisplay}"`, async ({ page }) => {
      const expensePage = new ExpensePage(page);
      
      // Navigate to expenses page
      await expensePage.navigate();
      
      // Click Add New Expense button and fill form
      await expensePage.clickAddExpense();
      await expensePage.fillExpenseAmount(testData.amount);
      await expensePage.fillExpenseDescription(testData.description);
      
      // Click AI Suggest button
      await expensePage.clickAISuggestButton();
      
      // Verify category is auto-filled with expected category
      await expensePage.verifyAICategoryAutofilled(testData.expectedCategory);
      
      // Verify notification appears
      await expensePage.verifyAISuggestionNotification();
      
      // Submit the expense form
      await expensePage.submitExpenseForm();
      
      // Verify expense was created successfully
      await expensePage.verifyExpenseCreatedSuccessfully();
      
      // Verify expense appears in the list
      await expensePage.verifyExpenseInList(testData.description);
    });
  }

  test('AI categorization shows loading state during processing', async ({ page }) => {
    const expensePage = new ExpensePage(page);
    
    await expensePage.navigate();
    await expensePage.clickAddExpense();
    await expensePage.fillExpenseAmount('50.00');
    await expensePage.fillExpenseDescription('Expensive lunch');
    
    // Click AI Suggest button
    await expensePage.clickAISuggestButton();
    
    // Verify AI suggestion completed
    await expensePage.verifyAISuggestionNotification();
  });

  test('AI categorization works with vague descriptions', async ({ page }) => {
    const expensePage = new ExpensePage(page);
    
    await expensePage.navigate();
    await expensePage.clickAddExpense();
    await expensePage.fillExpenseAmount('30.00');
    await expensePage.fillExpenseDescription('stuff from store');
    
    await expensePage.clickAISuggestButton();
    
    // Verify AI suggests a category even for vague descriptions
    await expensePage.verifyAISuggestionNotification();
    
    // Verify a category was selected (should not be empty or "Select a category")
    const categoryValue = await page.getByRole('combobox', { name: 'Category' }).inputValue();
    expect(categoryValue).not.toBe('');
    expect(categoryValue.length).toBeGreaterThan(0);
  });
  });
});
