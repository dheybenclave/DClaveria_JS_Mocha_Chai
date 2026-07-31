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

- **Stack**: WebDriverIO (JS) v9, Mocha, Chai, Mochawesome
- **Domain**: UI + API automation for `https://www.cheapflights.com.au` and `https://restful-booker.herokuapp.com`
- **Framework**: Page Object Model with WDIO BDD style
- **Reporting**: Mochawesome HTML report in `./reports/`
- **Logger**: Pino with in-memory buffer for report context

---

## Architecture

| Path | Description |
|------|-------------|
| `src/specs/web/**/*.spec.js` | UI E2E test specs with `@tc_` markers |
| `src/specs/api/**/*.spec.js` | API test specs |
| `src/pageobjects/` | Web page objects with locators and actions |
| `src/pageobjects/base.page.js` | Base page with shared wait/assertion utilities |
| `src/components/` | Reusable UI components (Navbar, etc.) that extend BasePage |
| `src/utils/` | Configuration, helpers, logger utilities |
| `src/fixtures/` | JSON test data files |
| `config/` | WDIO configuration (shared, local, CI) |
| `./reports/` | Mochawesome HTML reports |
| `.kilo/` | Kilo agentic AI configuration |

---

## Directory Structure

```
├── config/
│   ├── wdio.shared.conf.js    # Base WDIO config (shared across environments)
│   ├── wdio.local.conf.js     # Local execution (headed, pretty logs)
│   └── wdio.ci.conf.js        # CI execution (headless, minimal logs)
├── src/
│   ├── components/
│   │   └── navbar.component.js # Reusable global navbar/header component
│   ├── fixtures/
│   │   ├── web/
│   │   │   └── flight_test_data.json   # Web test data
│   │   └── api/
│   │       └── booking_test_data.json  # API test data
│   ├── pageobjects/
│   │   ├── base.page.js        # Base page with shared utilities
│   │   ├── home.page.js        # Home page object
│   │   └── booking.api.js      # API page object for Restful Booker CRUD
│   ├── specs/
│   │   ├── web/
│   │   │   ├── home-page.spec.js
│   │   │   ├── flight-search-booking.spec.js
│   │   │   └── flight-search-results.spec.js
│   │   └── api/
│   │       └── booking.spec.js
│   └── utils/
│       ├── logger.js           # Pino logger with in-memory buffer
│       ├── config.js           # Centralized CONFIG object
│       ├── data.manager.js     # JSON test data loader
│       └── utils.js            # Date formatting utility
├── .kilo/
│   ├── rules/                  # Always-applied coding/testing rules
│   ├── agent/                  # AI agent definitions
│   ├── command/                # Kilo command definitions
│   ├── scripts/                # Bootstrap, heal, generate scripts
│   ├── kilo.json               # Kilo configuration
│   └── AGENTS.md               # Unified AI agent coding guidelines
├── .vscode/
│   ├── launch.json             # Debug configurations for WDIO
│   └── settings.json           # VS Code workspace settings
├── package.json                # Dependencies and npm scripts
├── .gitignore
└── README.md
```

---

## Design Principles

- **Thin specs, rich pages**: Test specs delegate to page objects; page objects own locators, actions, and assertions
- **Data-driven**: Test data flows from JSON fixtures via `DataManager`
- **Marker-driven execution**: Use `@tc_` tags for test selection
- **Centralized config**: All settings in `config/wdio.shared.conf.js` and `src/utils/config.js`
- **Mochawesome reporting**: Primary report is `./reports/mochawesome.html`
- **Parallel-safe**: Each test gets fresh session via `beforeEach` + `browser.reloadSession()`

---

## Build/Lint/Test Commands

