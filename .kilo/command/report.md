---
name: report
description: "Generate, analyze, and open Mochawesome HTML reports."
---

# /report

Generate, analyze, and open Mochawesome HTML reports for test execution.

## Usage

```bash
npm run report
```

## Report Generation

Reports are auto-generated after every test run via the `onComplete` hook in `config/wdio.shared.conf.js`.

### Report Location

- HTML report: `./reports/mochawesome.html`
- Raw JSON data: `./reports/results-*.json`
- Merged JSON: `./reports/wdio-ma-merged.json`

### Report Contents

- Test suite hierarchy
- Pass/fail status per test
- Execution duration per test
- Screenshots on failure
- Application logs per test (from Pino buffer)
- Stack traces for failures
- Deduplicated nested suites

### Reference Test Summary

The report includes the mandatory reference tests:
- `@tc_5` — WEB UI reference test
- `@tc_7` — API reference test

These serve as the baseline for all new test generation.

### Opening the Report

```bash
npm run report
```
This opens the HTML report in the default browser.

### Manual Report Generation

If the report was not auto-generated:
```bash
npx marge ./reports/wdio-ma-merged.json --reportDir ./reports --reportFilename mochawesome --inline --charts
```

### Report Analysis

1. Open `./reports/mochawesome.html` in a browser
2. Check pass/fail counts
3. Review failed test screenshots
4. Check application logs for each test
5. Review stack traces for failures
6. Identify flaky tests (pass/fail intermittently)

### Common Report Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| No HTML report | `onComplete` hook failed | Check console for errors |
| Missing screenshots | `takeScreenshot` not called | Ensure `afterTest` hook runs |
| Missing logs | Log buffer not flushed | Check `clearLogBuffer()` call |
| Duplicate suites | Upstream wdio-mochawesome bug | `dedupeSuites()` in `wdio.shared.conf.js` |
| Report won't open | `openMochawesomeReport` is false | Set `openMochawesomeReport: true` in local config |