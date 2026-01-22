# GitHub Actions + Smart Reporter Integration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     PLAYWRIGHT TEST EXECUTION                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Tests Run (Shards) │
                    │  with Trace Files   │
                    └─────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
         [Shard 1]      [Shard 2]      [Shard 3-4]
              │               │               │
              └───────────────┼───────────────┘
                              ▼
                    ┌─────────────────────┐
                    │  Upload Artifacts   │
                    │  - Smart Report     │
                    │  - Test History     │
                    │  - Playwright HTML  │
                    └─────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MERGE REPORTS JOB                           │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼                               ▼
    ┌──────────────────┐            ┌──────────────────┐
    │  Download Smart  │            │  Restore Test    │
    │     Reports      │            │    History       │
    └──────────────────┘            └──────────────────┘
              │                               │
              ▼                               ▼
    ┌──────────────────┐            ┌──────────────────┐
    │   Merge Smart    │            │   Merge Test     │
    │     Reports      │            │    History       │
    └──────────────────┘            └──────────────────┘
              │                               │
              │                               ▼
              │                     ┌──────────────────┐
              │                     │  test-history    │
              │                     │      .json       │
              │                     │ (cached for next │
              │                     │      runs)       │
              │                     └──────────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
                    ┌─────────────────────┐
                    │ Generate GitHub     │
                    │ Actions Summary     │
                    └─────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   GITHUB ACTIONS SUMMARY PAGE                    │
├─────────────────────────────────────────────────────────────────┤
│ # 📊 Playwright Test Results                                    │
│                                                                  │
│ ## ✅ All Tests Passed                                          │
│                                                                  │
│ ### 📈 Smart Report                                             │
│ View the detailed test report with flakiness detection,        │
│ stability scores, and performance trends on GitHub Pages.       │
│                                                                  │
│ 📥 Download artifacts from workflow run                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DEPLOY REPORT JOB                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Download Smart     │
                    │     Report          │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Prepare GitHub     │
                    │  Pages Content      │
                    │  (index.html)       │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Deploy to          │
                    │  gh-pages branch    │
                    └─────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GITHUB PAGES REPORT                           │
├─────────────────────────────────────────────────────────────────┤
│ 📊 StageWright Local - Test Dashboard                           │
│                                                                  │
│ ┌─────────┬─────────────────────────────────────────────────┐   │
│ │ Sidebar │  Overview                                        │   │
│ │         │  ┌─────────────────────────────────────────────┐│   │
│ │ Overview│  │ Pass Rate: 95%    Suite Grade: A           ││   │
│ │ Tests   │  │ Passed: 45  Failed: 2  Skipped: 0         ││   │
│ │ Trends  │  └─────────────────────────────────────────────┘│   │
│ │ Compare │                                                  │   │
│ │ Gallery │  Failure Clusters | Quick Insights | Trends    │   │
│ └─────────┴─────────────────────────────────────────────────┘   │
│                                                                  │
│ Features:                                                       │
│ • Flakiness Detection    • Stability Scores (A+ to F)          │
│ • Performance Trends     • Network Logs from Traces            │
│ • Screenshot Gallery     • Trace Viewer Integration            │
│ • Historical Navigation  • Failure Clustering                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        NOTIFY JOB                                │
│               (Optional - if SLACK_ENABLED=true)                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Build Slack        │
                    │  Notification       │
                    └─────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SLACK CHANNEL MESSAGE                        │
├─────────────────────────────────────────────────────────────────┤
│ ✅ Playwright Tests passed                                      │
│                                                                  │
│ Repository: your-org/repo     Branch: dev                       │
│ Triggered by: username        Event: push                       │
│                                                                  │
│ [📊 View Report] [🔗 Workflow Run]                              │
│                                                                  │
│ Report URL: https://user.github.io/repo/                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Integration        │
                    │  Complete!          │
                    └─────────────────────┘
```

## Key Integration Points

### 1. Test Execution
```yaml
# Trace files enable network logs in Smart Reporter
use:
  trace: 'on-first-retry'
  screenshot: 'only-on-failure'
  video: 'retain-on-failure'
