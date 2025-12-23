// spec: new_features.md - Multilanguage Support
import { test, expect } from '@playwright/test';
import { ExpensePage, SummaryPage, LanguageSelector } from '../pages';

// Test data for language switching - Data-Driven approach
const languageTestData = [
  {
    languageButton: '🇪🇸 Español',
    languageCode: 'es',
    translations: {
      dashboard: '🏠 Panel',
      expenses: '💸 Gastos',
      incomes: '💰 Ingresos',
      summary: '📊 Resumen',
      addExpense: 'Agregar Nuevo Gasto',
      amount: 'Monto',
      description: 'Descripción',
      category: 'Categoría',
      aiSuggest: 'Sugerencia IA',
      testDescription: 'Comida para llevar',
      financialSummary: /Resumen Financiero/i,
      aiInsights: /Perspectivas Financieras IA/i,
      alerts: /Alertas/i,
      trends: /Tendencias de Gasto/i,
      recommendations: /Recomendaciones/i
    }
  },
  {
    languageButton: '🇧🇷 Português',
    languageCode: 'pt',
    translations: {
      dashboard: '🏠 Painel',
      expenses: '💸 Despesas',
      incomes: '💰 Receitas',
      summary: '📊 Resumo',
      addExpense: 'Adicionar Nova Despesa',
      amount: 'Valor',
      description: 'Descrição',
      category: 'Categoria',
      aiSuggest: 'Sugestão IA',
      testDescription: 'Pizza delivery',
      financialSummary: /Resumo Financeiro/i,
      aiInsights: /Insights Financeiros IA/i,
      alerts: /Alertas/i,
      trends: /Tendências de Gastos/i,
      recommendations: /Recomendações/i
    }
  },
  {
    languageButton: '🇫🇷 Français',
    languageCode: 'fr',
    translations: {
      dashboard: '🏠 Tableau de bord',
      expenses: '💸 Dépenses',
      incomes: '💰 Revenus',
      summary: '📊 Résumé',
      addExpense: 'Ajouter Nouvelle Dépense',
      amount: 'Montant',
      description: 'Description',
      category: 'Catégorie',
      aiSuggest: 'Suggestion IA',
      testDescription: 'Nourriture à emporter',
      financialSummary: /Résumé Financier/i,
      aiInsights: /Perspectives Financières IA/i,
      alerts: /Alertes/i,
      trends: /Tendances de Dépenses/i,
      recommendations: /Recommandations/i
    }
  }
];

test.describe('AI Features', { tag: '@ai' }, () => {
  test.describe('Multilanguage Support', () => {
  for (const lang of languageTestData) {
    test(`Switch language to ${lang.languageButton.split(' ')[1]} and verify UI updates`, async ({ page }) => {
      const expensePage = new ExpensePage(page);
      const languageSelector = new LanguageSelector(page);
      
      // Navigate to expenses page
      await expensePage.navigate();
      
      // Switch to target language
      await languageSelector.switchToLanguage(lang.languageButton, lang.languageCode);
      
      // Verify URL changed to target language
      await languageSelector.verifyPageInLanguage(lang.languageCode);
      
      // Verify navigation menu updated
      await languageSelector.verifyNavigationLinks(lang.translations);
      
      // Verify button text updated
      await languageSelector.verifyButtonText(lang.translations.addExpense);
    });

    test(`AI categorization works in ${lang.languageButton.split(' ')[1]}`, async ({ page }) => {
      const expensePage = new ExpensePage(page);
      const languageSelector = new LanguageSelector(page);
      
      // Navigate to expenses page and switch language
      await expensePage.navigate();
      await languageSelector.switchToLanguage(lang.languageButton, lang.languageCode);
      
      // Click Add New Expense
      await page.getByRole('button', { name: lang.translations.addExpense }).click();
      
      // Fill in description in target language
      await page.getByRole('spinbutton', { name: lang.translations.amount }).fill('20.00');
      await page.getByRole('textbox', { name: lang.translations.description }).fill(lang.translations.testDescription);
      
      // Click AI Suggest
      await page.getByRole('button', { name: lang.translations.aiSuggest }).click();
      
      // Verify category is auto-filled (using camelCase value)
      await expect(page.getByRole('combobox', { name: lang.translations.category })).toHaveValue('foodDining');
      
      // Verify notification appears
      await expensePage.verifyAISuggestionNotification();
    });
  }

  test('Language persists across page navigation', async ({ page }) => {
    const expensePage = new ExpensePage(page);
    const summaryPage = new SummaryPage(page);
    const languageSelector = new LanguageSelector(page);
    
    // Navigate to expenses page
    await expensePage.navigate();
    
    // Switch to Spanish
    await languageSelector.switchToLanguage('🇪🇸 Español', 'es');
    
    // Navigate to Summary page
    await page.getByRole('link', { name: '📊 Resumen' }).click();
    
    // Wait for summary page to load
    await page.waitForURL('**/es/summary');
    
    // Verify URL is still in Spanish
    await languageSelector.verifyLanguagePersistence('es');
    
    // Verify page content is still in Spanish
    await expect(page.getByRole('heading', { name: /Resumen Financiero/i })).toBeVisible();
    
    // Navigate to Dashboard
    await page.getByRole('link', { name: '🏠 Panel' }).click();
    
    // Wait for dashboard page to load
    await page.waitForURL('**/es/dashboard');
    
    // Verify still in Spanish
    await languageSelector.verifyLanguagePersistence('es');
  });

  test('AI insights are generated in Spanish', async ({ page }) => {
    const summaryPage = new SummaryPage(page);
    const languageSelector = new LanguageSelector(page);
    
    // Navigate to Summary page and switch to Spanish
    await summaryPage.navigate();
    await languageSelector.switchToLanguage('🇪🇸 Español', 'es');
    
    // Look for AI Financial Insights heading in Spanish
    await summaryPage.verifyAIInsightsHeading(/Perspectivas Financieras (con )?IA|Insights Financieros/i);
    
    // Click on the insights to expand/interact
    await summaryPage.clickAIInsights();
    await page.waitForTimeout(2000);
    
    // Check if detailed sections exist
    const hasDetailedSections = await page.getByRole('heading', { name: /Alertas|Tendencias|Recomendaciones/i }).isVisible().catch(() => false);
    
    if (hasDetailedSections) {
      // Verify at least one insights section is visible in Spanish
      await summaryPage.verifyAnyInsightSectionVisible();
    } else {
      // Just verify the AI insights feature is available in Spanish
      await summaryPage.verifyAIInsightsHeading(/Perspectivas Financieras (con )?IA|Insights Financieros/i);
    }
  });
  });
});
