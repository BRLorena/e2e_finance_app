# Finance App - Comprehensive Test Plan

## Application Overview

The Finance App is a comprehensive financial management platform that enables users to track expenses, manage income, create invoices, and visualize financial data. The application features:

- **User Authentication**: Registration and login functionality with session management
- **Expense Management**: Track daily spending with categories, dates, and descriptions
- **Income Management**: Record income sources with categorization and recurring income options
- **Invoice Management**: Create, track, and manage professional invoices with client details and payment status
- **Dashboard**: Real-time overview of financial metrics with time-based filtering (All Time, This Month, This Year)
- **Summary View**: Comprehensive financial breakdown with category-wise analysis
- **Filtering & Search**: Advanced filtering by category, date range, and search terms
- **Navigation**: Persistent navigation menu across all authenticated pages

## Test Scenarios

---

### 1. User Registration and Authentication

#### 1.1 Successful User Registration
**Prerequisites:** Application is accessible at https://finance-app-five-rosy.vercel.app

**Steps:**
1. Navigate to the application homepage
2. Click on "🚀 Start Free Today" button
3. Enter "John Doe" in the "Full Name" field
4. Enter "john.doe@example.com" in the "Email Address" field
5. Enter "SecurePass123!" in the "Password" field
6. Click "Create Account" button

**Expected Results:**
- User is redirected to login page with success message
- Success notification displays "Account created successfully"
- Login form is pre-populated with email or ready for login

#### 1.2 Register with Empty Fields
**Steps:**
1. Navigate to registration page (/register)
2. Click "Create Account" button without entering any data

**Expected Results:**
- Form validation prevents submission
- Error messages appear for required fields (Full Name, Email, Password)
- User remains on registration page

#### 1.3 Register with Invalid Email Format
**Steps:**
1. Navigate to registration page
2. Enter "John Doe" in Full Name
3. Enter "invalidemail" (without @ symbol) in Email Address
4. Enter "password123" in Password
5. Click "Create Account"

**Expected Results:**
- Email field shows validation error
- Error message indicates invalid email format
- Form submission is prevented

#### 1.4 Successful User Login
**Prerequisites:** User account exists (test@example.com / testpassword123)

**Steps:**
1. Navigate to login page (/login)
2. Enter "test@example.com" in Email Address field
3. Enter "testpassword123" in Password field
4. Click "Sign In" button

**Expected Results:**
- Button changes to "⏳ Signing in..." with disabled state
- User is redirected to dashboard (/dashboard)
- Welcome message displays: "Welcome back, [User Name]!"
- Navigation menu becomes visible with all sections

#### 1.5 Login with Incorrect Credentials
**Steps:**
1. Navigate to login page
2. Enter "wrong@email.com" in Email Address
3. Enter "wrongpassword" in Password
4. Click "Sign In"

**Expected Results:**
- Error notification appears
- User remains on login page
- Form fields are cleared or retain entered values for correction

#### 1.6 Navigate Between Login and Registration
**Steps:**
1. Navigate to login page
2. Click "Create one now" link
3. Verify registration page loads
4. Click "Sign in instead" link
5. Verify login page loads

**Expected Results:**
- Navigation between pages is seamless
- No data loss during navigation
- Correct page titles and forms display

#### 1.7 User Logout
**Prerequisites:** User is logged in

**Steps:**
1. From any authenticated page (Dashboard, Expenses, etc.)
2. Click "👋 Sign Out" button in the header

**Expected Results:**
- User is redirected to homepage or login page
- Session is cleared
- Attempting to navigate to protected pages redirects to login
- Navigation menu is no longer visible

---

### 2. Expense Management

#### 2.1 Add Valid Expense
**Prerequisites:** User is logged in

**Steps:**
1. Navigate to Expenses page (/expenses)
2. Click "Add Expense" button
3. Enter "75.50" in Amount field
4. Keep default date (current date: 2025-11-18)
5. Enter "Coffee and breakfast" in Description field
6. Select "Food & Dining" from Category dropdown
7. Click "Add Expense" button

**Expected Results:**
- Success notification: "Expense created successfully!"
- Form closes and returns to expense list view
- New expense appears in the expense list
- Expense card shows:
  - Title: "Coffee and breakfast"
  - Amount: "$75.50"
  - Category: "Food & Dining"
  - Date: "18/11/2025"
