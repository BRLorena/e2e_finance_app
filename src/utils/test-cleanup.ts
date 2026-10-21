import { APIRequestContext, Page } from '@playwright/test';

type Resource = 'expenses' | 'incomes' | 'invoices';

/** A tracked value; `exact: false` matches any item whose field contains it */
type Tracked = { value: string; exact: boolean };

/**
 * Centralized test cleanup utility
 * Deletes test data through the app's API using the logged-in session,
 * which is faster and more reliable than clicking through the UI.
 */
export class TestCleanup {
  private expensesToDelete: Tracked[] = [];
  private incomesToDelete: Tracked[] = [];
  private invoicesToDelete: Tracked[] = [];

  /**
   * Register an expense for cleanup
   */
  trackExpense(description: string, { exact = true } = {}) {
    this.expensesToDelete.push({ value: description, exact });
  }

  /**
   * Register an income for cleanup
   */
  trackIncome(description: string, { exact = true } = {}) {
    this.incomesToDelete.push({ value: description, exact });
  }

  /**
   * Register an invoice for cleanup
   */
  trackInvoice(clientName: string) {
    this.invoicesToDelete.push({ value: clientName, exact: true });
  }

  /**
   * Clean up all tracked test data
   * Returns the items that could not be deleted so leaks are visible
   */
  async cleanup(page: Page): Promise<string[]> {
    const failures = [
      ...(await this.deleteAll(page.request, 'expenses', 'description', this.expensesToDelete)),
      ...(await this.deleteAll(page.request, 'incomes', 'description', this.incomesToDelete)),
      ...(await this.deleteAll(page.request, 'invoices', 'clientName', this.invoicesToDelete)),
    ];
    this.reset();
    return failures;
  }

  /**
   * Clear all tracked items without deleting
   */
  reset() {
    this.expensesToDelete = [];
    this.incomesToDelete = [];
    this.invoicesToDelete = [];
  }

  private async deleteAll(
    request: APIRequestContext,
    resource: Resource,
    field: 'description' | 'clientName',
    values: Tracked[]
  ): Promise<string[]> {
    if (values.length === 0) return [];

    const failures: string[] = [];
    // The list endpoints are paginated; one large page covers the test user's data
    const response = await request.get(`/api/${resource}?page=1&limit=1000`);
    if (!response.ok()) {
      return values.map(({ value }) => `${resource}: "${value}" (list returned ${response.status()})`);
    }
    const items: Array<{ id: string } & Record<string, unknown>> = (await response.json())[resource] ?? [];

    for (const { value, exact } of values) {
      const matches = items.filter((i) =>
        exact ? i[field] === value : String(i[field] ?? '').toLowerCase().includes(value.toLowerCase())
      );
      for (const item of matches) {
        const deleted = await request.delete(`/api/${resource}/${item.id}`);
        if (!deleted.ok()) failures.push(`${resource}: "${value}" (delete returned ${deleted.status()})`);
      }
    }
    return failures;
  }
}
