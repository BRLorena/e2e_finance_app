// spec: TEST_PLAN.md - User Registration and Authentication
// seed: tests/seed.spec.ts

import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/session.json');

setup.describe('User Registration and Authentication', () => {
  setup('Successful User Registration', async ({ page }) => {
    // 1. Navigate to the application homepage
    await page.goto('https://finance-app-five-rosy.vercel.app');

    // 2. Click on "🚀 Start Free Today" button
    await page.getByRole('link', { name: '🚀 Start Free Today' }).click();

    // Generate unique email using timestamp
    const uniqueEmail = `john.doe+${Date.now()}@example.com`;

    // 3. Enter "John Doe" in the "Full Name" field
    await page.getByRole('textbox', { name: 'Full Name' }).fill('John Doe');

    // 4. Enter unique email in the "Email Address" field
    await page.getByRole('textbox', { name: 'Email Address' }).fill(uniqueEmail);

    // 5. Enter "SecurePass123!" in the "Password" field
    await page.getByRole('textbox', { name: 'Password' }).fill('SecurePass123!');

    // 6. Click "Create Account" button
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Verify user is redirected to login page
    await expect(page.getByText('Welcome Back')).toBeVisible();
  });

  setup('Successful User Login and Save Auth State', async ({ page, context }) => {
    // 1. Navigate to login page
    await page.goto('https://finance-app-five-rosy.vercel.app/login');

    // 2. Enter "test@example.com" in Email Address field
    await page.getByRole('textbox', { name: 'Email Address' }).fill('test@example.com');

    // 3. Enter "testpassword123" in Password field
    await page.getByRole('textbox', { name: 'Password' }).fill('testpassword123');

    // 4. Click "Sign In" button
    await page.getByRole('button', { name: 'Sign In' }).click();

    // 5. Wait for dashboard to load and verify
    await expect(page.getByText('Welcome back, John Doe!')).toBeVisible();

    // Verify navigation menu is visible
    await expect(page.getByRole('link', { name: '🏠 Dashboard' })).toBeVisible();

    // Save authentication state to .auth/session.json
    await context.storageState({ path: authFile });
  });
});