- Total Expenses updates to include new amount
- Count increases by 1
- Edit and Delete buttons are visible on the expense card

#### 2.2 Add Expense with Minimum Required Fields
**Steps:**
1. Click "Add Expense" button
2. Enter "25.00" in Amount field
3. Select "Other" from Category dropdown
4. Leave Description empty
5. Click "Add Expense"

**Expected Results:**
- If Description is required: validation error appears
- If Description is optional: expense is created successfully with empty description
- Expense is saved with default date

#### 2.3 Add Expense with Zero or Negative Amount
**Steps:**
1. Click "Add Expense"
2. Enter "0" in Amount field
3. Enter "Test" in Description
4. Select a category
5. Click "Add Expense"

**Expected Results:**
- Validation error appears
- Error message indicates amount must be greater than zero
- Form submission is prevented

**Repeat with:**
- Amount: "-50"
- Expected: Same validation error

#### 2.4 Add Expense with Future Date
**Steps:**
1. Click "Add Expense"
2. Enter "100" in Amount
3. Enter "Planned purchase" in Description
4. Select "Shopping" category
5. Enter future date (e.g., "2025-12-25") in Date field
6. Click "Add Expense"

**Expected Results:**
- Expense is created successfully (or validation prevents future dates)
- If allowed, expense appears in list with future date
- Verify if future date affects dashboard calculations

#### 2.5 Add Expense with All Categories
**Steps:**
1. For each available category, create an expense:
   - Food & Dining: $50
   - Transportation: $30
   - Shopping: $100
   - Entertainment: $45
   - Bills & Utilities: $150
   - Healthcare: $80
   - Travel: $500
   - Education: $200
   - Business: $300
   - Other: $25

**Expected Results:**
- All expenses are created successfully
- Each category is properly displayed
- Total Expenses reflects sum of all entries
- Count shows correct number of expenses

#### 2.6 Edit Existing Expense
**Prerequisites:** At least one expense exists

**Steps:**
1. Navigate to Expenses page
2. Locate an expense in the list
3. Click the Edit button (pencil icon)
4. Modify Amount to "125.75"
5. Change Description to "Updated lunch expense"
6. Change Category to "Entertainment"
7. Click "Update Expense" button

**Expected Results:**
- Success notification appears
- Form closes and returns to list view
- Updated expense shows new values:
  - Amount: "$125.75"
  - Description: "Updated lunch expense"
  - Category: "Entertainment"
- Total Expenses recalculates correctly
- Date remains unchanged if not modified

#### 2.7 Cancel Edit Expense
**Steps:**
1. Click Edit button on an expense
2. Modify any fields (Amount, Description, Category)
3. Click "Cancel" button

**Expected Results:**
- Edit form closes
- Returns to expense list view
- No changes are saved
- Original expense data remains unchanged

#### 2.8 Delete Expense
**Prerequisites:** At least one expense exists

**Steps:**
1. Navigate to Expenses page
2. Note the current Total Expenses and Count
3. Locate an expense with amount $50.75
4. Click the Delete button (trash icon)
5. Confirm deletion if prompt appears

**Expected Results:**
- Confirmation dialog may appear
- After confirmation, expense is removed from list
- Success notification may appear
- Total Expenses decreases by $50.75
- Count decreases by 1
- Deleted expense no longer appears in any view

#### 2.9 Search Expenses
**Prerequisites:** Multiple expenses exist with different descriptions

**Steps:**
1. Navigate to Expenses page
2. Locate the Search textbox
3. Enter "lunch" in Search field
4. Observe filtered results

**Expected Results:**
- Only expenses containing "lunch" in description are displayed
- Total Expenses shows sum of filtered results
- Count shows number of filtered expenses
- Clearing search returns all expenses

#### 2.10 Filter Expenses by Category
**Steps:**
1. Navigate to Expenses page
2. Select "Food & Dining" from Category dropdown
3. Observe filtered results

**Expected Results:**
- Only expenses in "Food & Dining" category are displayed
- Total Expenses shows sum of filtered category
- Count shows number of expenses in category
- Other categories are hidden

**Repeat for each category:**
- All Categories: Shows all expenses
- Each individual category: Shows only that category

#### 2.11 Filter Expenses by Date Range
**Prerequisites:** Expenses exist with different dates

**Steps:**
1. Navigate to Expenses page
2. Enter "2025-11-01" in "From Date" field
3. Enter "2025-11-30" in "To Date" field
4. Observe filtered results