```
- Trace files created for failed tests (on retry)
- Each shard uploads its Smart Report
- Test history cached for flakiness detection

### 2. Report Configuration
```typescript
// playwright.config.ts
reporter: [
  ['playwright-smart-reporter', {
    outputFile: '../reports/smart-report.html',
    historyFile: '../reports/test-history.json',
    maxHistoryRuns: 10,
    enableNetworkLogs: true,
    enableStabilityScore: true,
    enableFailureClustering: true,
  }],
]
```

### 3. History Persistence
```yaml
# Restore history from previous runs
- uses: actions/cache@v4
  with:
    path: reports/test-history.json
    key: test-history-${{ github.ref }}

# Save updated history
- uses: actions/cache/save@v4
  with:
    path: reports/test-history.json
    key: test-history-${{ github.ref }}-${{ github.run_id }}
```
- History enables flakiness detection
- Persisted across CI runs
- Branch-specific caching

### 4. GitHub Pages Deployment
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_branch: gh-pages
    publish_dir: gh-pages
```
- Smart Report deployed as `index.html`
- Available at `https://<user>.github.io/<repo>/`
- Auto-updates on push to dev/master

### 5. Slack Integration (Optional)
```yaml
if: always() && vars.SLACK_ENABLED == 'true'
```
- Enable by setting `SLACK_ENABLED=true` in repo variables
- Requires `SLACK_WEBHOOK_URL` secret
- Links directly to GitHub Pages report

## Secrets & Variables

```
GitHub Secrets
    │
    ├─ GITHUB_TOKEN ────────────► Deploy to GitHub Pages
    │
    └─ SLACK_WEBHOOK_URL ───────► Post Slack Message (optional)

GitHub Variables
    │
    └─ SLACK_ENABLED ───────────► Enable/Disable Slack notifications
```

## Data Flow

```
Test Execution
    ↓
Trace Files (on failure/retry)
    ↓
playwright-smart-reporter
    ↓
┌─────────────────────────────────────┐
│  smart-report.html                  │
│  ├─ Test Results & Statistics       │
│  ├─ Flakiness Detection             │
│  ├─ Stability Scores (A+ to F)      │
│  ├─ Performance Trends              │
│  ├─ Failure Clusters                │
│  ├─ Network Logs (from traces)      │
│  └─ Screenshot Gallery              │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  test-history.json                  │
│  ├─ Historical test results         │
│  ├─ Pass/fail rates per test        │
│  ├─ Duration trends                 │
│  └─ Flakiness indicators            │
└─────────────────────────────────────┘
    ↓
    ├─► GitHub Pages (public report)
    ├─► GitHub Actions Summary
    └─► Slack Notification (optional)
```

## Artifact Storage

```
Workflow Run
│
├── smart-report-1,2,3,4 (30 days)
│   ├── smart-report.html
│   └── test-history.json
│
├── playwright-report-1,2,3,4 (7 days)
│
├── test-results-1,2,3,4 (7 days)
│
└── smart-report (merged, 30 days)
    ├── smart-report.html
    └── test-history.json
```

## Smart Reporter Features

| Feature | Description |
|---------|-------------|
| **Flakiness Detection** | Tracks test history to identify unreliable tests |
| **Stability Scores** | A+ to F grades based on pass rate, stability, performance |
| **Performance Trends** | Warns when tests get significantly slower |
| **Failure Clustering** | Groups similar failures by error type |
| **Network Logs** | Extracts API calls from trace files |
| **Screenshot Gallery** | Visual grid of test attachments |
| **Trace Viewer** | One-click access to Playwright traces |
| **Historical Navigation** | Click trend charts to view past runs |

## Success Indicators

✅ **GitHub Actions**:
- Summary shows test results with GitHub Pages link
- Smart Report artifact uploaded
- Test history cached for next run

✅ **GitHub Pages**:
- Report accessible at `https://<user>.github.io/<repo>/`
- Shows all test results with stability grades
- Flakiness indicators visible for unstable tests

✅ **Slack** (if enabled):
- Message received with pass/fail status
- Links to GitHub Pages report
- Links to workflow run