```bash
# === Test Execution ===
npm run test                    # Run all tests (maxInstances=10)
npm run test:parallel          # Run all tests in parallel (maxInstances=5)
npm run test:chrome            # Run with Chrome capability override
npm run test:firefox           # Run with Firefox capability override
npm run test:api               # Run API specs only
npm run test:web               # Run web specs only
npm run test:tag --tag="@tc_1" # Run specific tag
npm run test:web:tag           # Run web specs filtered by tag
npm run test:api:tag           # Run API specs filtered by tag
npm run wdio                   # Direct WDIO run
npm run collect                # Verify test discovery (dry-run)
npm run test:ci                # CI/CD: headless run via wdio.ci.conf.js
npm run report                 # Generate and open HTML report
npm run pipeline               # Run full CI/CD pipeline

# === Agentic AI ===
npm run agentic:bootstrap      # Validate environment
npm run agentic:heal -- --test="@tc_6"  # Heal broken test
npm run agentic:generate -- --requirement="user can search flights"  # Generate test

# === Verification ===
npx wdio run ./config/wdio.local.conf.js --suite regression --mochaOpts.grep="@tc_1"
npx eslint src/ --ext .js
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
3. Audit existing page objects for reusable methods
4. Plan new page object methods required
5. Define test data structure
6. Create test execution plan

#### Test Executor
1. Run targeted tests by tag for fast feedback
2. Run WDIO dry-run to catch discovery issues
3. Run broader regression before finalizing
4. Generate and open HTML report
5. Report execution status and key metrics

#### Test Healer
1. Identify failing test from mochawesome report
2. Analyze error message and stack trace
3. Classify failure type (selector, wait, assertion, data, session)
4. Propose and apply fixes to page objects or specs
5. Re-run the healed test to verify
6. Run broader regression to confirm no regressions

#### Test Generator
1. Parse natural language requirements into test scenarios
2. Audit existing page objects for reusable methods
3. **Detect test type and apply mandatory template:**
   - **WEB UI** → use `@tc_5` template (`src/specs/web/flight-search-results.spec.js`)
   - **API** → use `@tc_7` template (`src/specs/api/booking.spec.js`)
4. Create/update page object methods
5. Generate spec files matching the mandatory template structure
6. Create test data JSON files
7. Add `logger.info()` calls for all steps
8. Run collection to verify discovery
9. Run the new test to verify

---

## Core Guardrails (Non-Negotiable)

1. **NO selectors in spec files** — All selectors in page objects (`src/pageobjects/`)
2. **NO time.sleep()** — Use `waitForDisplayed`, `waitForEnabled`, `browser.waitUntil`
3. **NO long spec files** — Keep specs focused and minimal; delegate complex logic to page objects
4. **NO hardcoded secrets** — Use `config` block in `wdio.shared.conf.js`
5. **ALWAYS run with --dry-run before commit** to verify test discovery
6. **ALWAYS tag tests with `@tc_N` markers**
7. **ALWAYS use semantic selectors** — `[data-testid]`, `getByRole` equivalents in WDIO
8. **ALWAYS add beforeEach/afterEach** for parallel stability
9. **ALWAYS use `logger.info()`** for proper reporting
10. **ALWAYS use Chai `expect`** for assertions with descriptive messages

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

Page objects extend `BasePage` directly or extend reusable components (`NavbarComponent`) that themselves extend `BasePage`. Components encapsulate shared UI widgets and their associated selectors/actions.

```javascript
// Extending a component (preferred for pages with shared navbar/header)
import NavbarComponent from '../components/navbar.component.js';
import { logger } from '../../utils/logger.js';
import { expect } from 'chai';

export default class HomePage extends NavbarComponent {
  get carButton() {
    return $('a[aria-label="Search for cars"]');
  }

  async clickCarButton() {
    logger.info('Clicking car button');
    await this.clickElement(this.carButton);
  }
}
```

```javascript
// Extending BasePage directly (for pages without shared components)
import BasePage from '../base.page.js';
import { logger } from '../../utils/logger.js';
import { expect } from 'chai';

export default class SearchPage extends BasePage {
  get searchInput() {
    return $('[data-testid="search-input"]');
  }