**Expected Results:**
- Only expenses within date range are displayed
- Total and Count reflect filtered results
- Expenses outside date range are hidden

#### 2.12 Combine Multiple Filters
**Steps:**
1. Enter "restaurant" in Search field
2. Select "Food & Dining" from Category
3. Set date range for current month
4. Observe results

**Expected Results:**
- Results match ALL filter criteria (AND logic)
- Total and Count are accurate for combined filters
- Removing any filter updates results accordingly

#### 2.13 View Empty Expenses List
**Prerequisites:** No expenses exist for the user

**Steps:**
1. Navigate to Expenses page
2. Observe the page content

**Expected Results:**
- Empty state message displays: "No expenses found"
- Subtitle: "Start by adding your first expense"
- Total Expenses shows "$0.00"
- Count shows "0"
- Add Expense button is prominently displayed
- Filters section is still visible

---

### 3. Income Management

#### 3.1 Add Valid Income Entry
**Prerequisites:** User is logged in

**Steps:**
1. Navigate to Income page (/incomes)
2. Click "Add Income" button
3. Enter "3500" in Amount field
4. Select "Salary" from Category dropdown
5. Enter "November salary payment" in Description
6. Keep default date or select current date
7. Leave "This is recurring income" checkbox unchecked
8. Click "Add Income" button

**Expected Results:**
- Success notification appears
- Form closes and returns to income list
- New income entry appears in the list
- Income card displays:
  - Description: "November salary payment"
  - Amount: "$3,500.00"
  - Category: "Salary"
  - Date displayed correctly
- Total Income updates to $3,500.00
- Count shows 1

#### 3.2 Add Recurring Income
**Steps:**
1. Click "Add Income"
2. Enter "2000" in Amount
3. Select "Freelance" category
4. Enter "Monthly retainer client" in Description
5. Set date to first of month
6. Check the "This is recurring income" checkbox
7. Click "Add Income"

**Expected Results:**
- Income is created with recurring flag
- Visual indicator for recurring income (if implemented)
- Recurring income is tracked separately or marked in list

#### 3.3 Add Income with All Categories
**Steps:**
1. Create income entries for each category:
   - Salary: $5,000
   - Freelance: $1,500
   - Business: $3,000
   - Investment: $500
   - Rental: $1,200
   - Other: $250

**Expected Results:**
- All income entries are created successfully
- Each category is properly displayed
- Total Income reflects sum: $11,450.00
- Count shows 6 entries

#### 3.4 Edit Income Entry
**Prerequisites:** At least one income entry exists

**Steps:**
1. Navigate to Income page
2. Locate an income entry
3. Click Edit button
4. Change Amount to "4000"
5. Change Description to "November salary - adjusted"
6. Click "Update Income"

**Expected Results:**
- Income entry is updated successfully
- New values are displayed
- Total Income recalculates correctly

#### 3.5 Delete Income Entry
**Steps:**
1. Note current Total Income
2. Click Delete button on an income entry worth $3,500
3. Confirm deletion if prompted

**Expected Results:**
- Income entry is removed from list
- Total Income decreases by $3,500
- Count decreases by 1

#### 3.6 Filter Income by Category
**Steps:**
1. Navigate to Income page
2. Select "Salary" from Category dropdown

**Expected Results:**
- Only salary income entries are displayed
- Total Income shows sum of salary entries only
- Other categories are hidden

#### 3.7 Search Income Entries
**Steps:**
1. Enter "freelance" in Search field
2. Observe results

**Expected Results:**
- Only income entries with "freelance" in description or category are shown
- Total and Count reflect filtered results

#### 3.8 Filter Income by Date Range
**Steps:**
1. Set From Date to "2025-11-01"
2. Set To Date to "2025-11-30"
3. Observe filtered results

**Expected Results:**
- Only income within November 2025 is displayed
- Totals reflect filtered date range

#### 3.9 Cancel Add Income
**Steps:**
1. Click "Add Income"
2. Fill in all fields
3. Click "Cancel" button

**Expected Results:**
- Form closes without saving
- No new income entry is created
- Returns to income list view

#### 3.10 Add Income with Missing Required Fields
**Steps:**
1. Click "Add Income"
2. Leave Amount empty
3. Select category
4. Click "Add Income"

**Expected Results:**
- Validation error for required Amount field
- Form submission is prevented

