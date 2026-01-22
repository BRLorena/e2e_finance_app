import { Page } from '@playwright/test';
import { ExpensePage, IncomePage, InvoicePage } from '../pages';

/**
 * Centralized test cleanup utility
 * Handles deletion of test data created during test execution
 */
export class TestCleanup {
  private expensesToDelete: string[] = [];
  private incomesToDelete: string[] = [];
  private invoicesToDelete: string[] = [];

  /**
   * Register an expense for cleanup
   */
  trackExpense(description: string) {
    this.expensesToDelete.push(description);
  }

  /**
   * Register an income for cleanup
   */
  trackIncome(description: string) {
    this.incomesToDelete.push(description);
  }

  /**
   * Register an invoice for cleanup
   */
  trackInvoice(clientName: string) {
    this.invoicesToDelete.push(clientName);
  }

  /**
   * Clean up all tracked test data
   */
  async cleanup(page: Page) {
    // Delete expenses
    if (this.expensesToDelete.length > 0) {
      const expensePage = new ExpensePage(page);
      for (const description of this.expensesToDelete) {
        await expensePage.deleteByDescription(description);
      }
    }

    // Delete incomes
    if (this.incomesToDelete.length > 0) {
      const incomePage = new IncomePage(page);
      for (const description of this.incomesToDelete) {
        await incomePage.deleteByDescription(description);
      }
    }

    // Delete invoices
    if (this.invoicesToDelete.length > 0) {
      const invoicePage = new InvoicePage(page);
      for (const clientName of this.invoicesToDelete) {
        await invoicePage.deleteByClientName(clientName);
      }
    }

    // Clear tracking arrays
    this.expensesToDelete = [];
    this.incomesToDelete = [];
    this.invoicesToDelete = [];
  }

  /**
   * Clear all tracked items without deleting
   */
  reset() {
    this.expensesToDelete = [];
    this.incomesToDelete = [];
    this.invoicesToDelete = [];
  }
}
