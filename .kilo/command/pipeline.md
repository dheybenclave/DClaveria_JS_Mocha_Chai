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
- Verify Chrome browser available
- Verify reference templates pass (`@tc_5`, `@tc_7`)

### 2. Collect — Verify Test Discovery
```bash
npm run collect
```
- Verify all `@tc_` tagged tests are discoverable
- Check for collection errors or warnings
- Verify all page objects import correctly

### 3. Run Targeted Tests
```bash
npm run test:tag --tag="@tc_5"
npm run test:tag --tag="@tc_7"
```
- Run reference templates first
- Verify both pass before running new tests

### 4. Run Full Regression
```bash
npm run test:parallel
```
- Run all web + API specs with `maxInstances=5`
- Verify no regressions introduced
- Check for parallel session conflicts

### 5. Generate Report
```bash
npm run report
```
- Generate Mochawesome HTML report
- Open report in browser

### 6. Lint
```bash
npx eslint src/ --ext .js
```
- Run ESLint on all source and test files
- Fix any linting errors

## Expected Output

- All tests pass
- Report generated at `./reports/mochawesome.html`
- No linting errors
- No collection or discovery errors
- All steps logged with `logger.info()`
- No parallel session conflicts