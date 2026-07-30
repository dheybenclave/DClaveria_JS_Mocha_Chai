---
name: pipeline
description: "Run full CI/CD pipeline: bootstrap, collect, test, heal, verify, report."
---

# /pipeline

Execute the full CI/CD pipeline for the WDIO Mocha Chai framework.

## Usage

```bash
npm run pipeline
```

## Pipeline Steps

### 1. Bootstrap — Validate Environment
```bash
npm run agentic:bootstrap
```
- Verify Node.js version (>= 18)
- Verify WDIO CLI installed
- Verify Chrome/Chromedriver available
- Verify mochawesome-report directory exists

### 2. Collect — Verify Test Discovery
```bash
npx wdio run ./wdio.conf.js --suite regression --dry-run
```
- Verify all `@tc_` tagged tests are discoverable
- Check for collection errors or warnings

### 3. Run Targeted Tests
```bash
npm run test:tc1
```
- Run `@tc_1` specifically for fast feedback
- Verify the test passes

### 4. Run Full Regression
```bash
npm run test:tag -- --mochaOpts.grep="@e2e_1"
```
- Run all E2E regression tests
- Verify no regressions introduced

### 5. Generate Report
```bash
npm run report
```
- Generate Mochawesome HTML report
- Open report in browser

### 6. Lint
```bash
npm run lint
```
- Run ESLint on all source and test files
- Fix any linting errors

### 7. Verify
```bash
npm run verify
```
- Run full validation sequence
- Confirm all checks pass

## Expected Output

- All tests pass
- Report generated at `./reports/mochawesome.html`
- No linting errors
- No collection or discovery errors
- All steps logged with `logger.info()`