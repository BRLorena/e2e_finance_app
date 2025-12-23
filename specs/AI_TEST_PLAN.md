# E2E Test Scope - AI Features (Groq Integration)

## Overview
The finance app has been migrated from Ollama to **Groq API** (free tier) for AI-powered features. All AI functionality uses the `llama-3.3-70b-versatile` model.

---

## 🤖 AI Features to Test

### 1. AI Expense Categorization
**Endpoint:** `POST /api/ai/categorize`

**User Flow:**
- User enters expense description (e.g., "Pizza delivery")
- Clicks "AI Suggest" button next to category field
- System auto-fills category dropdown with suggested category

**Test Cases:**
- ✅ Categorizes food-related expenses → "Food & Dining"
- ✅ Categorizes transportation → "Transportation"
- ✅ Categorizes shopping → "Shopping"
- ✅ Shows loading state during AI processing
- ✅ Handles network errors gracefully (shows fallback/error message)
- ✅ Works with vague descriptions (e.g., "stuff from store")
- 🌍 Works in Spanish, Portuguese, French (multilanguage)

**Multilanguage Scenarios:**
- Description: "Comida para llevar" (Spanish) → Should categorize to Food
- Description: "Viagem de táxi" (Portuguese) → Should categorize to Transportation
- Description: "Achats en ligne" (French) → Should categorize to Shopping

---

### 2. Natural Language Expense Parsing
**Endpoint:** `POST /api/ai/parse-expense`

**User Flow:**
- User clicks "Quick Add" button
- Enters natural language text: "Spent $45.50 on groceries yesterday"
- System parses and auto-fills form fields (amount, description, category, date)

**Test Cases:**
- ✅ Parses amount correctly from various formats ($45, 45.50, forty-five dollars)
- ✅ Extracts description (groceries, lunch, gas, etc.)
- ✅ Suggests appropriate category
- ✅ Parses relative dates ("yesterday", "last Monday", "3 days ago")
- ✅ Handles incomplete input (e.g., no date provided)
- ✅ Shows parsing errors for invalid input
- 🌍 Parses multilanguage input correctly

**Multilanguage Scenarios:**
- Spanish: "Gasté 30 euros en transporte ayer" → amount: 30, category: Transportation, date: yesterday
- Portuguese: "Comprei comida por 50 reais ontem" → amount: 50, category: Food, date: yesterday  
- French: "J'ai dépensé 25€ pour le cinéma hier" → amount: 25, category: Entertainment, date: yesterday

**Edge Cases:**
- Ambiguous text: "bought something for 20"
- Multiple amounts in text: "spent $10 and $15"
- Future dates: "will spend $50 tomorrow"

---

### 3. AI Financial Insights
**Endpoint:** `POST /api/ai/insights`

**User Flow:**
- User navigates to Summary/Dashboard page
- System displays AI-generated insights based on spending data
- Shows: summary, trends, recommendations, alerts

**Test Cases:**
- ✅ Generates insights with valid expense data
- ✅ Shows personalized recommendations
- ✅ Identifies spending trends (increasing/decreasing)
- ✅ Highlights top spending categories
- ✅ Shows alerts for unusual spending
- ✅ Handles edge cases (no data, single expense)
- 🌍 Insights generated in user's selected language

**Multilanguage Scenarios:**
- Switch to Spanish → Insights should be in Spanish
- Switch to Portuguese → Insights should be in Portuguese
- Switch to French → Insights should be in French

**Data Scenarios:**
- No expenses → Should show "No data available" message
- High spending month → Should show alert/warning
- Consistent spending → Should show positive feedback

---

## 🌍 Multilanguage Testing (Cross-cutting)

### Language Switching Flow
**Test Cases:**
- ✅ Switch language using language selector dropdown
- ✅ All UI text updates (buttons, labels, headings)
- ✅ Form validation messages appear in selected language
- ✅ AI features use selected language for prompts/responses
- ✅ Language persists across page navigation
- ✅ Language persists after logout/login

