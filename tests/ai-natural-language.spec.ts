// spec: new_features.md - Natural Language Expense Parsing
import { test, expect } from '@playwright/test';
import { ExpensePage } from '../pages';

// Test data for natural language parsing - Data-Driven approach
const naturalLanguageTestData = [
  {
    testName: 'groceries with relative date',
    input: 'Spent $45.50 on groceries yesterday',
    expectedAmount: '45.5',
    expectedDescription: 'groceries',
    expectedCategory: 'foodDining',
    dateType: 'yesterday'
  },
  {
    testName: 'transportation expense',
    input: 'Uber ride to airport for $32',
    expectedAmount: '32',
    expectedDescriptionContains: 'uber',
    expectedCategory: 'transportation',
    dateType: 'today' // AI defaults to today when no date specified
  },
  {
    testName: 'coffee purchase with time reference',
    input: 'Coffee at Starbucks $6.50 this morning',
    expectedAmount: '6.5',
    expectedDescriptionContains: 'coffee',
    expectedCategory: 'foodDining',
    dateType: 'today'
  }
];

test.describe('AI Features', { tag: '@ai' }, () => {
  test.describe('Natural Language Expense Parsing', () => {
    for (const testData of naturalLanguageTestData) {
      test(`Parse ${testData.testName}: "${testData.input}"`, async ({ page }) => {
        const expensePage = new ExpensePage(page);
        
        // Navigate to expenses page
        await expensePage.navigate();
        
        // Click Add New Expense and Quick Add buttons
        await expensePage.clickAddExpense();
        await expensePage.clickQuickAddButton();
        
        // Enter natural language input and parse
        await expensePage.fillNaturalLanguageInput(testData.input);
        await expensePage.clickParseWithAI();
        
        // Verify parsing success notification
        await expensePage.verifyParsingSuccessNotification();
        
        // Verify amount was parsed correctly
        await expensePage.verifyParsedAmount(testData.expectedAmount);
        
        // Verify description was extracted
        if (testData.expectedDescription) {
          await expensePage.verifyParsedDescription(testData.expectedDescription);
        } else if (testData.expectedDescriptionContains) {
          await expensePage.verifyParsedDescriptionContains(testData.expectedDescriptionContains);
        }
        
        // Verify category was suggested
        await expensePage.verifyAICategoryAutofilled(testData.expectedCategory);
        
        // Verify date was parsed
        if (testData.dateType === 'yesterday') {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const expectedDate = yesterday.toISOString().split('T')[0];
          await expensePage.verifyParsedDate(expectedDate);
        } else if (testData.dateType === 'today') {
          const today = new Date().toISOString().split('T')[0];
          await expensePage.verifyParsedDate(today);
        }
        
        // Submit the expense
        await expensePage.submitExpenseForm();
        
        // Verify expense was created successfully
        await expensePage.verifyExpenseCreatedSuccessfully();
      });
    }
  });
});