  async enterSearch(query) {
    logger.info('Entering search query');
    await this.enterText(this.searchInput, query);
  }
}
```

### Rules

1. Every page object extends `BasePage` or a component that extends `BasePage`
2. Every element is a getter
3. Every action uses `logger.info()` at the start
4. Every action returns the element reference
5. Every assertion uses Chai `expect`
6. No selectors in spec files — only in page objects

### Reference Test Examples

| Domain | Reference Test | File | What It Demonstrates |
|--------|---------------|------|---------------------|
| **WEB UI** | `@tc_5` | `src/specs/web/flight-search-results.spec.js` | Fresh session per test, data-driven, page object actions, descriptive assertions, proper cleanup |
| **API** | `@tc_7` | `src/specs/api/booking.spec.js` | Suite-level setup, per-test cleanup by ID, status validation, JSON property checks |

**Rule:** All new tests MUST follow these reference templates exactly.
- WEB UI tests → follow `@tc_5` pattern exactly
- API tests → follow `@tc_7` pattern exactly

### MANDATORY Test Generation Templates

When generating new tests, you MUST use these reference templates:

| Test Type | Trigger Keywords | Mandatory Template | Reference File |
|-----------|-----------------|-------------------|----------------|
| **WEB UI** | web, UI, frontend, browser, page, flight, search, click, form, navigate | `@tc_5` | `src/specs/web/flight-search-results.spec.js` |
| **API** | api, backend, rest, endpoint, booking, crud, post, put, patch, delete, fetch | `@tc_7` | `src/specs/api/booking.spec.js` |

**Rule:** When the user requests new test generation, automatically detect the test type from their request and apply the corresponding mandatory template. When in doubt, default to `@tc_5` for web/UI, `@tc_7` for API.

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
    return $('//input[@data-test-origin]');
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
| `waitForPageLoad()` | URL + DOM ready + loaders gone |
| `browser.waitUntil()` | Custom condition |
| `waitForLoadingToFinish()` | Loading indicators disappear |

### Anti-Patterns to Avoid

- **`waitForIntSecond()`** — uses `browser.pause()`, used in 7+ locations in codebase
- **Hardcoded `browser.pause(500)`** — arbitrary delays in `selectLocationGroup`
- **Redundant `waitForElementVisible` before `clickElement`** — `clickElement` already waits

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
| `logger.error(msg)` | Failures |

### Safety Rules

- Never log sensitive data (passwords, tokens, PII)
- Sanitize URLs before logging
- Use `logger.info()` for actions, not `console.log()`
- Never log session cookies or authentication headers
- Mask sensitive values in log output

### Caller Function Name

The logger auto-captures the calling function name in every log entry via stack trace parsing. No need to pass function names manually.

### Report Integration

Logs are buffered in memory and attached to Mochawesome report context via `afterTest` hook in `config/wdio.shared.conf.js`.

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
- [ ] Parallel tests pass (no session conflicts)
- [ ] `afterEach` cleanup runs successfully

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
npm run test:parallel

# 5. Generate report
npm run report

# 6. Lint
npx eslint src/ --ext .js

# 7. CI/CD headless verification
npm run test:ci
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
- **ALWAYS** use `config` block in `config/wdio.shared.conf.js` for credentials
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
- Never expose `config/wdio.shared.conf.js` credentials in logs
- Mask secrets in CI/CD output
- Rotate credentials regularly

### Data Safety

- Test data files must not contain real credentials
- Use placeholder values in test data JSON
- Sanitize any data written to reports
- Do not include PII in screenshots or report attachments

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

# Run with single instance for stability
npm run test:tag --tag="@tc_1" -- --maxInstances=1
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
| `session conflict` | Shared session ID in parallel | Add `beforeEach` cleanup, fresh instance |
| `WebdriverBidiException` | JS click with object instead of selector | Pass `element.selector` string |

---

## Documentation Index

| Document | Purpose |
|----------|---------|
| `AGENTIC_GUIDE.md` | **This file** — Complete agentic QA workflow reference |
| `AGENTS.md` | Unified AI agent coding guidelines |
| `.kilo/rules/*.md` | Enforcement rules (always applied) |
| `.kilo/agent/*.md` | Agent definitions |
| `.kilo/command/*.md` | Command definitions |
| `README.md` | Project overview and setup |

---

## Agentic AI Directives Summary

When working in this repository:

1. **Read `AGENTIC_GUIDE.md` first** — it's the single source of truth
2. **Read `AGENTS.md`** for AI agent coding guidelines
3. **Follow the rules** in `.kilo/rules/`
4. **Use `config/wdio.shared.conf.js` for all settings** — NO `.env` files in wdio config
5. **Use `logger.info()` and Chai assertions** in page objects for proper reporting
6. **Run `npm run report` after test execution** to generate the Mochawesome HTML report
7. **Keep selectors in page objects only** — never in spec files
8. **Use explicit waits** via `waitForDisplayed`, `waitForEnabled` — never `time.sleep()`
9. **Follow the agentic workflow** — Plan → Generate → Execute → Heal → Verify → Report
10. **Add `beforeEach` + `afterEach`** for parallel test stability