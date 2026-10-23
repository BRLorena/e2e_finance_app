# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.setup.ts >> User Registration and Authentication >> Create Account and Save Auth State
- Location: tests/auth.setup.ts:19:8

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Welcome Back')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Welcome Back') with timeout 10000ms
  - waiting for getByText('Welcome Back')

```

```yaml
- text: 🚀
- heading "Get Started" [level=3]
- paragraph: Create your Finance Tracker account
- text: Full Name
- textbox "Full Name":
  - /placeholder: John Doe
  - text: John Doe
- text: Email Address
- textbox "Email Address":
  - /placeholder: you@example.com
  - text: test@example.com
- text: Password
- textbox "Password":
  - /placeholder: ••••••••
  - text: testpassword123
- text: ❌ User with this email already exists
- button "Create Account"
- text: or
- paragraph:
  - text: Already have an account?
  - link "Sign in instead":
    - /url: /login
- link "← Back to home":
  - /url: /
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  12  |   // Login page locators
  13  |   readonly loginWelcomeHeading: Locator;
  14  |   readonly emailInput: Locator;
  15  |   readonly passwordInput: Locator;
  16  |   readonly signInButton: Locator;
  17  |   readonly createAccountLink: Locator;
  18  | 
  19  |   // Registration page locators
  20  |   readonly registerHeading: Locator;
  21  |   readonly fullNameInput: Locator;
  22  |   readonly registerEmailInput: Locator;
  23  |   readonly registerPasswordInput: Locator;
  24  |   readonly createAccountButton: Locator;
  25  |   readonly signInLink: Locator;
  26  |   readonly startFreeButton: Locator;
  27  | 
  28  |   // Error and success messages
  29  |   readonly errorMessage: Locator;
  30  |   readonly successMessage: Locator;
  31  | 
  32  |   constructor(page: Page) {
  33  |     this.page = page;
  34  |     this.baseUrl = '';
  35  | 
  36  |     // Login page elements
  37  |     this.loginWelcomeHeading = page.getByText('Welcome Back');
  38  |     this.emailInput = page.getByRole('textbox', { name: 'Email Address' });
  39  |     this.passwordInput = page.getByRole('textbox', { name: 'Password' });
  40  |     this.signInButton = page.getByRole('button', { name: 'Sign In' });
  41  |     this.createAccountLink = page.getByRole('link', { name: /Create Account|Sign Up/ });
  42  | 
  43  |     // Registration page elements
  44  |     this.registerHeading = page.getByRole('heading', { name: /Get Started|Create Account|Sign Up/i });
  45  |     this.fullNameInput = page.getByRole('textbox', { name: 'Full Name' });
  46  |     this.registerEmailInput = page.getByRole('textbox', { name: 'Email Address' });
  47  |     this.registerPasswordInput = page.getByRole('textbox', { name: 'Password' });
  48  |     this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
  49  |     this.signInLink = page.getByRole('link', { name: /Sign in instead|Sign In|Log In/i });
  50  |     this.startFreeButton = page.getByRole('link', { name: '🚀 Start Free Today' });
  51  | 
  52  |     // Messages
  53  |     this.errorMessage = page.getByText(/invalid|error|wrong/i);
  54  |     this.successMessage = page.getByText(/success|created|registered/i);
  55  |   }
  56  | 
  57  |   @step
  58  |   async navigateToLogin() {
  59  |     await this.page.goto(`${this.baseUrl}/login`);
  60  |     await expect(this.loginWelcomeHeading).toBeVisible({ timeout: 10000 });
  61  |   }
  62  | 
  63  |   @step
  64  |   async navigateToRegister() {
  65  |     await this.page.goto(`${this.baseUrl}`);
  66  |     await this.startFreeButton.click();
  67  |     await expect(this.registerHeading).toBeVisible({ timeout: 10000 });
  68  |   }
  69  | 
  70  |   @step
  71  |   async login(email: string, password: string) {
  72  |     await this.emailInput.fill(email);
  73  |     await this.passwordInput.fill(password);
  74  |     await this.signInButton.click();
  75  |   }
  76  | 
  77  |   @step
  78  |   async register(fullName: string, email: string, password: string) {
  79  |     await this.fullNameInput.fill(fullName);
  80  |     await this.registerEmailInput.fill(email);
  81  |     await this.registerPasswordInput.fill(password);
  82  |     await this.createAccountButton.click();
  83  |   }
  84  | 
  85  |   @step
  86  |   async verifyLoginPageLoaded() {
  87  |     await expect(this.loginWelcomeHeading).toBeVisible();
  88  |     await expect(this.emailInput).toBeVisible();
  89  |     await expect(this.passwordInput).toBeVisible();
  90  |     await expect(this.signInButton).toBeVisible();
  91  |   }
  92  | 
  93  |   @step
  94  |   async verifyRegisterPageLoaded() {
  95  |     await expect(this.registerHeading).toBeVisible();
  96  |     await expect(this.fullNameInput).toBeVisible();
  97  |     await expect(this.registerEmailInput).toBeVisible();
  98  |     await expect(this.registerPasswordInput).toBeVisible();
  99  |     await expect(this.createAccountButton).toBeVisible();
  100 |   }
  101 | 
  102 |   @step
  103 |   async verifyLoginSuccess() {
  104 |     // Wait for the dashboard welcome message to appear
  105 |     // This is the most reliable indicator that login was successful
  106 |     await expect(this.page.getByRole('heading', { name: /Welcome back/i })).toBeVisible({ timeout: 30000 });
  107 |   }
  108 | 
  109 |   @step
  110 |   async verifyRegistrationSuccess() {
  111 |     // Should redirect to login page after successful registration
> 112 |     await expect(this.loginWelcomeHeading).toBeVisible({ timeout: 10000 });
      |                                            ^ Error: expect(locator).toBeVisible() failed
  113 |   }
  114 | 
  115 |   @step
  116 |   async verifyErrorMessage() {
  117 |     await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  118 |   }
  119 | 
  120 |   @step
  121 |   async isOnLoginPage(): Promise<boolean> {
  122 |     return this.page.url().includes('/login');
  123 |   }
  124 | 
  125 |   @step
  126 |   async hasError(): Promise<boolean> {
  127 |     try {
  128 |       return await this.errorMessage.isVisible();
  129 |     } catch {
  130 |       return false;
  131 |     }
  132 |   }
  133 | 
  134 |   @step
  135 |   async attemptLogin(email: string, password: string): Promise<boolean> {
  136 |     await this.navigateToLogin();
  137 |     await this.login(email, password);
  138 |     
  139 |     // Wait for either navigation to dashboard or error message
  140 |     await Promise.race([
  141 |       this.page.waitForURL(/.*\/dashboard/, { timeout: 15000 }).catch(() => {}),
  142 |       this.page.waitForSelector('text=/invalid|error|wrong/i', { timeout: 15000 }).catch(() => {}),
  143 |       this.page.waitForTimeout(3000)
  144 |     ]);
  145 | 
  146 |     const loginFailed = await this.isOnLoginPage() || await this.hasError();
  147 |     return !loginFailed;
  148 |   }
  149 | 
  150 |   @step
  151 |   async registerNewAccount(fullName: string, email: string, password: string) {
  152 |     await this.navigateToRegister();
  153 |     await this.register(fullName, email, password);
  154 |     
  155 |     // Wait a moment to see if there's an error (user exists)
  156 |     await this.page.waitForTimeout(1000);
  157 |     
  158 |     // Check if we got "User with this email already exists" error
  159 |     const userExistsError = await this.page.getByText('User with this email already exists').isVisible().catch(() => false);
  160 |     
  161 |     if (userExistsError) {
  162 |       console.log('User already exists, navigating to login...');
  163 |       // Click "Sign in instead" link
  164 |       await this.page.getByRole('link', { name: /Sign in instead/i }).click();
  165 |       // Wait for the login page to fully load before returning, to prevent race conditions
  166 |       await expect(this.loginWelcomeHeading).toBeVisible({ timeout: 10000 });
  167 |       return;
  168 |     }
  169 |     
  170 |     await this.verifyRegistrationSuccess();
  171 |   }
  172 | 
  173 |   @step
  174 |   async loginOrRegister(fullName: string, email: string, password: string) {
  175 |     // Try to login first
  176 |     const loginSuccessful = await this.attemptLogin(email, password);
  177 | 
  178 |     if (!loginSuccessful) {
  179 |       console.log('Account does not exist, registering new account...');
  180 |       await this.registerNewAccount(fullName, email, password);
  181 |       
  182 |       // Now login with the newly created account
  183 |       await this.login(email, password);
  184 |       
  185 |       // Wait for dashboard to load
  186 |       await this.page.waitForURL(/.*\/dashboard/, { timeout: 30000 });
  187 |     } else {
  188 |       console.log('Account already exists, login successful');
  189 |     }
  190 |     
  191 |     // Verify login success for both paths
  192 |     await this.verifyLoginSuccess();
  193 |   }
  194 | }
  195 | 
```