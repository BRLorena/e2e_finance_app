/**
 * Centralized test user data
 * Use these predefined users for consistent test data across specs
 */

export const testUsers = {
  valid: {
    email: 'demo@example.com',
    password: 'demo123'
  },
  // Add more test users as needed
} as const;

export type TestUser = typeof testUsers.valid;