**Repeat with:**
- Missing Category: Should show validation error
- Missing Description: Verify if required

---

### 4. Invoice Management

#### 4.1 Create Complete Invoice
**Prerequisites:** User is logged in

**Steps:**
1. Navigate to Invoices page (/invoices)
2. Enter "INV-2025-001" in Invoice Number field
3. Enter "Tech Solutions Ltd" in Client Name field
4. Enter "billing@techsolutions.com" in Client Email field
5. Enter "2500" in Amount field
6. Enter "Website redesign and development" in Description field
7. Keep default Issue Date (2025-11-18)
8. Enter "2025-12-18" in Due Date field
9. Select "Pending" from Status dropdown
10. Enter "Net 30 payment terms apply" in Notes field
11. Click "Create Invoice" button

**Expected Results:**
- Success notification: "Invoice created successfully!"
- Form clears and returns to invoice list view
- New invoice card appears with:
  - Invoice Number: "INV-2025-001"
  - Client: "Tech Solutions Ltd"
  - Description: "Website redesign and development"
  - Amount: "$2,500.00"
  - Due Date: "Dec 18, 2025"
  - Created: "Nov 18, 2025"
  - Status badge: "⏳ pending"
- Edit and Delete buttons are visible

#### 4.2 Create Invoice with Auto-Generated Number
**Steps:**
1. Click "Create Invoice"
2. Leave Invoice Number field empty
3. Enter "Quick Client" in Client Name
4. Enter "1000" in Amount
5. Enter "Consulting services" in Description
6. Set Due Date to one month from today
7. Click "Create Invoice"

**Expected Results:**
- Invoice is created with auto-generated number
- Invoice number follows pattern: "INV-[timestamp]-[random]"
- All other fields are saved correctly

#### 4.3 Create Invoice with Minimum Required Fields
**Steps:**
1. Leave optional fields empty:
   - Invoice Number: empty (for auto-generation)
   - Client Email: empty
   - Notes: empty
2. Fill required fields:
   - Client Name: "Minimum Client"
   - Amount: "500"
   - Description: "Basic service"
   - Issue Date: default
   - Due Date: future date
3. Click "Create Invoice"

**Expected Results:**
- Invoice is created successfully
- Optional fields remain empty
- Required fields are properly displayed

#### 4.4 Create Invoice with All Status Types
**Steps:**
1. Create invoice with Status: "Pending"
2. Create invoice with Status: "Paid"
3. Create invoice with Status: "Overdue"
4. Create invoice with Status: "Cancelled"

**Expected Results:**
- Each invoice is created with correct status
- Status badges display appropriate indicators:
  - Pending: "⏳ pending" (or similar icon)
  - Paid: Appropriate indicator
  - Overdue: Warning/error indicator
  - Cancelled: Cancelled indicator

#### 4.5 Edit Existing Invoice
**Prerequisites:** At least one invoice exists

**Steps:**
1. Locate invoice for "Acme Corporation"
2. Click "Edit" button
3. Change Amount to "2000"
4. Change Status to "Paid"
5. Update Description to "Web development services - Q4 2025 - PAID"
6. Add note: "Payment received on time"
7. Click "Update Invoice"

**Expected Results:**
- Invoice is updated with new values
- Status badge changes to "Paid"
- Updated amount is displayed
- Notes are saved and visible

#### 4.6 Delete Invoice
**Steps:**
1. Note current invoice count
2. Click "Delete" button on an invoice
3. Confirm deletion if prompted

**Expected Results:**
- Confirmation dialog appears
- After confirmation, invoice is removed
- Invoice no longer appears in list or summary

#### 4.7 Filter Invoices by Status
**Steps:**
1. Create invoices with different statuses (Pending, Paid, Overdue)
2. Select "Pending" from status filter dropdown
3. Observe filtered results

**Expected Results:**
- Only pending invoices are displayed
- Other statuses are hidden

**Repeat for:**
- All Status: Shows all invoices
- Paid: Shows only paid invoices
- Overdue: Shows only overdue invoices
- Cancelled: Shows only cancelled invoices

#### 4.8 Search Invoices
**Steps:**
1. Enter "Acme" in search field
2. Observe results

**Expected Results:**
- Only invoices with "Acme" in client name or invoice number are shown
- Search is case-insensitive
- Clearing search shows all invoices

