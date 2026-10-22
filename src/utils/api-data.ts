import { expect, Page } from '@playwright/test';

/**
 * Test data setup through the app's API, using the logged-in session.
 * Tests arrange their own data this way (fast and deterministic) and keep
 * the UI for the behaviour under test, instead of relying on whatever data
 * earlier runs left behind.
 */

const today = () => new Date().toISOString().slice(0, 10);

export async function createExpenseViaApi(
  page: Page,
  expense: { description: string; amount: string; category: string; date?: string }
) {
  const response = await page.request.post('/api/expenses', {
    data: { date: today(), ...expense },
  });
  expect(response.status(), `create expense "${expense.description}"`).toBe(201);
  return response.json();
}

export async function createIncomeViaApi(
  page: Page,
  income: { description: string; amount: string; category: string; date?: string; recurring?: boolean }
) {
  const response = await page.request.post('/api/incomes', {
    data: { date: today(), recurring: false, ...income },
  });
  expect(response.status(), `create income "${income.description}"`).toBe(201);
  return response.json();
}
