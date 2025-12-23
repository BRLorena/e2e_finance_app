import { Page, Locator } from '@playwright/test';

/**
 * BasePage class containing common locators and methods used across all pages
 * Following the Page Object Model pattern for better test maintainability
 */
export class BasePage {
  readonly page: Page;
  readonly baseUrl: string;

  // Common metric card headings used across Dashboard and Summary pages
  readonly totalIncomeHeading: Locator;
  readonly totalExpensesHeading: Locator;
  readonly netIncomeHeading: Locator;
  readonly thisMonthHeading: Locator;

  // Common text patterns for verification
  readonly totalIncomeText: Locator;
  readonly totalExpensesText: Locator;

  // Time filter buttons (Dashboard and Summary pages)
  readonly allTimeButton: Locator;
  readonly thisMonthButton: Locator;
  readonly thisYearButton: Locator;

  // Category section headings
  readonly incomeByCategoryHeading: Locator;
  readonly expensesByCategoryHeading: Locator;
  readonly invoicesByStatusHeading: Locator;

  // Recent activity section headings
  readonly recentIncomeHeading: Locator;
  readonly recentExpensesHeading: Locator;
  readonly recentInvoicesHeading: Locator;

  // Common form buttons
  readonly addIncomeButton: Locator;
  readonly addExpenseButton: Locator;
  readonly createInvoiceButton: Locator;

  // Common form fields
  readonly amountInput: Locator;
  readonly descriptionInput: Locator;
  readonly dateInput: Locator;
  readonly categoryDropdown: Locator;

  // Common patterns for dynamic data verification
  readonly currencyPattern: RegExp;
  readonly countPattern: RegExp;

  constructor(page: Page, baseUrl: string = 'https://finance-app-five-rosy.vercel.app') {
    this.page = page;
    this.baseUrl = baseUrl;

    // Initialize common metric card headings
    this.totalIncomeHeading = page.getByRole('heading', { name: 'Total Income' });
    this.totalExpensesHeading = page.getByRole('heading', { name: 'Total Expenses' });
    this.netIncomeHeading = page.getByRole('heading', { name: 'Net Income' });
    this.thisMonthHeading = page.getByRole('heading', { name: 'This Month' });

    // Initialize common text locators
    this.totalIncomeText = page.getByText('Total Income');
    this.totalExpensesText = page.getByText('Total Expenses');

    // Initialize time filter buttons
    this.allTimeButton = page.getByRole('button', { name: 'All Time' });
    this.thisMonthButton = page.getByRole('button', { name: 'This month' });
    this.thisYearButton = page.getByRole('button', { name: 'This year' });

    // Initialize category section headings
    this.incomeByCategoryHeading = page.getByRole('heading', { name: '💰 Income by Category' });
    this.expensesByCategoryHeading = page.getByRole('heading', { name: '📊 Expenses by Category' });
    this.invoicesByStatusHeading = page.getByRole('heading', { name: '🧾 Invoices by Status' });

    // Initialize recent activity section headings
    this.recentIncomeHeading = page.getByRole('heading', { name: '💰 Recent Income' });
    this.recentExpensesHeading = page.getByRole('heading', { name: '🔄 Recent Expenses' });
    this.recentInvoicesHeading = page.getByRole('heading', { name: '📄 Recent Invoices' });

    // Initialize common form buttons
    this.addIncomeButton = page.getByRole('button', { name: /Add (New )?Income/i });
    this.addExpenseButton = page.getByRole('button', { name: /Add (New )?Expense/i });
    this.createInvoiceButton = page.getByRole('button', { name: /Create (New )?Invoice/i });

    // Initialize common form fields (context-specific, may need refinement in child pages)
    this.amountInput = page.getByRole('spinbutton', { name: /Amount/ });
    this.descriptionInput = page.getByRole('textbox', { name: 'Description' });
    this.dateInput = page.getByRole('textbox', { name: 'Date' });
    this.categoryDropdown = page.getByLabel('Category');

    // Define common regex patterns for dynamic data verification
    this.currencyPattern = /\$[\d,]+\.\d{2}/;
    this.countPattern = /\(\d+\)/;
  }