#### 4.9 Create Invoice with Past Due Date
**Steps:**
1. Create new invoice
2. Set Due Date to a past date (e.g., "2025-10-01")
3. Keep Status as "Pending"
4. Complete other required fields
5. Click "Create Invoice"

**Expected Results:**
- Invoice is created
- System may automatically mark as "Overdue" or display warning
- Invoice appears in overdue filter

#### 4.10 Validate Required Fields
**Steps:**
1. Click "Create Invoice"
2. Click "Create Invoice" without filling any fields

**Expected Results:**
- Validation errors for required fields:
  - Client Name: Error message
  - Amount: Error message
  - Description: Error message
  - Due Date: Error message
- Form submission is prevented

#### 4.11 Create Invoice with Invalid Amount
**Steps:**
1. Enter negative value "-500" in Amount field
2. Complete other fields
3. Click "Create Invoice"

**Expected Results:**
- Validation error: "Amount must be greater than zero"
- Form submission is prevented

---

### 5. Dashboard Functionality

#### 5.1 View Dashboard with Data
**Prerequisites:** User has created expenses, income, and invoices

**Steps:**
1. Navigate to Dashboard (/dashboard)
2. Observe all dashboard sections

**Expected Results:**
- Welcome message displays: "Welcome back, [User Name]!"
- Date shown: "Here's your financial overview for today"
- Four metric cards display:
  - Total Income: Shows sum of all income entries with count
  - Total Expenses: Shows sum of all expenses with count
  - Net Income: Shows (Total Income - Total Expenses + Total Invoices)
  - This Month: Shows current month total
- Three category breakdown sections:
  - Income by Category: List or chart of income categories
  - Expenses by Category: List of expense categories with amounts
  - Invoices by Status: Count and total for each status
- Three recent activity sections:
  - Recent Income: Latest income entries
  - Recent Expenses: Latest expense entries (e.g., "Lunch at Italian Restaurant, Food & Dining • Nov 18, 2025, -$50.75")
  - Recent Invoices: Latest invoices with status

#### 5.2 Dashboard with No Data
**Prerequisites:** User account with no transactions

**Steps:**
1. Login with new account or clear all data
2. Navigate to Dashboard

**Expected Results:**
- All metric cards show $0.00
- Counts show 0
- Empty state messages in each section:
  - "No income data available"
  - "No expense data available"
  - "No invoice data available"
  - "No recent income"
  - "No recent expenses"
  - "No recent invoices"

#### 5.3 Filter Dashboard by "All Time"
**Steps:**
1. On Dashboard, click "All Time" button
2. Observe updated metrics

**Expected Results:**
- Button is highlighted/active
- All metrics show cumulative totals from all time
- Category breakdowns include all historical data
- Recent sections show latest entries regardless of date

#### 5.4 Filter Dashboard by "This Month"
**Steps:**
1. Click "This month" button
2. Observe updated metrics

**Expected Results:**
- Button is highlighted/active
- Metrics show only November 2025 data
- "This Month" card shows same value as November 2025
- Category breakdowns filtered to current month
- Recent sections may filter to current month

#### 5.5 Filter Dashboard by "This Year"
**Steps:**
1. Click "This year" button
2. Observe updated metrics

**Expected Results:**
- Button is highlighted/active
- Metrics show only 2025 data
- Totals aggregate all months in 2025
- Category breakdowns show year-to-date

#### 5.6 Verify Net Income Calculation
**Prerequisites:** Known amounts for income, expenses, and invoices

**Steps:**
1. Note Total Income value (e.g., $0.00)
2. Note Total Expenses value (e.g., $50.75)
3. Note Total Invoices value (e.g., $1,500.00)
4. Verify Net Income calculation

**Expected Results:**
- Net Income = Total Income - Total Expenses + Total Pending Invoices
- In example: $0.00 - $50.75 + $1,500.00 = $1,449.25
- Displayed Net Income matches calculated value

#### 5.7 Verify Recent Activity Updates
**Steps:**
1. From Dashboard, add new expense
2. Return to Dashboard
3. Verify new expense appears in Recent Expenses

**Expected Results:**
- Recent Expenses section updates immediately
- New expense appears at top of list
- Shows: Description, Category, Date, Amount

#### 5.8 Expenses by Category Visualization
**Prerequisites:** Expenses in multiple categories exist

**Steps:**
1. Observe "Expenses by Category" section
2. Verify data accuracy

