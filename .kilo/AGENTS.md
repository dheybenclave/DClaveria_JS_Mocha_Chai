# AGENTS.md - Unified AI Agent Coding Guidelines

This document provides commands and code style guidelines for **all AI coding agents** operating in this WebDriverIO Mocha Chai test automation project. It applies to Kilo, Claude, and other AI platforms.

---

## Project Overview

- **Stack**: WebDriverIO v9 (JS), Mocha, Chai, Mochawesome
- **Domain**: UI + API automation for `https://www.cheapflights.com.au` and `https://restful-booker.herokuapp.com`
- **Framework**: Page Object Model with WDIO BDD style
- **Logger**: Pino with in-memory buffer for Mochawesome report context

## Architecture

| Path | Description |
|------|-------------|
| `src/specs/web/**/*.spec.js` | UI E2E test specs with `@tc_` markers |
| `src/specs/api/**/*.spec.js` | API test specs |
| `src/pageobjects/` | Page objects (extends `BasePage` or components) |
| `src/pageobjects/base.page.js` | Base page with shared wait/action utilities |
| `src/components/` | Reusable UI components (extends `BasePage`) |
| `src/utils/` | Configuration, helpers, logger utilities |
| `src/fixtures/` | JSON test data files |
| `config/` | WDIO configuration (shared, local, CI) |
| `./reports/` | Mochawesome HTML reports |

## Design Principles

- **Thin specs, rich pages**: Test specs delegate to page objects; page objects own locators, actions, and assertions
- **Data-driven**: Test data flows from `src/utils/data.manager.js` and JSON fixtures
- **Marker-driven execution**: Use `@tc_` tags for test selection
- **Centralized config**: All settings in `config/wdio.shared.conf.js` and `src/utils/config.js`
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

## Agentic AI Directives

When working in this repository:

1. **Always read `AGENTIC_GUIDE.md` first** before implementing any test changes
2. **Read this file** for AI agent coding guidelines
3. **Follow the rules** in `.kilo/rules/`
4. **Use `config/wdio.shared.conf.js` for all settings** — NO `.env` files in wdio config (use `.env` for local secrets only)
5. **Use `logger.info()` and Chai assertions** in page objects for proper reporting
6. **Run `npm run report` after test execution** to generate the Mochawesome HTML report
7. **Keep selectors in page objects only** — never in spec files
8. **Use explicit waits** via `waitForDisplayed`, `waitForEnabled` — never `time.sleep()`
9. **Add `beforeEach` + `afterEach`** for parallel test stability
10. **See `AGENTIC_GUIDE.md`** for the complete agentic AI workflow, agent definitions, and QA engineering standards

---

## Coding Standards for AI Agents

### File Naming
- Page objects: `*.page.js`
- Specs: `*.spec.js`
- Components: `*.component.js`
- Utils: `*.js`

### Class Naming
- Page objects: `PascalCase` (e.g., `HomePage`, `SearchPage`)
- Components: `PascalCase` with `Component` suffix (e.g., `NavbarComponent`)
- Methods: `camelCase` (e.g., `searchFlights`, `clickSearchButton`)

### Import Order
```javascript
// 1. Third-party
import { expect } from 'chai';
import { Key } from 'webdriverio';

// 2. Internal utils
import { logger } from '../../utils/logger.js';
import { DataManager } from '../../utils/data.manager.js';

// 3. Page objects/components
import BasePage from '../base.page.js';
import NavbarComponent from '../components/navbar.component.js';
```

### Async Patterns
```javascript
// ✅ CORRECT - always await
async searchFlights(from, to) {
    await this.fromCityInput.setValue(from);
    return await this.searchButton.click();
}

// ❌ WRONG - missing await
async searchFlights(from, to) {
    this.fromCityInput.setValue(from);
    return this.searchButton.click();
}
```

### Error Handling
```javascript
// ✅ CORRECT
try {
    await this.loginButton.click();
} catch (error) {
    logger.info(`Login failed: ${error.message}`);
    throw error;
}
```

---

## Page Object Patterns for AI Agents

### Component Inheritance
```javascript
// Preferred: Extend component for shared UI
import NavbarComponent from '../components/navbar.component.js';
export default class HomePage extends NavbarComponent {
    get carButton() { return $('a[aria-label="Search for cars"]'); }
}
```

### Direct BasePage Extension
```javascript
// For pages without shared components
import BasePage from '../base.page.js';
export default class SearchPage extends BasePage {
    get searchInput() { return $('[data-testid="search-input"]'); }
}
```

