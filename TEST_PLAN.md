# Test Plan: Finance App

**URL:** https://finance-app-five-rosy.vercel.app  
**Date:** 11 April 2026  
**Credentials:** `test@example.com` / `testpassword123`

---

## Areas Discovered

| Page | Key Features |
|------|-------------|
| Landing (`/`) | Hero section, feature cards, Sign In / Register links |
| Auth (`/login`, `/register`) | Email/password login, registration, back to home |
| Dashboard (`/dashboard`) | Welcome banner, KPI cards, time filters, Category Breakdown, Recent Activities, Sign Out |
| Expenses (`/expenses`) | List with search/filter, Add/Edit/Delete, AI Suggest for category, Quick Add |
| Incomes (`/incomes`) | Same pattern as expenses but for income records |
| Invoices (`/invoices`) | Create form + list; statuses: Pending/Paid/Overdue/Cancelled; Edit/Delete |
| Summary (`/summary`) | Aggregate KPIs, time filters, Category Breakdown, AI Financial Insights |
| Nav | Language selector (🇺🇸 English + others) |

---

## Test Scenarios

### 1. Authentication

| ID | Scenario | Expected Result |
|----|----------|----------------|
| TC-AUTH-01 | Unauthenticated user visits `/dashboard` | Redirected to `/login` |
| TC-AUTH-02 | Login with valid credentials (`test@example.com` / `testpassword123`) | Navigates to `/dashboard`, shows "Welcome back, John Doe!" |
| TC-AUTH-03 | Login with wrong password | Error message is displayed |
| TC-AUTH-04 | Register with a new email | Account created, user reaches `/dashboard` |
| TC-AUTH-05 | Click "Sign Out" on dashboard | User is returned to landing or login page |

---

### 2. Dashboard

| ID | Scenario | Expected Result |
|----|----------|----------------|
| TC-DASH-01 | Dashboard loads after login | KPI cards visible: Total Income, Total Expenses, Net Income, This Month |
| TC-DASH-02 | Click "This Month" filter | KPI values update to current month data |
| TC-DASH-03 | Click "This Year" filter | KPI values update to current year data |
| TC-DASH-04 | Click "Category Breakdown" card | Card expands and shows breakdown |
| TC-DASH-05 | Click "Recent Activities" card | Card expands and shows recent transactions |

---

### 3. Expenses

| ID | Scenario | Expected Result |
|----|----------|----------------|
| TC-EXP-01 | Load Expenses page | List displays with amount, category, and date per entry |
| TC-EXP-02 | Click "Add New Expense" | Add expense form opens |
| TC-EXP-03 | Create expense (Amount, Date, Description, Category) | Expense appears in list after submit |
| TC-EXP-04 | Edit an existing expense | Updated values reflected in the list |
| TC-EXP-05 | Delete an expense | Expense removed from list |
| TC-EXP-06 | Search by keyword | Expense list filters to matching results |
| TC-EXP-07 | Filter by Category (e.g., "Food & Dining") | Only matching category expenses shown |
| TC-EXP-08 | Filter by date range | Only expenses within range are shown |
| TC-EXP-09 | Submit form without required fields | Validation errors shown |
| TC-EXP-10 | Enter description, then click "AI Suggest" | Button becomes enabled and a category is suggested |

---

### 4. Incomes

| ID | Scenario | Expected Result |
|----|----------|----------------|
| TC-INC-01 | Load Incomes page | Income list is displayed |
| TC-INC-02 | Add new income with all fields | Income appears in list after submit |
| TC-INC-03 | Edit an income | Updated values reflected in the list |
| TC-INC-04 | Delete an income | Income removed from list |
| TC-INC-05 | Search and filter by category / date range | List filters correctly |

---

### 5. Invoices

| ID | Scenario | Expected Result |
|----|----------|----------------|
| TC-INV-01 | Load Invoices page | List displays invoices with status badges (Pending, Paid, Overdue, Cancelled) |
| TC-INV-02 | Create invoice with all required fields | Invoice appears in list after submit |
| TC-INV-03 | Check auto-generated Invoice Number | Invoice Number field is pre-populated |
| TC-INV-04 | Create invoice with status "Paid" | Badge shows ✅ Paid |
| TC-INV-05 | Edit invoice (description / amount / status) | List reflects update |
| TC-INV-06 | Delete invoice | Invoice removed from list |
| TC-INV-07 | Filter by status "Pending" | Only pending invoices shown |
| TC-INV-08 | Search by client name or invoice number | List filters to matching results |
| TC-INV-09 | Submit form without required fields (Client Name, Amount, Description, Due Date) | Validation errors shown |

---

### 6. Summary

| ID | Scenario | Expected Result |
|----|----------|----------------|
| TC-SUM-01 | Load Summary page | KPIs match dashboard: Total Income, Total Expenses, Net Income, This Month |
| TC-SUM-02 | Click time filters (All Time / This Month / This Year) | Summary values update accordingly |
| TC-SUM-03 | Click "Category Breakdown" card | Card expands and shows breakdown |
| TC-SUM-04 | Click "AI Financial Insights" card | AI-generated analysis is displayed |

---

### 7. Language Selector

| ID | Scenario | Expected Result |
|----|----------|----------------|
| TC-LANG-01 | Language selector button shown in nav | Displays current language (🇺🇸 English) |
| TC-LANG-02 | Switch to a different language | Nav labels and page text update to selected language |
| TC-LANG-03 | Switch back to English | English UI is fully restored |
