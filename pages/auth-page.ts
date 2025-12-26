import { Page, Locator, expect } from '@playwright/test';
import { step } from '../decorators/test-step';

/**
 * Authentication Page Object
 * Handles all interactions with Login and Registration pages
 */
export class AuthPage {
  readonly page: Page;
  readonly baseUrl: string;

  // Login page locators
  readonly loginWelcomeHeading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly createAccountLink: Locator;

  // Registration page locators
  readonly registerHeading: Locator;
  readonly fullNameInput: Locator;
  readonly registerEmailInput: Locator;
  readonly registerPasswordInput: Locator;
  readonly createAccountButton: Locator;
  readonly signInLink: Locator;
  readonly startFreeButton: Locator;

  // Error and success messages
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = 'https://finance-app-five-rosy.vercel.app';

    // Login page elements
    this.loginWelcomeHeading = page.getByText('Welcome Back');
    this.emailInput = page.getByRole('textbox', { name: 'Email Address' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.createAccountLink = page.getByRole('link', { name: /Create Account|Sign Up/ });

    // Registration page elements
    this.registerHeading = page.getByRole('heading', { name: /Get Started|Create Account|Sign Up/i });
    this.fullNameInput = page.getByRole('textbox', { name: 'Full Name' });
    this.registerEmailInput = page.getByRole('textbox', { name: 'Email Address' });
    this.registerPasswordInput = page.getByRole('textbox', { name: 'Password' });
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
    this.signInLink = page.getByRole('link', { name: /Sign in instead|Sign In|Log In/i });
    this.startFreeButton = page.getByRole('link', { name: '🚀 Start Free Today' });

    // Messages
    this.errorMessage = page.getByText(/invalid|error|wrong/i);
    this.successMessage = page.getByText(/success|created|registered/i);
  }

  @step
  async navigateToLogin() {
    await this.page.goto(`${this.baseUrl}/login`);
    await expect(this.loginWelcomeHeading).toBeVisible({ timeout: 10000 });
  }

  @step
  async navigateToRegister() {
    await this.page.goto(`${this.baseUrl}`);
    await this.startFreeButton.click();
    await expect(this.registerHeading).toBeVisible({ timeout: 10000 });
  }

  @step
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  @step
  async register(fullName: string, email: string, password: string) {
    await this.fullNameInput.fill(fullName);
    await this.registerEmailInput.fill(email);
    await this.registerPasswordInput.fill(password);
    await this.createAccountButton.click();
  }

  @step
  async verifyLoginPageLoaded() {
    await expect(this.loginWelcomeHeading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  @step
  async verifyRegisterPageLoaded() {
    await expect(this.registerHeading).toBeVisible();
    await expect(this.fullNameInput).toBeVisible();
    await expect(this.registerEmailInput).toBeVisible();
    await expect(this.registerPasswordInput).toBeVisible();
    await expect(this.createAccountButton).toBeVisible();
  }

  @step
  async verifyLoginSuccess() {
    // Wait for the dashboard welcome message to appear
    // This is the most reliable indicator that login was successful
    await expect(this.page.getByText(/Welcome back/i)).toBeVisible({ timeout: 30000 });
  }

  @step
  async verifyRegistrationSuccess() {
    // Should redirect to login page after successful registration
    await expect(this.loginWelcomeHeading).toBeVisible({ timeout: 10000 });
  }

  @step
  async verifyErrorMessage() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }

  @step
  async isOnLoginPage(): Promise<boolean> {
    return this.page.url().includes('/login');
  }

  @step
  async hasError(): Promise<boolean> {
    try {
      return await this.errorMessage.isVisible();
    } catch {
      return false;
    }
  }

  @step
  async attemptLogin(email: string, password: string): Promise<boolean> {
    await this.navigateToLogin();
    await this.login(email, password);
    
    // Wait for either navigation to dashboard or error message
    await Promise.race([
      this.page.waitForURL(/.*\/(en|es|pt|fr)\/dashboard/, { timeout: 15000 }).catch(() => {}),
      this.page.waitForSelector('text=/invalid|error|wrong/i', { timeout: 15000 }).catch(() => {}),
      this.page.waitForTimeout(3000)
    ]);

    const loginFailed = await this.isOnLoginPage() || await this.hasError();
    return !loginFailed;
  }

  @step
  async registerNewAccount(fullName: string, email: string, password: string) {
    await this.navigateToRegister();
    await this.register(fullName, email, password);
    
    // Wait a moment to see if there's an error (user exists)
    await this.page.waitForTimeout(1000);
    
    // Check if we got "User with this email already exists" error
    const userExistsError = await this.page.getByText('User with this email already exists').isVisible().catch(() => false);
    
    if (userExistsError) {
      console.log('User already exists, navigating to login...');
      // Click "Sign in instead" link
      await this.page.getByRole('link', { name: /Sign in instead/i }).click();
      return;
    }
    
    await this.verifyRegistrationSuccess();
  }

  @step
  async loginOrRegister(fullName: string, email: string, password: string) {
    // Try to login first
    const loginSuccessful = await this.attemptLogin(email, password);

    if (!loginSuccessful) {
      console.log('Account does not exist, registering new account...');
      await this.registerNewAccount(fullName, email, password);
      
      // Now login with the newly created account
      await this.login(email, password);
    } else {
      console.log('Account already exists, login successful');
    }
    
    // Verify login success for both paths
    await this.verifyLoginSuccess();
  }
}