### Element Getters
```javascript
// ✅ BEST - data-testid or semantic attributes
get fromCityInput() { return $('//input[@data-test-origin]'); }
get searchButton() { return $('[data-testid="search-button"], button[type="submit"]'); }

// ✅ GOOD - partial class match
get loginDialog() { return $('div[class*="unified-login"]'); }

// ❌ AVOID - brittle selectors
get logo() { return $('div.mc6t-logo > span:nth-child(2)'); }
```

### Action Methods
```javascript
async searchFlights(from, to, departureDate, returnDate, trip_type = null) {
    logger.info(`Searching flights: ${from} -> ${to}`);
    await this.selectLocationGroup(this.fromCityInput, from);
    await this.selectLocationGroup(this.toCityInput, to);
    await this.selectDateFromDialog(this.departureDateButton, departureDate);
    await this.selectDateFromDialog(this.returnDateButton, returnDate);
    
    if (trip_type !== null) {
        await this.selectTripType(trip_type);
    }
    
    await this.clickElement(this.searchButton);
    await this.waitForSearchResults();
}
```

### Parallel Stability Pattern
```javascript
beforeEach(async () => {
    homePage = new HomePage();
    await browser.reloadSession();
    await homePage.open();
    await homePage.waitForPageLoad();
});

afterEach(async () => {
    try {
        await homePage.open();
        await browser.deleteAllCookies();
        await browser.execute(() => {
            window.sessionStorage.clear();
            window.localStorage.clear();
        });
        await browser.execute(() => {
            const modals = document.querySelectorAll('[role="dialog"], .modal, .overlay');
            modals.forEach(m => m.remove());
        });
    } catch (error) {
        logger.info(`Cleanup encountered an issue: ${error.message}`);
    }
});
```

---

## Selector Strategy

### Priority Order
1. **`data-testid`** attributes
2. **Semantic attributes** — `href`, `aria-label`, `role`
3. **Partial attribute matches** — `[class*="partial"]`, `[href*="login"]`
4. **Text-based XPath** — Via `BasePage.getTextElement()`
5. **CSS class** — Only as last resort, use partial match

### Avoid Brittle Selectors
```javascript
// ❌ AVOID
$('div.mc6t-logo > span:nth-child(2)')
$('.btn-primary-large[type="submit"]')
$('div.Fxw9-result-item-container') // full class match
```

---

## Wait Strategy

### Always Use Explicit Waits
```javascript
// ❌ WRONG
// time.sleep(2);
// browser.pause(500);

// ✅ CORRECT
await this.logo.waitForDisplayed({ timeout: 15000 });
await browser.waitUntil(async () => {
    return await this.resultsContainer.isDisplayed();
}, { timeout: 60000 });
```

### Avoid Anti-Patterns
- **`waitForIntSecond()`** — uses `browser.pause()`, used in 7+ locations
- **Hardcoded `browser.pause(500)`** — arbitrary delays
- **Redundant waits before `clickElement`** — `clickElement` already waits

---

## Common Patterns

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

## Reference Examples (MANDATORY)

| Domain | Reference Test | File | What It Demonstrates |
|--------|---------------|------|---------------------|
| **WEB UI** | `@tc_5` | `src/specs/web/flight-search-results.spec.js` | Fresh session per test, data-driven, page object actions, descriptive assertions, proper cleanup |
| **API** | `@tc_7` | `src/specs/api/booking.spec.js` | Suite-level setup, per-test cleanup by ID, status validation, JSON property checks |

**Rule:** All new tests MUST follow these reference templates exactly.
- WEB UI tests → follow `@tc_5` pattern exactly
- API tests → follow `@tc_7` pattern exactly

---

## Troubleshooting

### Intellisense Not Working
1. Verify `jsconfig.json` has `checkJs: true` and `moduleResolution: "bundler"`
2. Ensure `@types/node` is installed
3. Check `.vscode/settings.json` has `js/ts.implicitProjectConfig.checkJs: true`
4. Reload VS Code window

### Common Issues
| Issue | Fix |
|-------|-----|
| Frontmatter validation error in `.kilo/` files | Content is written correctly; validation may be transient |
| Import path errors | Use relative paths from page object location |
| Parallel session conflicts | Add `beforeEach` + `browser.reloadSession()` |
| Stale elements | Re-fetch element reference in page object |
| Report not generated | Check `onComplete` hook in `wdio.shared.conf.js` |
