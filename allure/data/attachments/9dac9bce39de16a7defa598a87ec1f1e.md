# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: specs/expenses.spec.ts >> Expense Management >> Filter Expenses by Category
- Location: tests/specs/expenses.spec.ts:97:7

# Error details

```
Error: expect(locator).toBeHidden() failed

Locator:  getByRole('heading', { name: 'Filter transport expense 059041' })
Expected: hidden
Received: visible
Timeout:  30000ms

Call log:
  - Expect "toBeHidden" getByRole('heading', { name: 'Filter transport expense 059041' }) with timeout 30000ms
  - waiting for getByRole('heading', { name: 'Filter transport expense 059041' })
    64 × locator resolved to <h3 class="text-lg font-semibold text-gray-100">Filter transport expense 059041</h3>
       - unexpected value "visible"

```

```yaml
- heading "Filter transport expense 059041" [level=3]
```

# Test source

```ts
  10  |       recordHar: { 
  11  |         path: './reports/expense-create.har',
  12  |         mode: 'full'
  13  |       },
  14  |       storageState: '.auth/session.json'
  15  |     });
  16  |     const page = await context.newPage();
  17  |     const expensePage = new ExpensePage(page);
  18  |     const uniqueDescription = expensePage.generateUniqueDescription('Coffee and breakfast');
  19  |     cleanup.trackExpense(uniqueDescription);
  20  | 
  21  |     await expensePage.navigate();
  22  |     await expensePage.addValidExpense('75.50', uniqueDescription, 'Food & Dining');
  23  |     await expensePage.verifyExpenseCreated();
  24  | 
  25  |     // Optional: Try to find the expense through search
  26  |     // This tests the search functionality as well
  27  |     await page.getByRole('textbox', { name: 'Search' }).fill(uniqueDescription);
  28  |     await page.waitForTimeout(1000);
  29  |     
  30  |     const searchResults = await page.getByText('No expenses found').isVisible().catch(() => false);
  31  |     
  32  |     if (searchResults) {
  33  |       // If not found in search, clear it and continue - expense might be on different page
  34  |       await page.getByRole('textbox', { name: 'Search' }).clear();
  35  |       console.log(`Expense "${uniqueDescription}" created but not found in search (likely on different page due to pagination)`);
  36  |     } else {
  37  |       // Try to find the expense in the results
  38  |       const expenseVisible = await page.getByRole('heading', { name: uniqueDescription }).isVisible().catch(() => false);
  39  |       if (expenseVisible) {
  40  |         console.log(`Expense "${uniqueDescription}" found in search results`);
  41  |       }
  42  |     }
  43  |     
  44  |     // Close context to save HAR file
  45  |     await context.close();
  46  |   });
  47  | 
  48  |   test('Edit Existing Expense', async ({ page, cleanup }) => {
  49  |     const expensePage = new ExpensePage(page);
  50  |     const updatedDescription = expensePage.generateUniqueDescription('Updated expense');
  51  |     cleanup.trackExpense(updatedDescription);
  52  | 
  53  |     await expensePage.navigate();
  54  |     await expensePage.verifyExpensePageLoaded();
  55  |     await page.waitForTimeout(1000);
  56  | 
  57  |     const firstExpenseHeading = page.locator('h3').first();
  58  |     await firstExpenseHeading.waitFor({ state: 'visible' });
  59  | 
  60  |     await expensePage.clickEditButtonByIndex(1);
  61  |     await expensePage.verifyEditFormOpened();
  62  |     // Ensure amount field has a valid value (UI bug: amount may be empty in edit mode)
  63  |     await expensePage.clearAndFillAmount('50');
  64  |     await expensePage.updateDescription(updatedDescription);
  65  |     await expensePage.updateCategory('Entertainment');
  66  |     await expensePage.saveChanges();
  67  | 
  68  |     // Wait for form to close and return to list
  69  |     await page.waitForTimeout(2000);
  70  |     
  71  |     await expensePage.verifyExpenseUpdated(updatedDescription);
  72  |   });
  73  | 
  74  |   test('Delete Expense', async ({ page, cleanup }) => {
  75  |     const expensePage = new ExpensePage(page);
  76  |     // Delete an expense this test owns, never whatever happens to be first in the list
  77  |     const description = expensePage.generateUniqueDescription('Expense to delete');
  78  |     cleanup.trackExpense(description);
  79  |     await createExpenseViaApi(page, { description, amount: '12.34', category: 'other' });
  80  | 
  81  |     await expensePage.navigate();
  82  |     const expenseHeading = page.getByRole('heading', { name: description });
  83  |     await expect(expenseHeading).toBeVisible();
  84  | 
  85  |     page.once('dialog', dialog => dialog.accept());
  86  |     // The card is the innermost element holding both the heading and its buttons;
  87  |     // its icon buttons have no accessible name, so Delete is the second one (Edit is first)
  88  |     const expenseCard = page.locator('div')
  89  |       .filter({ has: expenseHeading })
  90  |       .filter({ has: page.getByRole('button') })
  91  |       .last();
  92  |     await expenseCard.getByRole('button').nth(1).click();
  93  | 
  94  |     await expect(expenseHeading).toBeHidden();
  95  |   });
  96  | 
  97  |   test('Filter Expenses by Category', async ({ page, cleanup }) => {
  98  |     const expensePage = new ExpensePage(page);
  99  |     const food = expensePage.generateUniqueDescription('Filter food expense');
  100 |     const transport = expensePage.generateUniqueDescription('Filter transport expense');
  101 |     cleanup.trackExpense(food);
  102 |     cleanup.trackExpense(transport);
  103 |     await createExpenseViaApi(page, { description: food, amount: '20', category: 'foodDining' });
  104 |     await createExpenseViaApi(page, { description: transport, amount: '30', category: 'transportation' });
  105 | 
  106 |     await expensePage.navigate();
  107 |     await expensePage.filterByCategory('Food & Dining');
  108 | 
  109 |     await expect(page.getByRole('heading', { name: food })).toBeVisible();
> 110 |     await expect(page.getByRole('heading', { name: transport })).toBeHidden();
      |                                                                  ^ Error: expect(locator).toBeHidden() failed
  111 |     await expensePage.verifyFilteredResults();
  112 |   });
  113 | });
  114 | 
```