**Supported Languages:**
- 🇺🇸 English (en)
- 🇪🇸 Spanish (es)
- 🇵🇹 Portuguese (pt)
- 🇫🇷 French (fr)

---

## ⚙️ Technical Requirements

### API Configuration
- **Base URL:** `/api/ai/*`
- **Authentication:** Required (session-based via NextAuth)
- **Rate Limiting:** 30 requests/minute (Groq free tier)
- **Timeout:** 30 seconds max per AI request

### Environment Variables (Production)
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
GROQ_MODEL=llama-3.3-70b-versatile
```

### Error Handling to Test
- ✅ Missing API key → Show error message
- ✅ Rate limit exceeded → Show "Too many requests" message
- ✅ Network timeout → Show timeout error
- ✅ Invalid AI response → Fallback to default behavior
- ✅ Unauthenticated user → Redirect to login

---

## 🎯 Priority Test Scenarios

### High Priority (Must Test)
1. ✅ AI categorization works for common expenses
2. ✅ Natural language parsing extracts basic expense data
3. ✅ Financial insights display on dashboard
4. ✅ Error handling for failed AI requests
5. ✅ Multilanguage support for English and Spanish

### Medium Priority
6. ✅ Edge cases (vague descriptions, ambiguous text)
7. ✅ Loading states and transitions
8. ✅ Multilanguage: Portuguese and French
9. ✅ Rate limiting behavior

### Low Priority
10. ✅ Performance testing (AI response time < 5s)
11. ✅ Accessibility (screen readers announce AI suggestions)
12. ✅ Mobile responsiveness of AI features

---

## 📊 Test Data Setup

### Sample Expenses for Insights Testing
```javascript
// Month 1 (November)
{ amount: 50, category: 'Food & Dining', date: '2024-11-05' }
{ amount: 30, category: 'Transportation', date: '2024-11-10' }
{ amount: 100, category: 'Shopping', date: '2024-11-15' }

// Month 2 (December) - Higher spending
{ amount: 80, category: 'Food & Dining', date: '2024-12-05' }
{ amount: 45, category: 'Transportation', date: '2024-12-10' }
{ amount: 200, category: 'Shopping', date: '2024-12-15' }
```

Expected Insight: "Your spending increased by 81% this month. Shopping is your top category."

---

## 🔍 Regression Testing

### Existing Features to Verify Still Work
- ✅ Manual expense creation (without AI)
- ✅ Manual category selection
- ✅ Date picker functionality
- ✅ Form validation (required fields)
- ✅ Expense list/table display
- ✅ Edit/delete expense functionality
- ✅ User authentication flow

---

## 🚀 Performance Benchmarks

- AI Categorization: < 3 seconds response time
- Natural Language Parsing: < 4 seconds response time
- Financial Insights: < 5 seconds response time
- Page load with AI features: < 2 seconds (initial load)

---

## 📝 Notes for E2E Implementation

### Recommended Tools
- **Playwright** or **Cypress** for E2E automation
- **MSW (Mock Service Worker)** for mocking Groq API in tests
- **i18n-testing-library** for multilanguage assertions

### Mocking Strategy
For E2E tests, consider mocking Groq API responses to:
- Avoid rate limits during test runs
- Ensure deterministic test results
- Speed up test execution

### CI/CD Considerations
- Run E2E tests with mocked AI responses in CI
- Run real AI integration tests nightly (separate from PR checks)
- Set GROQ_API_KEY in CI environment variables

---

## ✅ Acceptance Criteria

All AI features pass E2E tests when:
1. User can get AI category suggestions in all 4 languages
2. Natural language parsing accurately extracts expense data 90%+ of the time
3. Financial insights generate successfully with realistic data
4. Error states display user-friendly messages
5. Features work on desktop and mobile viewports
6. Multilanguage switching updates AI features correctly

---

**Last Updated:** December 20, 2025  
**Migration:** Ollama → Groq API (llama-3.3-70b-versatile)  
**Status:** Ready for E2E test implementation
