---
name: verify
description: Run full validation sequence before commit.
---

# /verify

Execute full validation: collection, targeted tests, and reporting.

## Usage

```bash
npm run test:tag --tag="@tc_1"
npm run collect
npm run report
```

## Validation Sequence

Per `.kilo/rules/common-testing.md`:

### 1. Reference Template Tests
```bash
# WEB UI reference
npm run test:tag --tag="@tc_5"

# API reference
npm run test:tag --tag="@tc_7"
```
- Verify both reference templates pass
- These are the canonical tests for their respective domains

### 2. Targeted Test (Fast Feedback)
```bash
npm run test:tag --tag="@tc_1"
```
- Verify the specific test passes
- Check for console errors
- Verify report generation

### 3. Dry-Run (Discovery Check)
```bash
npm run collect
```
- Verify all specs discoverable
- Check for collection errors

### 4. Parallel Regression
```bash
npm run test:parallel
```
- Run all tests in parallel
- Verify no session conflicts
- Check `afterEach` cleanup runs

### 5. Report Verification
```bash
npm run report
```
- Open `./reports/mochawesome.html`
- Verify all tests appear in report
- Check screenshots for failures

## Definition of Done

- [ ] Scenario(s) for the change pass
- [ ] WDIO dry-run passes
- [ ] No new flaky waits or timing hacks
- [ ] Report artifacts generated in `./reports/`
- [ ] All steps logged with `logger.info()`
- [ ] Selectors in page objects only
- [ ] Explicit waits used — no `time.sleep()`
- [ ] Tag markers preserved
- [ ] Chai assertions include descriptive messages
