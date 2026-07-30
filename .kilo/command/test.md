---
name: test
description: Run targeted WDIO tests by tag, suite, or spec.
---

# /test

Run WebDriverIO tests with proper reporting.

## Usage

```bash
npm run test:tag --tag="@tc_1"
npm run test:web
npm run test:api
```

## Steps

1. Run targeted test with mochawesome report
2. Verify console output shows step logs
3. Confirm report opens if `openMochawesomeReport: true`
