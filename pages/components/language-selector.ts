import { Page, Locator, expect } from '@playwright/test';
import { step } from '../../decorators/test-step';

/**
 * Language Selector Component
 * Handles language switching and verification across all pages
 */
export class LanguageSelector {
  readonly page: Page;
  readonly languageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.languageButton = page.getByRole('button', { name: /🇺🇸 English|🇪🇸 Español|🇧🇷 Português|🇫🇷 Français/ });
  }

  @step
  async getCurrentLanguageButton() {
    return this.languageButton;
  }

  @step
  async clickLanguageButton() {
    await this.languageButton.click();
  }

  @step
  async selectLanguage(languageName: string) {
    await this.clickLanguageButton();
    await this.page.getByRole('button', { name: languageName }).click();
  }

  @step
  async verifyCurrentLanguage(languageName: string) {
    await expect(this.languageButton).toHaveText(new RegExp(languageName));
  }

  @step
  async waitForLanguageChange(languageCode: string) {
    await this.page.waitForURL(`**/${languageCode}/**`);
  }

  @step
  async switchToLanguage(languageName: string, languageCode: string) {
    await this.selectLanguage(languageName);
    await this.waitForLanguageChange(languageCode);
  }

  @step
  async verifyNavigationLink(linkName: string) {
    await expect(this.page.getByRole('link', { name: linkName })).toBeVisible();
  }

  @step
  async verifyNavigationLinks(translations: { dashboard: string; expenses: string; incomes: string; summary: string }) {
    await this.verifyNavigationLink(translations.dashboard);
    await this.verifyNavigationLink(translations.expenses);
    await this.verifyNavigationLink(translations.incomes);
    await this.verifyNavigationLink(translations.summary);
  }

  @step
  async verifyButtonText(buttonText: string) {
    await expect(this.page.getByRole('button', { name: buttonText })).toBeVisible();
  }

  @step
  async verifyLanguagePersistence(languageCode: string) {
    // Navigate to different page and verify language persists
    const currentUrl = this.page.url();
    expect(currentUrl).toContain(`/${languageCode}/`);
  }

  @step
  async verifyPageInLanguage(languageCode: string) {
    await this.page.waitForURL(`**/${languageCode}/**`);
    expect(this.page.url()).toContain(`/${languageCode}/`);
  }
}
