# AGENTIC_GUIDE.md - Agentic QA Workflow

This is the single unified document for all agentic AI operations in the DClaveria WebDriverIO Mocha Chai framework. It covers the workflow, commands, agents, rules, and standards for QA engineers and AI agents.

---

## Overview

The agentic QA workflow enables AI agents and QA engineers to:
- Generate test cases from requirements
- Heal broken tests automatically
- Bootstrap and verify test environments
- Execute targeted test runs with proper reporting
- Run the full CI/CD pipeline

## Platform Support

| Platform | Config Path | Agent Definitions | Commands |
|----------|-------------|-------------------|----------|
| **Kilo** | `.kilo/kilo.json` | `.kilo/agent/` | `.kilo/command/` |
| **Claude** | `.claude/settings.json` | `.github/agents/` | `.claude/commands/` |

---

## Project Overview

- **Stack**: WebDriverIO (JS), Mocha, Chai, Mochawesome
- **Domain**: UI + API automation for `https://www.cheapflights.com.au` and `https://restful-booker.herokuapp.com`
- **Framework**: Page Object Model with WDIO BDD style
- **Reporting**: Mochawesome HTML report in `./reports/`

## Architecture

| Path | Description |
|------|-------------|
| `tests/web/**/*.spec.js` | UI E2E test specs with `@tc_` markers |
| `tests/api/**/*.spec.js` | API test specs |
| `src/pages/web/` | Web page objects with locators and actions |
| `src/pages/api/` | API client/page objects |
| `src/utils/` | Configuration, helpers, logger utilities |
| `./reports/` | Mochawesome HTML reports |
| `.kilo/` | Kilo agentic AI configuration |

---

## Design Principles

- **Thin specs, rich pages**: Test specs delegate to page objects; page objects own locators, actions, and assertions
- **Data-driven**: Test data flows from `src/utils/config.js` and JSON files
- **Marker-driven execution**: Use `@tc_` tags for test selection
- **Centralized config**: All settings in `wdio.conf.js` `config` block and `src/utils/config.js`
- **Mochawesome reporting**: Primary report is `./reports/mochawesome.html`

---

## Build/Lint/Test Commands

```bash
# === Test Execution ===
npm run test                    # Run all tests
npm run test:parallel          # Run all tests in parallel
npm run test:web               # Run only web tests
npm run test:api               # Run only API tests
npm run test:tag --tag="@tc_1"  # Run specific tag
npm run test:tag --tag="@tc_1"               # Run @tc_1 specifically
npm run report                 # Generate and open HTML report
npm run collect                # Verify test discovery (dry-run)
npm run pipeline               # Run full CI/CD pipeline

# === Agentic AI ===
npm run agentic:bootstrap      # Validate environment
npm run agentic:heal -- --test="@tc_6"  # Heal broken test
npm run agentic:generate -- --requirement="user can search flights"  # Generate test

# === Verification ===
npx wdio run ./wdio.conf.js --suite regression --mochaOpts.grep="@tc_1"
npx eslint src/ tests/ --ext .js
```

---

## Available Agents

| Agent | File | Purpose |
|-------|------|---------|
| Test Planner | `.kilo/agent/test-planner.md` | Plan test coverage and strategy from requirements |
| Test Executor | `.kilo/agent/test-executor.md` | Execute and monitor test runs, analyze results |
| Test Healer | `.kilo/agent/test-healer.md` | Automatically fix broken selectors and waits |
| Test Generator | `.kilo/agent/test-generator.md` | Generate new test specs, page objects, and test data |

### Agent Workflows

#### Test Planner
1. Analyze requirements for test coverage
2. Identify `@tc_` tags needed
3. Plan page object methods required
4. Define test data structure
5. Create test execution plan

#### Test Executor
1. Run targeted tests by tag for fast feedback
2. Run WDIO dry-run to catch discovery issues
3. Run broader regression before finalizing
4. Generate and open HTML report
5. Report execution status and key metrics

#### Test Healer
1. Identify failing test from mochawesome report
2. Analyze error message and stack trace
3. Classify failure type (selector, wait, assertion, data)
4. Propose and apply fixes to page objects or specs
5. Re-run the healed test to verify
6. Run broader regression to confirm no regressions

#### Test Generator
1. Parse natural language requirements into test scenarios
2. Create/update page object methods
3. Generate spec files with proper `@tc_` markers
4. Create test data JSON files
5. Add `logger.info()` calls for all steps
6. Run collection to verify discovery
7. Run the new test to verify

---

## Core Guardrails (Non-Negotiable)

