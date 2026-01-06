# GitHub Actions + Slack Integration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     PLAYWRIGHT TEST EXECUTION                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Tests Run (Shards) │
                    │  with HAR Recording │
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
                    │  - Allure Results   │
                    │  - HAR Reports      │
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
    │ Download Allure  │            │  Download HAR    │
    │    Results       │            │    Reports       │
    └──────────────────┘            └──────────────────┘
              │                               │
              ▼                               ▼
    ┌──────────────────┐            ┌──────────────────┐
    │ Generate Allure  │            │   Merge HAR      │
    │     Report       │            │   Reports        │
    └──────────────────┘            └──────────────────┘
              │                               │
              │                               ▼
              │                     ┌──────────────────┐
              │                     │  aggregate-      │
              │                     │  analysis.json   │
              │                     │  ai-report.txt   │
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
│ # 🔍 HAR Analysis Summary                                       │
│                                                                  │
│ ## ✅ No Issues Detected                                        │
│ All network requests performed within acceptable thresholds.    │
│                                                                  │
│ ### 🤖 AI Analysis                                              │
│ ```                                                              │
│ 📊 HAR Analysis Report                                          │
│ Total requests analyzed: 0 anomalies found.                     │
│ ✅ Summary: No issues found...                                  │
│ 💡 General suggestions: [AI recommendations]                    │
│ ```                                                              │
│                                                                  │
│ 📥 Download HAR Analysis Reports                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        NOTIFY JOB                                │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼                               ▼
    ┌──────────────────┐            ┌──────────────────┐
    │ Extract Allure   │            │  Extract HAR     │
    │   Statistics     │            │   Statistics     │
    │  - Passed: 45    │            │  - Anomalies: 0  │
    │  - Failed: 0     │            │  - Errors: 0     │
    │  - Broken: 0     │            │  - Slow: 0       │
    │  - Skipped: 0    │            │  - Large: 0      │
    └──────────────────┘            └──────────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
                    ┌─────────────────────┐
                    │  Prepare Slack      │
                    │  Notification       │
                    │  (Fill Template)    │
                    └─────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼                               ▼
    ┌──────────────────┐            ┌──────────────────┐
    │ Upload File to   │            │  Post Message    │
    │     Slack        │            │   via Webhook    │
    │ (ai-report.txt)  │            │                  │
    │                  │            │                  │
    │ Using:           │            │  Using:          │
    │ SLACK_BOT_TOKEN  │            │ SLACK_WEBHOOK_   │
    │ SLACK_CHANNEL_ID │            │      URL         │
    └──────────────────┘            └──────────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SLACK CHANNEL MESSAGE                        │
├─────────────────────────────────────────────────────────────────┤
│ ✅ Playwright Tests - success                                   │
│                                                                  │
│ Repository: your-org/repo     Branch: dev                       │
│ Triggered by: username        Event: push                       │
│                                                                  │
│ ✅ Passed: 45    ❌ Failed: 0                                   │
│ 🔥 Broken: 0     ⏭️ Skipped: 0                                  │
│ Total Tests: 45                                                  │
│ ─────────────────────────────────────                           │
│ 🔍 HAR Analysis                                                 │
│                                                                  │
│ Total Anomalies: 0    ❌ HTTP Errors: 0                         │
│ 🐌 Slow Responses: 0  📦 Large Payloads: 0                     │
│                                                                  │
│ [📊 View Allure Report] [🔗 View Workflow Run]                 │
│                                                                  │
│ 📎 ai-report.txt (attached)                                     │
│    🤖 HAR Analysis AI Report                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Notification       │
                    │  Complete!          │
                    └─────────────────────┘
```

## Key Integration Points

### 1. Test Execution
```yaml
env:
  GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
```
- Groq API key enables AI report generation
- HAR files created automatically by tests
- Each shard uploads its reports

### 2. Report Merging
```bash
merge-multiple: true
```
- All shard reports combined
- Single aggregate analysis created
- Historical data preserved

### 3. GitHub Summary
```bash
echo "# 🔍 HAR Analysis Summary" >> $GITHUB_STEP_SUMMARY
cat ai-report.txt >> $GITHUB_STEP_SUMMARY
```
- Markdown formatted
- Visible on workflow summary page
- Includes AI analysis

### 4. Slack Integration
```bash
# Upload file
curl -F file=@ai-report.txt \
     -H "Authorization: Bearer $SLACK_BOT_TOKEN"

# Post message  
curl --data @slack-payload.json \
     $SLACK_WEBHOOK_URL
```
- Two API calls (file + message)
- Stats extracted and templated
- Links to reports included

## Secrets Flow

```
GitHub Secrets
    │
    ├─ GROQ_API_KEY ────────────► Test Execution ──► AI Report
    │
    ├─ SLACK_WEBHOOK_URL ───────► Post Message
    │
    ├─ SLACK_BOT_TOKEN ─────────► Upload File
    │
    └─ SLACK_CHANNEL_ID ────────► Target Channel
```

## Data Flow

```
HAR Files (.har)
    ↓
HAR Analyzer (utils/har-analyzer.ts)
    ↓
Analysis JSON (aggregate-analysis.json)
    ↓
AI Reporter (utils/ai-reporter.ts) ← GROQ_API_KEY
    ↓
AI Report (ai-report.txt)
    ↓
    ├─► GitHub Actions Summary
    └─► Slack Attachment
```

## Artifact Storage

```
Workflow Run
│
├── allure-results-1,2,3,4 (7 days)
├── har-reports-1,2,3,4 (30 days)
├── allure-report (7 days)
├── allure-history (90 days)
└── har-analysis-report (30 days)
    ├── aggregate-analysis.json
    ├── ai-report.txt
    └── individual test HAR files
```

## Success Indicators

✅ **GitHub Actions**:
- Summary shows HAR analysis section
- Artifacts include `har-analysis-report`
- No errors in workflow logs

✅ **Slack**:
- Message received in channel
- HAR stats visible
- File attachment present
- Links work

✅ **Reports**:
- `aggregate-analysis.json` has data
- `ai-report.txt` exists
- Individual HAR files present
