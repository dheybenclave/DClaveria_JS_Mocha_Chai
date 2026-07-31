---
name: debug
description: Debug failing test with enhanced logging and screenshots.
---

# /debug

Debug a specific failing test with verbose output.

## Usage

```bash
npm run test:tag --tag="@tc_1" -- --logLevel=debug
```

## Steps

1. Run test with debug logging:
   ```bash
   npx wdio run ./config/wdio.local.conf.js --suite regression --mochaOpts.grep="@tc_1" --logLevel=debug
   ```
2. Capture screenshots on failure
3. Log browser console output
4. Analyze network requests
5. Report findings with evidence

## Debug Checklist

- [ ] Check `./reports/mochawesome.html` for failure details
- [ ] Review screenshots in `./reports/`
- [ ] Check application logs in report context
- [ ] Review stack trace for root cause
- [ ] Verify selector matches current DOM
- [ ] Check for stale element references
- [ ] Verify explicit waits are sufficient
- [ ] Check for parallel session conflicts

## Common Debug Commands

```bash
# Run single test with visible browser
HEADLESS=false npm run test:tag --tag="@tc_1"

# Run single test in local headless mode
HEADLESS=true npm run test:tag --tag="@tc_1"

# Run with debug logging
LOG_LEVEL=debug npm run test:tag --tag="@tc_1"

# Run with maxInstances=1 for stability
npm run test:tag --tag="@tc_1" -- --maxInstances=1

# Run in CI headless mode (no report auto-open)
npx wdio run ./config/wdio.ci.conf.js --suite regression --mochaOpts.grep="@tc_1"
```