1. **NO selectors in spec files** — All selectors in page objects (`src/pages/`)
2. **NO time.sleep()** — Use `waitForDisplayed`, `waitForEnabled`, `browser.waitUntil`
3. **NO long spec files** — Keep specs focused and minimal; delegate complex logic to page objects
4. **NO hardcoded secrets** — Use `wdio.conf.js` `config` block
5. **ALWAYS run with --dry-run before commit** to verify test discovery
6. **ALWAYS tag tests with `@tc_N` markers**
7. **ALWAYS use semantic selectors** — `[data-testid]`, `getByRole` equivalents in WDIO

---

## Rules (`.kilo/rules/`)

The following rule files are always applied when working in this repository:

| Rule File | Purpose |
|-----------|---------|
| `common-testing.md` | Validation sequence, DoD, stability rules |
| `wdio-mocha-chai-framework.md` | Workflow, paths, commands |
| `js-coding-style.md` | ES6+, async/await, naming conventions |
| `js-security.md` | Secrets management, logging safety |
| `test-automation-guardrails.md` | Selectors, waits, WDIO discipline |
| `qa-engineering.md` | QA engineering standards and conventions |

---

## Test Tag Convention

| Tag | Purpose |
|-----|---------|
| `@smoke` | Smoke test suite |
| `@e2e_1` | E2E regression group |
| `@tc_N` | Individual test case marker |
| `@api` | API test suite |
| `@api_e2e_1` | API E2E regression group |
| `@api_tc_N` | Individual API test case marker |

---

## Page Object Model

### Structure

```javascript
import BasePage from '../base.page.js';
import { logger } from '../../../utils/logger.js';
import { expect } from 'chai';

export default class HomePage extends BasePage {
  get logoImage() {
    return $('div.mc6t-logo');
  }

  get loginButton() {
    return $('a[href*="login"]');
  }

  async clickCarButton() {
    logger.info('Clicking car button');
    await this.clickElement(this.carButton);
  }
}
```

### Rules

1. Every page object extends `BasePage`
2. Every element is a getter
3. Every action uses `logger.info()` at the start
4. Every action returns the element reference
5. Every assertion uses Chai `expect`
6. No selectors in spec files — only in page objects

---

## Selectors Strategy

### Priority Order

1. **`data-testid`** — Explicitly designed for testing
2. **Semantic attributes** — `href`, `aria-label`, `role`
3. **Partial attribute matches** — `[class*="partial"]`, `[href*="login"]`
4. **Text-based XPath** — Via `BasePage.getTextElement()`
5. **CSS class** — Only as last resort, use partial match

### Examples

```javascript
// ✅ BEST — data-testid
get fromCityInput() {
    return $('[data-testid="from-input"]');
}

// ✅ GOOD — Semantic + partial match
get loginButton() {
    return $('a[href*="login"]');
}

// ✅ GOOD — Partial class match
get loginDialog() {
    return $('div[class*="unified-login"]');
}

// ✅ GOOD — Text-based via BasePage
const el = await this.getTextElement('Car hire.');

// ❌ AVOID — Full class match (brittle)
get loginButton() {
    return $('div.unified-login');
}

// ❌ AVOID — nth-child (fragile)
$('div.mc6t-logo > span:nth-child(2)')
```

---

## Waits Strategy

### Always Use Explicit Waits

```javascript
// ❌ WRONG
// time.sleep(2);

// ✅ CORRECT
await this.logo.waitForDisplayed({ timeout: 15000 });
await browser.waitUntil(async () => {
    return await this.resultsContainer.isDisplayed();
}, { timeout: 60000 });
```

### Wait Methods

| Method | What It Waits For |
|--------|-------------------|
| `waitForDisplayed({ timeout })` | Element exists AND is displayed |
| `waitForEnabled({ timeout })` | Element is enabled |
| `waitForElementClickable()` | Visible + enabled |
| `waitForPageLoad()` | URL + DOM ready |
| `browser.waitUntil()` | Custom condition |

---

## Assertions (Chai)

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

Always include descriptive assertion messages:
```javascript
expect(actualText, `Expected text to include "${expectedText}"`).to.include(expectedText);
```

---

## Logging

### Logger Methods

| Method | Usage |
|--------|-------|
| `logger.info(msg)` | Standard step logging |
| `logger.debug(msg)` | Detailed diagnostics |
| `logger.warn(msg)` | Warnings |
| `logger.error(msg)` | Failures |
| `logger.pass(msg)` | Pass confirmations |

### Safety Rules

- Never log sensitive data (passwords, tokens, PII)
- Sanitize URLs before logging
- Use `logger.info()` for actions, not `console.log()`
- Never log session cookies or authentication headers
- Mask sensitive values in log output

### Caller Function Name

