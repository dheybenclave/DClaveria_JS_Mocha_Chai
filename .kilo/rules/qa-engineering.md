---
description: "QA engineering standards and best practices for the WDIO Mocha Chai framework."
alwaysApply: true
---

# QA Engineering Standards

## Role: QA Engineer / SDET

This guide defines the standard operating procedures for QA engineers using the DClaveria WebDriverIO Mocha Chai framework.

## Framework Quick Reference

### Stack
- WebDriverIO (JS) for browser automation
- Mocha for test orchestration
- Chai for assertions
- Mochawesome for HTML reporting

### Key Paths
| Path | Purpose |
|------|---------|
| `src/specs/web/**/*.spec.js` | UI E2E test specs |
| `src/specs/api/**/*.spec.js` | API test specs |
| `src/pageobjects/` | Web page objects |
| `src/pageobjects/` | API page objects |
| `src/utils/` | Config, logger, data manager |
| `./reports/` | Mochawesome HTML reports |
| `AGENTIC_GUIDE.md` | Single unified agentic AI document |

### Standard Workflow

1. **Plan** — Use the test-planner agent to identify `@tc_` tags and page object methods needed
2. **Generate** — Use the test-generator agent to create specs, page objects, and test data
3. **Execute** — Use the test-executor agent to run targeted tests
4. **Heal** — Use the test-healer agent to fix broken selectors/waits
5. **Verify** — Run the full validation sequence before committing

### Reference Examples (MANDATORY Templates)

| Domain | Reference Test | File | What It Demonstrates |
|--------|---------------|------|---------------------|
| **WEB UI** | `@tc_5` | `src/specs/web/flight-search-results.spec.js` | Fresh session per test, data-driven, page object actions, descriptive assertions, proper cleanup |
| **API** | `@tc_7` | `src/specs/api/booking.spec.js` | Suite-level setup, per-test cleanup by ID, status validation, JSON property checks |

**Rule:** All new tests MUST follow these reference templates exactly.
- **WEB UI tests** → follow `@tc_5` pattern exactly
- **API tests** → follow `@tc_7` pattern exactly

### Test Tag Convention

| Tag | Purpose |
|-----|---------|
| `@smoke` | Smoke test suite |
| `@e2e_1` | E2E regression group |
| `@tc_N` | Individual test case marker |
| `@api` | API test suite |
| `@api_e2e_1` | API E2E regression group |
| `@api_tc_N` | Individual API test case marker |

### Running Tests

```bash
# Run a specific test case
npm run test:tag --tag="@tc_1"

# Run by tag
npm run test:tag --tag="@tc_1"

# Run web tests only
npm run test:web

# Run API tests only
npm run test:api

# Dry-run to check discovery
npx wdio run ./config/wdio.local.conf.js --suite regression --dry-run
```

### Writing a Test Spec

1. Import page objects and logger
2. Create `describe` block with `@smoke` or `@e2e_1` tag
3. Instantiate page objects in `before()` hook
4. Navigate to base page in `beforeEach()` hook
5. Write `it` blocks with `@tc_N` markers
6. Delegate actions to page objects
7. Use Chai `expect` for assertions
8. Log each step with `logger.info()`

### Page Object Conventions

1. Extend `BasePage` or a component that extends `BasePage`
2. Define element getters with resilient selectors
3. Use `logger.info()` for each action
4. Return element references from action methods
5. Use explicit waits — never `time.sleep()`
6. Keep selectors in page objects only — never in specs

### Selector Priority

1. `data-testid` attributes
2. Semantic attributes (`href`, `aria-label`, `role`)
3. Partial class matches (`class*=`)
4. Text-based XPath via `getTextElement()`

### Wait Strategy

1. `waitForDisplayed({ timeout })` — element visible
2. `waitForEnabled({ timeout })` — element enabled
3. `waitForElementClickable()` — visible + enabled
4. `waitForPageLoad()` — URL + DOM ready
5. `browser.waitUntil()` — custom condition

### Assertion Patterns

```javascript
import { expect } from 'chai';

// Boolean
expect(await el.isDisplayed()).to.be.true;

// Equality
expect(actual).to.equal(expected);

// Inclusion
expect(actual).to.include(expected);

// Array length
expect(results).to.have.length.greaterThan(0);

// Null/undefined
expect(value).to.not.be.undefined;
```

### Logging

- Use `logger.info()` for each test step
- Use `logger.debug()` for detailed diagnostics
- Use `logger.error()` for failures
- Never log passwords, tokens, or PII
- Logger auto-captures calling function name

### Reporting

- Mochawesome HTML report in `./reports/mochawesome.html`
- Reports auto-generated after each test run
- Screenshots auto-captured on failure
- Application logs attached to each test in report

### CI/CD Pipeline

```bash
# Run all tests
npm run test

# Run with specific tag
npm run test:tag -- --mochaOpts.grep="@e2e_1"

# Generate report
npm run report

# Lint
npm run lint
```

### Common Patterns

**Verify element visibility:**
```javascript
await page.waitForElementVisible(page.someElement, 5000);
expect(await page.someElement.isDisplayed()).to.be.true;
```

**Click and verify:**
```javascript
await page.clickElement(page.someButton);
await page.verifyContainsText('Expected text');
```

**Data-driven test:**
```javascript
const testData = DataManager.getWebData('test_data.json');
testData.items.forEach((item, index) => {
  it(`@tc_${index + 1} Should process ${item.name}`, async () => {
    // test logic
  });
});
```

**API CRUD lifecycle:**
```javascript
const result = await apiPage.createBooking(validData);
const bookingId = result.json.bookingid;
// ... read, update, delete
await apiPage.deleteBooking(bookingId);
```

### Definition of Done

- [ ] Scenario(s) for the change pass
- [ ] WDIO dry-run passes
- [ ] No new flaky waits or timing hacks
- [ ] Report artifacts generated in `./reports/`
- [ ] All steps logged with `logger.info()`
- [ ] Selectors in page objects only
- [ ] Explicit waits used — no `time.sleep()`
- [ ] Tag markers preserved
- [ ] Chai assertions include descriptive messages
- [ ] ESLint passes