  /**
   * Navigate to a specific path
   * @param path - The path to navigate to (e.g., '/dashboard', '/incomes')
   */
  async goto(path: string) {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    await this.page.goto(url);
  }

  /**
   * Navigate to Dashboard page
   */
  async gotoDashboard() {
    await this.goto('/dashboard');
  }

  /**
   * Navigate to Income page
   */
  async gotoIncomes() {
    await this.goto('/incomes');
  }

  /**
   * Navigate to Expenses page
   */
  async gotoExpenses() {
    await this.goto('/expenses');
  }

  /**
   * Navigate to Invoices page
   */
  async gotoInvoices() {
    await this.goto('/invoices');
  }

  /**
   * Navigate to Summary page
   */
  async gotoSummary() {
    await this.goto('/summary');
  }

  /**
   * Generate a unique description with timestamp
   * Useful for creating unique test data
   * @param prefix - The prefix for the description
   * @returns A unique description string
   */
  generateUniqueDescription(prefix: string): string {
    return `${prefix} ${Date.now()}`;
  }

  /**
   * Click a time filter button
   * @param filter - The filter to click ('All Time', 'This month', 'This year')
   */
  async clickTimeFilter(filter: 'All Time' | 'This month' | 'This year') {
    switch (filter) {
      case 'All Time':
        await this.allTimeButton.click();
        break;
      case 'This month':
        await this.thisMonthButton.click();
        break;
      case 'This year':
        await this.thisYearButton.click();
        break;
    }
  }

  /**
   * Get a locator for currency amounts matching the pattern $X,XXX.XX
   * @param index - Optional index if multiple currency amounts exist (default: 0)
   * @returns Locator for the currency text
   */
  getCurrencyLocator(index: number = 0): Locator {
    return this.page.locator(`text=${this.currencyPattern}`).nth(index);
  }

  /**
   * Get a locator for count patterns matching (XX)
   * @param index - Optional index if multiple counts exist (default: 0)
   * @returns Locator for the count text
   */
  getCountLocator(index: number = 0): Locator {
    return this.page.locator(`text=${this.countPattern}`).nth(index);
  }

  /**
   * Verify all common metric cards are visible (Total Income, Total Expenses, Net Income, This Month)
   * Used in Dashboard and Summary pages
   */
  async verifyMetricCardsVisible() {
    await this.totalIncomeHeading.waitFor({ state: 'visible' });
    await this.totalExpensesHeading.waitFor({ state: 'visible' });
    await this.netIncomeHeading.waitFor({ state: 'visible' });
    await this.thisMonthHeading.waitFor({ state: 'visible' });
  }

  /**
   * Verify all category breakdown sections are visible
   * Used in Dashboard and Summary pages
   */
  async verifyCategoryBreakdownsVisible() {
    await this.incomeByCategoryHeading.waitFor({ state: 'visible' });
    await this.expensesByCategoryHeading.waitFor({ state: 'visible' });
    await this.invoicesByStatusHeading.waitFor({ state: 'visible' });
  }

  /**
   * Verify all recent activity sections are visible
   * Used in Dashboard and Summary pages
   */
  async verifyRecentActivitySectionsVisible() {
    await this.recentIncomeHeading.waitFor({ state: 'visible' });
    await this.recentExpensesHeading.waitFor({ state: 'visible' });
    await this.recentInvoicesHeading.waitFor({ state: 'visible' });
  }

  /**
   * Verify all time filter buttons are visible
   * Used in Dashboard and Summary pages
   */
  async verifyTimeFiltersVisible() {
    await this.allTimeButton.waitFor({ state: 'visible' });
    await this.thisMonthButton.waitFor({ state: 'visible' });
    await this.thisYearButton.waitFor({ state: 'visible' });
  }

  /**
   * Wait for page to be fully loaded by checking for a specific element
   * @param locator - The locator to wait for
   */
  async waitForPageLoad(locator: Locator) {
    await locator.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Get current date in YYYY-MM-DD format
   * @returns Current date string
   */
  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Get a future date by adding days to current date
   * @param daysToAdd - Number of days to add
   * @returns Future date string in YYYY-MM-DD format
   */
  getFutureDate(daysToAdd: number): string {
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
