# Playwright Finance App Test Suite

[![Playwright Tests](https://github.com/BRLorena/e2e_finance_app/actions/workflows/playwright.yml/badge.svg)](https://github.com/BRLorena/e2e_finance_app/actions/workflows/playwright.yml)
[![Allure Report](https://img.shields.io/badge/Allure-Report-yellow)](https://brlorena.github.io/e2e_finance_app/allure/)
[![Jev triage](https://img.shields.io/badge/Jev-failure%20triage-blue)](https://brlorena.github.io/e2e_finance_app/)

A comprehensive end-to-end test suite for the [Finance App](https://github.com/BRLorena/finance_app) built with Playwright and TypeScript, running against the live app on Vercel.

## 📊 Live Test Reports

Published to GitHub Pages on every run of `master` (push, daily schedule, manual):

- **🧪 [Failure triage (Jev)](https://brlorena.github.io/e2e_finance_app/)**: every failure classified as bug / flaky / environment
- **🎯 [Allure report](https://brlorena.github.io/e2e_finance_app/allure/)**: results, history, trends, with failures grouped by Jev's verdict
- **📄 [Playwright HTML report](https://brlorena.github.io/e2e_finance_app/playwright-report/)**: traces, screenshots and videos of the latest run

## 🧪 Failure Triage with Jev

After each run, failed tests are triaged by **Jev**, the System One model from [TypeSafe](https://docs.typesafe.ai) (see also the [jev_test](https://github.com/BRLorena/jev_test) lab project). One request per failure asks three questions:

- **What is the root cause?** `bug`, `flaky` or `environment` (a `choice` with a probability per option and a confidence)
- **Is the defect in the test code rather than the app?** (a yes/no `noul`)
- **Did it fail because the app was too slow?** (a yes/no `noul`)

What Jev sees (`triage/report-parser.ts` → `triage/jev-classifier.ts`):
- error message, stack and every attempt (passed on retry or not)
- the test's source code (comments stripped) and the page's accessibility snapshot at failure
- **the app's API responses with status ≥ 400 during the test**: recorded by an automatic fixture (`fixtures/cleanup-fixture.ts`). A UI timeout often hides a server error; with this evidence, failures caused by an HTTP 500 are classified as `bug` with ~90% confidence instead of looking like slowness
- the test's results in previous runs (history downloaded from GitHub Pages)

The policy lives in our code: low confidence → `needs_review`; `bug` with a high test-defect score → `needs_review`. Verdicts are added to the Allure results as labels and categories (`allurerc.mjs`).

**Configuration** (repository settings → Actions):

| Name | Type | Default | Purpose |
|---|---|---|---|
| `TYPESAFE_API_KEY` | secret | – | Without it, triage runs in fallback mode (`unclassified`) and never breaks the pipeline |
| `TRIAGE_FAIL_ON` | variable | *(empty)* | Verdicts that fail the job, e.g. `bug`. Empty = triage is informational; red tests still fail the job |
| `TRIAGE_CONFIDENCE_THRESHOLD` | variable | `0.6` | Below this confidence a failure becomes `needs_review` |
| `TRIAGE_TEST_DEFECT_THRESHOLD` | variable | `0.7` | `bug` + P(test defect) above this → `needs_review` |

**Locally:**
```bash
npm test                 # run the suite (writes reports/results.json and reports/allure-results)
npm run triage           # classify failures (reads TYPESAFE_API_KEY from .env)
npm run allure           # generate reports/allure-report
npm run allure:open      # open it
```

## 🎯 What is tested

**50 tests in 12 files**, run in three Playwright projects against the [Finance App](https://github.com/BRLorena/finance_app) deployed on Vercel:

| Area | Tests | What they cover |
|---|---|---|
| Setup | 1 | Registers a fresh account and saves the session for every other test |
| Expenses | 4 | Add, edit, delete, filter by category |
| Incomes | 5 | Add, add recurring, edit, delete, filter by category |
| Invoices | 5 | Create, auto-generated number, edit, delete, filter by status |
| Dashboard | 7 | Data, time filters, net income calculation, recent activity, category and status breakdowns |
| Summary | 3 | Full summary, time filters, category breakdowns |
| AI categorization | 5 | Food, shopping and transportation categories, loading state, vague descriptions |
| AI natural language | 3 | "Spent $45.50 on groceries yesterday" and similar inputs fill in the form |
| AI insights | 5 | Insights, top categories, recommendations, refresh, collapse/expand |
| AI multilanguage | 8 | UI in Spanish, Portuguese and French, AI categorization in each, language persistence, insights in Spanish |
| Examples | 4 | `seed` for the Playwright agents and a `test.describe.serial` example |

AI tests carry the `@ai` tag and run in their own `ai-tests` project with longer timeouts. The full test plan, including scenarios not automated yet, is in [`TEST_PLAN.md`](TEST_PLAN.md).

## 🏗️ Project structure

```
tests/
├── auth.setup.ts           # registers a user, saves .auth/session.json
└── specs/                  # one spec per area (see the table above)
src/
├── pages/                  # Page Objects (base, auth, dashboard, expense, income, invoice, summary)
│   └── components/         # language selector
├── actions/                # multi-step flows built on the page objects
├── assertions/             # reusable domain assertions
├── test-data/              # users and transactions
├── utils/                  # API data helpers and test cleanup
└── config/                 # environment and runtime settings
fixtures/cleanup-fixture.ts # automatic cleanup + recording of failed API calls
decorators/test-step.ts     # @step: page object methods show up as steps in reports and traces
triage/                     # Jev failure triage (see above)
```

### Test design
- **Isolated data**: each test creates the data it needs, with unique names, and the `cleanup` fixture deletes it through the app's API afterwards. Cleanup failures don't fail the test; they are added as `cleanup-failed` annotations so leaked data is visible.
- **Evidence for triage**: the `failedRequests` fixture records every app API response with status ≥ 400 and attaches it to failed tests.
- **One shared session**: `auth.setup.ts` logs in once; the `chromium` and `ai-tests` projects reuse the saved state.
- **Readable reports**: page object methods use the `@step` decorator, so the HTML report, traces and Allure show `ExpensePage.addExpense` instead of raw clicks.
- **Stable AI tests**: inputs are chosen so the expected category is unambiguous, and assertions check structure (a category was suggested, insights were rendered) rather than exact AI wording.

## 🚀 CI/CD Pipeline

[`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) runs one job against the deployed app (`BASE_URL` repository variable):

1. **Tests**: `npm test -- --workers=1`. The suite shares one test user, so it doesn't run workers in parallel.
2. **History**: downloads the triage and Allure history published on GitHub Pages.
3. **Triage**: Jev classifies each failure; the verdicts go to the job summary, annotations and Allure.
4. **Reports**: generates the Allure 3 report and a summary table (passed / failed / flaky / skipped).
5. **Publish** (`master` only): Jev triage at `/`, Allure at `/allure/`, Playwright report at `/playwright-report/`, plus the history files for the next run.
6. **Result**: the job fails if tests failed, or if a triage verdict is listed in `TRIAGE_FAIL_ON`.

**Triggers**: push and pull requests to `dev` and `master`, manual runs, and daily at 09:00 UTC. Pull requests get the reports as workflow artifacts instead of publishing them.

**Retries and flaky tests**: CI retries a failed test once (`retries: 1`) to absorb free-tier cold starts (Vercel, Neon). A test that passes only on retry is listed as **flaky** in the job summary and treated as a bug to fix.

**Caching**: npm packages and the Playwright browser are cached. Browsers are installed without `--with-deps`, because the Ubuntu runner already has Chrome's system libraries.

## 🚀 Running locally

Requirements: Node 22.15 or later (CI uses 24).

```bash
npm ci
npx playwright install chromium
```

| Command | What it does |
|---|---|
| `npm test` | Runs the whole suite (local app at `http://localhost:3000` by default) |
| `BASE_URL=https://finance-app-nine-dusky.vercel.app npm test -- --workers=1` | Runs against the deployed app, like CI |
| `npx playwright test --grep @ai` | AI tests only |
| `npx playwright test tests/specs/expenses.spec.ts` | One area |
| `npm run test:ui` / `npm run test:debug` | UI mode / step-through debugging |
| `npm run report` | Opens the Playwright HTML report |
| `npm run triage` | Classifies the failures of the last run (reads `TYPESAFE_API_KEY` from `.env`) |
| `npm run allure` / `npm run allure:open` | Builds / serves the Allure report (run after triage) |

## 🛠️ How the tests were written

The specs were drafted with Playwright's **generator** and **healer** agents (`tests/specs/seed.spec.ts` is the generator's starting point), then reviewed and refactored into page objects, actions and assertions by hand.

## 🐛 Known limitations

- **One shared test user**: tests run with one worker. Parallel runs would need one account per worker.
- **Pagination**: a new entry can land on another page of the list, so some tests confirm success through totals or messages instead of finding the row.
- **AI features depend on Groq's free tier**: rate limits or slow responses show up as failures, which triage usually classifies as `environment` or `flaky`.

## 📈 Next steps

- API tests for `/api/*` with contract validation against the app's Zod schemas
- Authorization tests: one user must not read or change another user's data
- Accessibility (axe) and visual regression checks across the four languages
- Evaluation of the AI features with a reference dataset, and LLM mocking for deterministic E2E runs
