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
npm run test:parallel
npm run test:ci          # CI/CD: headless via wdio.ci.conf.js
HEADLESS=true npm run test:tag --tag="@tc_1"  # Local headless
```

## Options

| Flag | Purpose |
|------|---------|
| `--tag="@tc_N"` | Run specific test case |
| `--specs path` | Run specific spec files |
| `--suite regression` | Run regression suite |
| `--maxInstances=N` | Parallel instances (1 for stability, 5 for speed) |

## Steps

1. Run targeted test with mochawesome report
2. Verify console output shows step logs from `logger.info()`
3. Confirm report opens if `openMochawesomeReport: true`
4. Check for session conflicts in parallel runs
5. Verify `afterEach` cleanup runs (cookies/storage cleared)

## Reference Test Health Check

Before running new tests, verify reference templates still pass:

```bash
# WEB UI reference
npm run test:tag --tag="@tc_5"

# API reference
npm run test:tag --tag="@tc_7"
```

These are the canonical tests. If they fail, investigate before running new tests.

## Output

- Test pass/fail status
- Execution duration
- Screenshot on failure
- Report path: `./reports/mochawesome.html`
