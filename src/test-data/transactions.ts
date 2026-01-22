/**
 * Centralized test data for transactions (expenses, incomes, invoices)
 * Use these for consistent test inputs across specs
 */

export const testExpenses = {
  food: {
    amount: '75.50',
    category: 'Food & Dining',
    baseDescription: 'Coffee and breakfast'
  },
  transport: {
    amount: '45.00',
    category: 'Transportation',
    baseDescription: 'Taxi ride'
  },
  utilities: {
    amount: '120.00',
    category: 'Utilities',
    baseDescription: 'Internet bill'
  }
} as const;

export const testIncomes = {
  salary: {
    amount: '3500',
    category: 'Salary',
    baseDescription: 'November salary payment',
    date: '2025-11-20'
  },
  freelance: {
    amount: '2000',
    category: 'Freelance',
    baseDescription: 'Monthly retainer client',
    date: '2025-11-01',
    recurring: true,
    frequency: 'Monthly'
  },
  investment: {
    amount: '500',
    category: 'Investment',
    baseDescription: 'Stock dividend',
    date: '2025-11-15'
  }
} as const;

export const testInvoices = {
  standard: {
    clientName: 'ABC Corporation',
    amount: '1500',
    dueDate: '2025-12-31',
    baseDescription: 'Web development services'
  },
  urgent: {
    clientName: 'XYZ Ltd',
    amount: '2500',
    dueDate: '2025-11-30',
    baseDescription: 'Urgent consulting project'
  }
} as const;

export type TestExpense = typeof testExpenses.food;
export type TestIncome = typeof testIncomes.salary;
export type TestInvoice = typeof testInvoices.standard;