The logger auto-captures the calling function name in every log entry. No need to pass function names manually.

---

## Test Execution Workflow

### Standard Workflow

1. **Plan** — Use the test-planner agent to identify `@tc_` tags and page object methods needed
2. **Generate** — Use the test-generator agent to create specs, page objects, and test data
3. **Execute** — Use the test-executor agent to run targeted tests
4. **Heal** — Use the test-healer agent to fix broken selectors/waits
5. **Verify** — Run the full validation sequence before committing
6. **Report** — Generate and open the Mochawesome HTML report

### Validation Sequence (DoD)

When implementing or fixing behavior:
1. Run targeted tag/scenario first (fast feedback)
2. Run WDIO dry-run to catch discovery issues
3. Run broader regression selection before finalizing

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

---

## CI/CD Pipeline

### Pipeline Steps

```bash
# 1. Bootstrap
npm run agentic:bootstrap

# 2. Collect (verify discovery)
npm run collect

# 3. Run targeted test
npm run test:tag --tag="@tc_1"

# 4. Run full regression
npm run test:tag -- --mochaOpts.grep="@e2e_1"

# 5. Generate report
npm run report

# 6. Lint
npm run lint
```

### Pipeline Script

```bash
npm run pipeline
```

This runs all pipeline steps sequentially.

---

## Security

### Secrets Management

- **NEVER** hardcode secrets in code
- **ALWAYS** use `wdio.conf.js` `config` block for credentials
- **NEVER** commit passwords, tokens, or API keys
- **USE** `config.apiUsername`, `config.apiPassword`
- **NEVER** store secrets in JSON test data files
- **NEVER** log credentials in any form

### Logging Safety

- Never log sensitive data (passwords, tokens, PII)
- Sanitize URLs before logging
- Use `logger.info()` for actions, not `console.log()`
- Never log session cookies or authentication headers
- Mask sensitive values in log output

### CI/CD Security

- Use environment variables for secrets in pipeline
- Never expose `wdio.conf.js` credentials in logs
- Mask secrets in CI/CD output
- Rotate credentials regularly
- Use `config` block — never `.env` files

### Data Safety

- Test data files must not contain real credentials
- Use placeholder values in test data JSON
- Sanitize any data written to reports
- Do not include PII in screenshots or report attachments

---

## QA Engineering Standards

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

1. Extend `BasePage`
2. Define element getters with resilient selectors
3. Use `logger.info()` for each action
4. Return element references from action methods
5. Use explicit waits — never `time.sleep()`
6. Keep selectors in page objects only — never in specs

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

---

## Debugging

### When a Test Fails

1. Check console output for the error message
2. Check mochawesome report at `./reports/mochawesome.html`
3. Check screenshots in `./reports/`
4. Check application logs attached to each test
5. Review stack trace for the root cause

### Debug Commands

```bash
# Run single test
npm run test:tag --tag="@tc_1"

# Run with debug logging
LOG_LEVEL=debug npm run test:tag --tag="@tc_1"

# Run with visible browser (not headless)
HEADLESS=false npm run test:tag --tag="@tc_1"
```

### Common Failure Patterns

| Error | Root Cause | Fix |
|-------|-----------|-----|
| `invalid selector` | String passed to `$()` as CSS | Use `getTextElement()` for text lookups |
| `element not found` | Selector doesn't match DOM | Update page object getter |
| `element not clickable` | Element not visible/enabled | Add `waitForElementClickable()` |
| `stale element` | DOM changed after reference | Re-fetch element |
| `timeout exceeded` | Element never appears | Increase timeout or check page state |
| `assertion failed` | Expected vs actual mismatch | Check test data or expected value |

---

## Documentation Index

| Document | Purpose |
|----------|---------|
| `AGENTIC_GUIDE.md` | **This file** — Single unified agentic AI document |
| `.kilo/rules/` | Enforcement rules (always applied) |
| `.kilo/agent/` | Agent definitions |
| `.kilo/command/` | Command definitions |
| `README.md` | Project overview and setup |

---

## Agentic AI Directives Summary

When working in this repository:

1. **Read this file first** — `AGENTIC_GUIDE.md` is the single source of truth
2. **Follow the rules** in `.kilo/rules/`
3. **Use wdio.conf.js config block** for all settings — NO `.env` files
4. **Use `logger.info()` and Chai assertions** in page objects for proper reporting
5. **Run `npm run report` after test execution** to generate the Mochawesome HTML report
6. **Keep selectors in page objects only** — never in spec files
7. **Use explicit waits** via `waitForDisplayed`, `waitForEnabled` — never `time.sleep()`
8. **Follow the agentic workflow** — Plan → Generate → Execute → Heal → Verify → Report