**Expected Results:**
- Each category with expenses is listed
- Shows category name and count (e.g., "Food & Dining (1)")
- Shows total amount for each category (e.g., "$50.75")
- Categories without expenses are not displayed

#### 5.9 Invoices by Status Breakdown
**Prerequisites:** Invoices with different statuses exist

**Steps:**
1. Observe "Invoices by Status" section
2. Verify data accuracy

**Expected Results:**
- Shows count and total for each status:
  - "pending (1) $1,500.00"
- Only statuses with invoices are shown
- Totals are accurate per status

---

### 6. Summary Page Functionality

#### 6.1 View Complete Summary
**Prerequisites:** Data exists across all categories

**Steps:**
1. Navigate to Summary page (/summary)
2. Observe all sections

**Expected Results:**
- Page header: "📊 Financial Summary"
- Subtitle: "Comprehensive overview of your financial data"
- Time filter buttons: All Time, This month, This year
- Four metric cards (same as Dashboard):
  - Total Income with count
  - Total Expenses with count
  - Net Income with calculation
  - This Month total
- Category breakdowns:
  - Income by Category
  - Expenses by Category (e.g., "Food & Dining (1) $50.75")
  - Invoices by Status (e.g., "pending (1) $1,500.00")
- Recent activity sections:
  - Recent Income
  - Recent Expenses (e.g., "Lunch at Italian Restaurant, Food & Dining • Nov 18, 2025, -$50.75")
  - Recent Invoices (e.g., "Acme Corporation, INV-xxx • Dec 18, 2025, $1,500.00, PENDING")

#### 6.2 Filter Summary by Time Period
**Steps:**
1. Click "This month" button
2. Verify filtered data
3. Click "This year" button
4. Verify filtered data
5. Click "All Time" button
6. Verify complete data

**Expected Results:**
- Each filter updates all metrics and breakdowns
- Active button is visually highlighted
- Data accurately reflects selected time period

#### 6.3 Verify Category Breakdowns
**Steps:**
1. Compare category breakdowns to actual data
2. Verify each category total matches sum of individual entries

**Expected Results:**
- All categories with data are displayed
- Amounts are accurate
- Counts match number of entries
- Empty categories show "No data available" message

---

### 7. Navigation and User Experience

#### 7.1 Navigate Between All Pages
**Prerequisites:** User is logged in

**Steps:**
1. Click "🏠 Dashboard" in navigation
2. Verify Dashboard page loads
3. Click "💸 Expenses" in navigation
4. Verify Expenses page loads
5. Click "💰 Income" in navigation
6. Verify Income page loads
7. Click "🧾 Invoices" in navigation
8. Verify Invoices page loads
9. Click "📊 Summary" in navigation
10. Verify Summary page loads
11. Click "💰 FinanceApp" logo
12. Verify returns to Dashboard

**Expected Results:**
- All navigation links are functional
- Pages load without errors
- Active page is highlighted in navigation
- Navigation menu is persistent across all pages
- URLs update correctly for each page

#### 7.2 Browser Back/Forward Navigation
**Steps:**
1. Navigate: Dashboard → Expenses → Income
2. Click browser back button
3. Verify Expenses page loads
4. Click browser back button
5. Verify Dashboard loads
6. Click browser forward button
7. Verify Expenses page loads

**Expected Results:**
- Browser back/forward buttons work correctly
- Page state is preserved
- No errors or data loss

#### 7.3 Direct URL Access
**Steps:**
1. Manually enter URL: https://finance-app-five-rosy.vercel.app/expenses
2. Verify page loads (if logged in) or redirects to login
3. Test all page URLs:
   - /dashboard
   - /expenses
   - /incomes
   - /invoices
   - /summary
   - /login
   - /register

**Expected Results:**
- Protected pages require authentication
- Unauthenticated users redirect to login
- Authenticated users see correct pages
- Invalid URLs show 404 or redirect to dashboard

#### 7.4 Responsive Navigation Menu
**Steps:**
1. Resize browser window to mobile size
2. Verify navigation menu behavior
3. Resize to tablet size
4. Resize to desktop size

**Expected Results:**
- Navigation adapts to screen size
- All menu items remain accessible
- No layout issues or overlapping elements
- Mobile menu (hamburger) appears if implemented

