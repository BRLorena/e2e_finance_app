# Playwright Finance App Test Suite

[![Playwright Tests](https://github.com/BRLorena/e2e_finance_app/actions/workflows/playwright.yml/badge.svg)](https://github.com/BRLorena/e2e_finance_app/actions/workflows/playwright.yml)
[![Allure Report](https://img.shields.io/badge/Allure-Report-yellow)](https://brlorena.github.io/e2e_finance_app/)

A comprehensive end-to-end test suite for the Finance App built with Playwright and TypeScript.

## 📊 Live Test Reports

- **🎯 [Allure Test Report](https://brlorena.github.io/e2e_finance_app/)** - Interactive test results with history, trends, and detailed failure analysis
- **🔄 Automated CI/CD** - Tests run on every push, PR, and daily at 9 AM UTC
- **⚡ Parallel Execution** - 4-way test sharding for faster results

## 🎯 Project Overview

This project contains automated tests for a personal finance management application that tracks expenses, income, invoices, and provides dashboard analytics. The tests are built using Playwright's generator and healer agents for interactive test creation and automated debugging.

## 📊 Current Test Progress

### ✅ Completed Test Suites

#### Expenses Management (4/4 tests passing)
- **Add Valid Expense** - Creates expense entries with all required fields
- **Edit Expense Entry** - Modifies existing expense amount and description  
- **Delete Expense Entry** - Removes expense with confirmation dialog
- **Filter Expenses by Category** - Filters expense list by category selection

#### Income Management (4/5 tests passing, 1 skipped)
- **Add Valid Income Entry** ✅ - Creates income entries with validation
- **Add Recurring Income** ✅ - Creates recurring income with frequency settings
- **Edit Income Entry** ⏭️ - *Skipped due to UI button indexing issues with pagination*
- **Delete Income Entry** ✅ - Removes income entries with confirmation
- **Filter Income by Category** ✅ - Category-based income filtering

#### AI Features (22/22 tests passing) 🤖
- **AI Expense Categorization (6 tests)** - Tests Groq AI categorization with predictable inputs
- **AI Natural Language Parsing (3 tests)** - Validates natural language expense parsing
- **AI Financial Insights (5 tests)** - Tests AI-generated insights (alerts, trends, recommendations)
- **AI Multilanguage Support (8 tests)** - Validates AI features in Spanish, Portuguese, and French

### 📋 Pending Test Suites

Based on `TEST_PLAN.md`, the following test suites are planned but not yet implemented:

#### Invoice Management (0/11 tests)
- Create Complete Invoice
- Auto-Generated Invoice Numbers  
- Edit Invoice Details
- Delete Invoice
- Filter by Status (Draft, Sent, Paid, Overdue)
- Search Invoices
- Mark Invoice as Paid
- Send Invoice Reminder
- View Invoice PDF
- Bulk Invoice Actions
- Invoice Templates

#### Dashboard Analytics (0/9 tests)  
- View Dashboard with Data
- Filter by Time Period (Week/Month/Year)
- Verify Income/Expense Calculations
- Recent Activity Display
- Quick Stats Accuracy
- Chart Data Validation
- Export Dashboard Data
- Dashboard Responsiveness
- Real-time Updates

#### Summary Reports (0/3 tests)
- View Complete Summary
- Filter Summary by Time Period  
- Verify Category Breakdowns

#### Additional Test Areas (0/50+ tests)
- Navigation & Routing
- Form Validation
- Error Handling
- Authentication & Security
- Data Persistence
- Performance Testing
- Mobile Responsiveness
- Accessibility Testing

## 🏗️ Test Architecture

### Authentication Setup
```typescript
// tests/auth.setup.ts
// Handles user authentication and session management
// Creates .auth/session.json for test reuse
```

### Test Structure
```
tests/
├── auth.setup.ts                  # Authentication setup
├── seed.spec.ts                   # Test data seeding
├── expenses.spec.ts               # Expense management tests (4/4 ✅)
├── incomes.spec.ts                # Income management tests (4/5 ✅)
├── invoices.spec.ts               # Invoice management tests (9/9 ✅)
├── dashboard.spec.ts              # Dashboard analytics tests (7/7 ✅)
├── summary.spec.ts                # Summary reports tests (3/3 ✅)
├── ai-categorization.spec.ts      # AI categorization tests (6/6 ✅)
├── ai-natural-language.spec.ts    # AI parsing tests (3/3 ✅)
├── ai-insights.spec.ts            # AI insights tests (5/5 ✅)
└── ai-multilanguage.spec.ts       # AI multilanguage tests (8/8 ✅)
```

### Page Object Model
```
pages/
├── base-page.ts                   # Base page with common methods
├── dashboard-page.ts              # Dashboard page object
├── expense-page.ts                # Expense page with AI methods
├── income-page.ts                 # Income page object
├── invoice-page.ts                # Invoice page object
├── summary-page.ts                # Summary page with AI insights
├── components/
│   └── language-selector.ts       # Language switching component
└── index.ts                       # Page object exports
```

### Configuration
- **Base URL**: `https://finance-app-five-rosy.vercel.app`
- **Browser**: Chromium (primary), with setup for cross-browser testing
- **Test Isolation**: Each test creates unique data with timestamps
- **State Management**: Shared authentication state across tests
- **CI Workers**: 4 parallel workers with test sharding
- **Caching**: npm packages and Playwright browsers cached for faster builds

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

The project uses a sophisticated CI/CD pipeline with three jobs:

#### 1. **Test Job** (Sharded Execution)
- Runs on Ubuntu with 4 parallel shards
- Caches node_modules and Playwright browsers
- Each shard runs a subset of tests independently
- Uploads individual test results and reports

#### 2. **Merge Reports Job**
- Combines results from all 4 test shards
- Generates unified Allure report with historical data
- Preserves test history across runs (90-day retention)
- Creates comprehensive test artifacts

#### 3. **Deploy Report Job**
- Deploys to GitHub Pages on successful push to `dev` branch
- Makes Allure report publicly accessible
- Maintains test history and trends

### Workflow Triggers
- ✅ Push to `dev` branch
- ✅ Pull requests to `dev` branch
- ✅ Scheduled daily at 9 AM UTC
- ✅ Manual workflow dispatch

### Performance Optimizations
- **Caching**: Saves 30-60s per run by caching dependencies and browsers
- **Sharding**: 4-way parallel execution reduces test time by ~75%
- **Conditional Deployment**: Only deploys on successful pushes to `dev`

## 🔧 Key Features & Patterns

### Reliable Test Patterns
1. **Page Object Model**: Centralized page interactions with reusable methods and `@step` decorators
2. **Data-Driven Testing**: Parameterized tests using test data arrays for comprehensive coverage
3. **Unique Data Generation**: Uses `Date.now()` timestamps to avoid conflicts
4. **AI Testing**: Groq API integration with predictable test inputs for stable categorization
5. **Multilanguage Support**: Tests across 4 languages (English, Spanish, Portuguese, French)
6. **Pagination Handling**: Simplified assertions to handle dynamic pagination
7. **Dialog Handling**: Automated acceptance of confirmation dialogs
8. **Timing Management**: Strategic waits for form submissions and page loads

### Debugging Capabilities
- **Playwright Generator Agent**: Interactive test creation by recording user actions
- **Playwright Healer Agent**: Automated test debugging and failure resolution
- **Page Snapshots**: YAML accessibility tree captures for debugging
- **Video Recording**: Full test execution recording for failure analysis
- **Allure Report**: Rich test reports with screenshots, videos, and step-by-step execution
- **Historical Trends**: Track test stability and flakiness over time

## 🚀 Getting Started

### Prerequisites
```bash
npm install
npx playwright install
```

### Running Tests
```bash
# Run all tests
npx playwright test

# Run specific test suite
npx playwright test expenses.spec.ts

# AI tests only (using tag)
npx playwright test --grep @ai

# Run with UI mode (recommended for development)
npx playwright test --ui

# Debug specific test
npx playwright test --debug tests/expenses.spec.ts

# Run with specific browser
npx playwright test --project=chromium

# Run tests with sharding (like CI)
npx playwright test --shard=1/4
```

### Viewing Test Reports

#### Local Reports
```bash
# View HTML report
npx playwright show-report

# Generate Allure report locally
npm install -g allure-commandline
allure generate allure-results -o allure-report --clean
allure open allure-report
```

#### CI Reports
- **Live Allure Report**: https://brlorena.github.io/e2e_finance_app/
- **GitHub Actions**: Check workflow runs for detailed logs and artifacts

### Test Development Workflow
1. **Generator Phase**: Use Playwright generator to record new test scenarios
2. **Implementation**: Convert recorded actions to structured test code
3. **Healer Phase**: Run tests and use healer agent to debug failures
4. **Refinement**: Apply fixes and optimize for reliability

## 🐛 Known Issues & Limitations

### Income Management - Edit Test Issue
The "Edit Income Entry" test is marked as `test.fixme()` due to:
- **Problem**: Button indices change dynamically based on pagination state
- **Impact**: nth() selectors become unreliable when page structure varies
- **Workaround**: Test is skipped to maintain suite stability
- **Future Fix**: Requires UI improvements for better element identification

### Pagination Challenges
- **Issue**: New entries may appear on different pages depending on sort order
- **Solution**: Tests verify success via "Total Income/Expense" presence instead of specific entry visibility
- **Trade-off**: Less specific verification but more reliable execution

## 📈 Test Metrics

### Current Status
- **Execution Time**: ~3-4 minutes (with 4-way sharding in CI)
- **Coverage Areas**: 
  - Expenses (100%)
  - Income (80%)
  - Invoices (100%)
  - Dashboard (100%)
  - Summary (100%)
  - AI Features (100%)

### CI/CD Metrics
- ✅ Automated test execution on every push
- ✅ 4-way parallel test sharding
- ✅ ~75% faster execution with sharding
- ✅ Browser and dependency caching (30-60s saved per run)
- ✅ Historical test trends tracked in Allure
- ✅ Public test reports on GitHub Pages
- ✅ Comprehensive error handling and debugging capabilities
- ✅ Clear test documentation with `@step` decoratore object patterns)

### Quality Indicators
- ✅ All passing tests are stable and repeatable
- ✅ Tests are isolated and don't depend on external data
- ✅ Comprehensive error handling and debugging capabilities
- ✅ Clear test documentation and comments
- ⚠️ Limited UI element accessibility (button names, ARIA labels)
Enhance AI Testing** - Add more edge cases and error scenarios
2. **Cross-browser Testing** - Test AI features on Firefox, Safari
3. **Authentication Tests** - Login/logout scenarios

### Medium Priority  
4. **Form Validation Tests** - Input validation and error messages
5. **Navigation Tests** - Route handling and menu navigation
6. **Performance Testing** - Load times, AI response times

### Long-term Goals
7. **Accessibility Testing** - WCAG compliance verification
8. **Mobile Testing** - Responsive design validation
9. **Visual Regression Testing** - Screenshot comparison for UI changes
10. **API Testing** - Direct Groq API integration tests
7. **Cross-browser Testing** - Firefox, Safari, Edge compatibility
8. **Performance Testing** - Load times, responsiveness metrics
9. **Accessibility Testing** - WCAG compliance verification
10. **Mobile Testing** - Responsive design validation

## 🛠️ Development Tools

### Playwright Features Used
- **Test Generator**: `npx playwright codegen` for interactive test creation
- **Test Debugging**: `--debug` flag with step-through execution
- **UI Mode**: `--ui` for visual test management and debugging
- **MCP Playwright Server**: Generator and healer agents for advanced test development

### Code Quality
- **TypeScript**: Full type safety and IDE support
- **ESLint**: Code style and quality enforcement
- **Playwright Best Practices**: Implemented throughout test suite
- **Documentation**: Comprehensive inline comments and README

## 📝 Contributing

### Test Creation Guidelines
1. **Use Page Objects**: Add methods to appropriate page objects with `@step` decorators
2. **Data-Driven Approach**: Use test data arrays for parameterized testing
3. **Unique Identifiers**: Always use timestamps for test data
4. **AI Test Patterns**: Use predictable inputs for stable AI categorization
5. **Simplified Assertions**: Verify success via reliable page elements
6. **Error Handling**: Include proper waits and dialog management
7. **Documentation**: Add clear comments and descriptive step names

### Debugging Process
1. **Healer Agent First**: Let automated debugging attempt fixes
2. **Manual Analysis**: Review page snapshots and video recordings
3. **Pattern Recognition**: Identify UI structure issues vs test logic problems
4. **Incremental Fixes**: Make small changes and retest frequently
