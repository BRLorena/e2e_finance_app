// spec: TEST_PLAN.md - User Registration and Authentication
// seed: tests/seed.spec.ts

import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { AuthPage } from '../pages/auth-page';
import { LanguageSelector } from '../pages/components/language-selector';

const authFile = path.join(__dirname, '../.auth/session.json');

// Use consistent test credentials
const TEST_USER = {
  name: 'John Doe',
  email: 'test@example.com',
  password: 'testpassword123'
};

setup.describe('User Registration and Authentication', () => {
  setup('Create Account and Save Auth State', async ({ page, context }) => {
    const authPage = new AuthPage(page);
    
    // Try to login or register if account doesn't exist
    await authPage.loginOrRegister(TEST_USER.name, TEST_USER.email, TEST_USER.password);
    
    // Verify dashboard loaded successfully
    await expect(page.getByText(/Welcome back/i)).toBeVisible({ timeout: 60000 });
    
    // Verify navigation menu is visible
    await expect(page.getByRole('link', { name: '🏠 Dashboard' })).toBeVisible();
    
    // Ensure English is selected as the default language for all tests
    const languageSelector = new LanguageSelector(page);
    const currentLanguageButton = await languageSelector.getCurrentLanguageButton();
    const currentLanguage = await currentLanguageButton.textContent();
    
    // If not already in English, switch to English
    if (!currentLanguage?.includes('English')) {
      console.log('Switching to English language for tests...');
      await languageSelector.switchToLanguage('🇺🇸 English', 'en');
      await expect(page.getByRole('link', { name: '🏠 Dashboard' })).toBeVisible();
    } else {
      console.log('Already in English language');
    }
    
    // Save authentication state to .auth/session.json
    await context.storageState({ path: authFile });
    
    console.log('Authentication state saved successfully');
  });
});