#### 7.5 Session Persistence
**Steps:**
1. Login to application
2. Navigate to Expenses page
3. Refresh the browser (F5)
4. Verify still logged in and on Expenses page
5. Close browser tab
6. Reopen and navigate to application

**Expected Results:**
- Session persists across page refreshes
- User remains logged in (unless session timeout)
- Current page is preserved on refresh
- Session timeout behavior is consistent

#### 7.6 Form Cancel Buttons
**Steps:**
1. For each form (Add Expense, Add Income, Add Invoice):
   - Open the form
   - Fill in some fields
   - Click "Cancel" button
   - Verify form closes without saving
   - Verify data entry is cleared

**Expected Results:**
- Cancel button closes form immediately
- No data is saved
- Form returns to list view
- Next time form opens, fields are empty

#### 7.7 Notification System
**Steps:**
1. Perform actions that trigger notifications:
   - Create expense
   - Update expense
   - Delete expense
   - Create income
   - Create invoice

**Expected Results:**
- Success notifications appear for successful actions
- Notifications are visible and readable
- Notifications auto-dismiss after a few seconds (or have close button)
- Multiple notifications can stack or queue appropriately

---

### 8. Data Validation and Error Handling

#### 8.1 Form Validation - All Forms
**Steps:**
1. Test each form with:
   - Empty required fields
   - Invalid data types
   - Boundary values (max/min)
   - Special characters in text fields

**Expected Results:**
- Required field validation prevents submission
- Appropriate error messages display
- Invalid data is rejected with clear feedback
- Form maintains entered data for correction

#### 8.2 Network Error Handling
**Steps:**
1. Open browser DevTools
2. Simulate offline mode (Network throttling)
3. Attempt to create an expense
4. Restore network
5. Retry operation

**Expected Results:**
- User-friendly error message for network issues
- No data corruption
- Retry mechanism works correctly
- Application recovers gracefully when network restores

#### 8.3 Large Dataset Performance
**Prerequisites:** Account with 100+ expenses, income entries, and invoices

**Steps:**
1. Navigate to each page
2. Measure page load times
3. Test filtering and search with large datasets
4. Scroll through long lists

**Expected Results:**
- Pages load within acceptable time (< 3 seconds)
- Filtering and search remain responsive
- UI remains smooth with large datasets
- Pagination implemented if needed for performance

#### 8.4 Concurrent User Actions
**Steps:**
1. Open application in two browser tabs
2. In Tab 1: Add an expense
3. In Tab 2: Navigate to expenses page
4. Verify new expense appears (with refresh if needed)

**Expected Results:**
- Data consistency across tabs
- No conflicts or data loss
- Real-time updates or refresh mechanism works

---

### 9. Data Accuracy and Calculations

#### 9.1 Verify Total Calculations
**Steps:**
1. Create 5 expenses with known amounts: $10, $20, $30, $40, $50
2. Navigate to Dashboard
3. Verify Total Expenses shows $150.00
4. Create 3 income entries: $100, $200, $300
5. Verify Total Income shows $600.00
6. Verify Net Income calculation

**Expected Results:**
- All totals are mathematically accurate
- Calculations update immediately after changes
- Net Income formula is correct
- Currency formatting is consistent (2 decimal places)

#### 9.2 Date Range Filter Accuracy
**Steps:**
1. Create expenses on different dates:
   - Nov 1: $100
   - Nov 15: $50
   - Dec 1: $75
2. Filter by date range: Nov 1 - Nov 30
3. Verify only November expenses appear
4. Verify total shows $150.00

**Expected Results:**
- Date filtering is inclusive of start and end dates
- Only matching entries appear
- Totals reflect filtered data accurately

#### 9.3 Category Filter Accuracy
**Steps:**
1. Create expenses in multiple categories
2. Filter by "Food & Dining"
3. Manually count and sum filtered results
4. Verify displayed total and count match

**Expected Results:**
- Category filter is accurate
- No missing or extra entries
- Totals match manual calculation

---

### 10. Security and Authentication

#### 10.1 Protected Route Access
**Steps:**
1. Logout if logged in
2. Attempt to directly access: /dashboard
3. Attempt to access: /expenses
4. Attempt to access: /invoices

**Expected Results:**
- All protected routes redirect to login
- User cannot access data without authentication
- No sensitive information visible in URL or console

#### 10.2 Password Field Security
**Steps:**
1. Navigate to registration or login page
2. Observe password field behavior

**Expected Results:**
- Password input is masked (••••••)
- Password is not visible in browser autocomplete suggestions
- No password is logged in browser console or network tab

#### 10.3 Session Timeout
**Steps:**
1. Login to application
2. Leave browser idle for extended period
3. Attempt to perform an action

**Expected Results:**
- Session expires after timeout period
- User is redirected to login
- Appropriate message indicates session expired
- User must re-authenticate

---

### 11. Edge Cases and Boundary Testing

#### 11.1 Very Large Amounts
**Steps:**
1. Create expense with amount: 999999.99
2. Create income with amount: 1000000.00
3. Verify display and calculations

**Expected Results:**
- Large numbers are handled correctly
- Currency formatting remains proper (e.g., "$999,999.99")
- No overflow errors
- Calculations remain accurate

#### 11.2 Very Long Text Input
**Steps:**
1. Create expense with 500-character description
2. Verify display in list and detail views

**Expected Results:**
- Long text is accepted (or validation limit is enforced)
- Display truncates gracefully with ellipsis
- Full text visible in edit mode or on hover
- No layout breaking

#### 11.3 Special Characters in Text Fields
**Steps:**
1. Create expense with description: "Test @#$% & <script>alert('xss')</script>"
2. Create invoice with client name: "O'Reilly & Co. <test>"
3. Verify display

**Expected Results:**
- Special characters are properly escaped
- No XSS vulnerabilities
- Display is safe and correct
- Data is stored and retrieved accurately

#### 11.4 Rapid Sequential Actions
**Steps:**
1. Rapidly click "Add Expense" button multiple times
2. Fill form and click "Save" multiple times quickly
3. Verify only one entry is created

**Expected Results:**
- Button is disabled during processing
- No duplicate entries are created
- Application handles rapid clicks gracefully

#### 11.5 Date Boundary Testing
**Steps:**
1. Create expense with date: January 1, 1900
2. Create expense with date: December 31, 2099
3. Test leap year date: February 29, 2024
4. Test invalid date: February 30

**Expected Results:**
- Valid dates are accepted
- Invalid dates are rejected
- Date range limits are enforced (if any)
- Leap year dates work correctly

---

**Priority Levels:**
- P1 (Critical): Authentication, Core CRUD operations, Dashboard calculations
- P2 (High): Filtering, Search, Validation, Navigation
- P3 (Medium): Edit operations, Category management, Time filters
- P4 (Low): Edge cases, Performance with large datasets, Cross-browser

**Exit Criteria:**
- All P1 and P2 test scenarios pass
- No critical or high-severity bugs remain
- Cross-browser compatibility verified
- Performance benchmarks met
- Security vulnerabilities addressed

---

## Known Limitations and Assumptions

**Assumptions:**
- Application state is maintained in browser/session storage or backend database
- User authentication uses session-based or token-based system
- All monetary values are in USD
- Dates are in format: YYYY-MM-DD for input, displayed in localized format
- Application is designed for single-user desktop and mobile access

**Out of Scope:**
- Multi-currency support
- Export functionality (PDF, CSV)
- Advanced reporting and analytics
- Multi-user/team collaboration features
- Budget planning and forecasting
- Payment gateway integration
- Email notifications for invoices
- Recurring expense/income automation

---

## Defect Reporting Template

When logging defects, include:
1. **Title**: Brief description of issue
2. **Severity**: Critical / High / Medium / Low
3. **Priority**: P1 / P2 / P3 / P4
4. **Steps to Reproduce**: Detailed steps
5. **Expected Result**: What should happen
6. **Actual Result**: What actually happens
7. **Environment**: Browser, OS, screen size
8. **Screenshots/Videos**: Visual evidence
9. **Console Errors**: Any JavaScript errors
10. **Additional Notes**: Any relevant context

---

## Test Automation Recommendations

**High Priority for Automation:**
1. User authentication flows (login, logout, registration)
2. CRUD operations for expenses, income, and invoices
3. Dashboard calculations and updates
4. Filtering and search functionality
5. Form validation scenarios

**Recommended Framework:**
- Playwright (already initialized in project)
- Page Object Model for maintainability
- Data-driven tests for multiple scenarios
- API testing for backend validation

**Test Data Strategy:**
- Use database seeding for consistent test data
- Implement cleanup after tests
- Use unique identifiers for test data
- Separate test environment from production
