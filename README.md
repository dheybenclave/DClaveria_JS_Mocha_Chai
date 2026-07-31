# Dheo Claveria JS Mocha Chai — Test Automation Framework

A production-grade WebDriverIO + Mocha + Chai test automation framework with dual-domain coverage (Web UI + API), built around the Page Object Model, data-driven fixtures, Mochawesome reporting, and an agentic AI workflow.

---

## Table of Contents

- [What This Framework Does](#what-this-framework-does)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Test Coverage](#test-coverage)
- [Project Structure](#project-structure)
- [Architecture Deep Dive](#architecture-deep-dive)
- [Page Object Model](#page-object-model)
- [Data-Driven Testing](#data-driven-testing)
- [Utilities & Helpers](#utilities--helpers)
- [Reporting](#reporting)
- [Agentic AI Workflow](#agentic-ai-workflow)
- [CI/CD Pipeline](#cicd-pipeline)
- [How to Run](#how-to-run)
- [Best Practices & Guardrails](#best-practices--guardrails)
- [Reference Templates](#reference-templates)

---

## What This Framework Does

| Domain | Application | What Is Tested |
|--------|-------------|----------------|
| **Web UI** | [cheapflights.com.au](https://www.cheapflights.com.au) | Home page elements, flight search, booking flow, error handling |
| **API** | [restful-booker.herokuapp.com](https://restful-booker.herokuapp.com) | Booking CRUD lifecycle: Create, Read, Filter, Update (PUT/PATCH), Delete |

The framework validates real-world user journeys end-to-end while maintaining clean separation between test logic, page interactions, and raw API calls.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | ES Modules (`"type": "module"`) |
| Browser Automation | WebDriverIO | v9.x |
| Test Orchestrator | Mocha | BDD style |
| Assertions | Chai | `expect` syntax with descriptive messages |
| Reporting | Mochawesome + Marge | HTML reports with charts, screenshots, log context |
| Logger | Pino + Pino Pretty | Structured JSON logs, in-memory buffer for reports |
| Config Management | dotenv | `.env` for local secrets |
| Agentic AI | Kilo | Test planning, generation, healing, execution |

---

## Key Features

### Dual-Domain Coverage
- **Web UI tests**: Browser-driven E2E flows on a live travel site
- **API tests**: Pure REST contract testing with full CRUD lifecycle

### Page Object Model (POM)
- Thin specs delegate all interactions to page objects
- Reusable components (`NavbarComponent`) extend `BasePage`
- API page object (`BookingAPIBase`) centralizes all HTTP operations

### Data-Driven Testing
- JSON fixtures under `src/fixtures/` feed test data
- `DataManager` utility loads data by file name and key
- Same test logic runs across multiple data sets without code changes

### Robust Wait Strategy
- Custom `waitForPageLoad`, `waitForElementVisible`, `waitForElementClickable`
- `waitForLoadingToFinish` handles spinners, skeletons, and ARIA loading states
- No `time.sleep()` or arbitrary `browser.pause()` in production paths

### Parallel-Safe Execution
- `beforeEach` + `browser.reloadSession()` guarantees fresh browser state
- `afterEach` clears cookies, localStorage, sessionStorage
- API tests clean up created bookings by ID after each test

### Comprehensive Logging
- Every test step logged with `logger.info()`
- Logs auto-attached to Mochawesome report context per test
- Logger auto-captures calling function name from stack trace

### Error Resilience
- Negative test cases for invalid inputs, non-existent resources, and edge conditions
- Reusable `validateErrorThrown` POM method wraps try/catch for negative assertions
- Custom error messages on all Chai assertions

### Agentic AI Integration
- Built-in agents for planning, generating, healing, and executing tests
- Kilo integration via `.kilo/` configuration
- Self-healing for broken selectors and flaky waits

---

## Test Coverage

### Web UI Tests (`src/specs/web/`)

| Tag | Test | Description |
|-----|------|-------------|
| `@tc_1` | `home-page.spec.js` | Positive: logo, car/stay nav, sign-in dialog visibility. Negative: non-existent text assertion, URL validation |
| `@tc_3` | `flight-search-booking.spec.js` | Positive: valid flight search with results validation |
| `@tc_4` | `flight-search-booking.spec.js` | Negative: invalid city search errors, same-city validation, required field errors |
| `@tc_5` | `flight-search-results.spec.js` | Positive: flight search results display, structured result extraction |
| `@tc_6` | `flight-search-results.spec.js` | Negative: restricted destination error, no flights found scenarios |

### API Tests (`src/specs/api/`)

| Tag | Test | Description |
|-----|------|-------------|
| `@api_tc_1` | `booking.spec.js` | Positive: create booking with valid payload, validate response structure |
| `@api_tc_2` | `booking.spec.js` | Negative: invalid `totalprice` string type not persisted |
| `@api_tc_3` | `booking.spec.js` | Positive: retrieve booking by ID, validate all fields |
| `@api_tc_4` | `booking.spec.js` | Positive: filter bookings by firstname + lastname, verify created booking in results |
| `@api_tc_5` | `booking.spec.js` | Negative: retrieve non-existent booking (404) |
| `@api_tc_6` | `booking.spec.js` | Positive: full update booking with PUT |
| `@api_tc_7` | `booking.spec.js` | Positive: partial update booking with PATCH |
| `@api_tc_8` | `booking.spec.js` | Negative: update non-existent booking (405) |
| `@api_tc_9` | `booking.spec.js` | Positive: delete existing booking, validate success status |
| `@api_tc_10` | `booking.spec.js` | Negative: delete non-existent booking (405) |

### Coverage Summary
- **10 API test cases** covering full CRUD lifecycle + negative scenarios
- **5 Web UI test cases** covering navigation, search, results, and error handling
- **15 total tagged test cases** (`@tc_1` through `@tc_6`, `@api_tc_1` through `@api_tc_10`)
- Suite markers: `@smoke`, `@e2e_1`, `@api`, `@api_e2e_1`

---

## Project Structure

```
├── config/                                    # WDIO environment configurations
│   ├── wdio.shared.conf.js                    # Base config: hooks, reporters, suites, capabilities
│   ├── wdio.local.conf.js                     # Local override: headed mode, pretty logs, report open
│   └── wdio.ci.conf.js                        # CI override: headless, minimal logs
├── src/
│   ├── components/                            # Reusable UI widgets (extend BasePage)
│   │   └── navbar.component.js                # Logo, header, loading indicators
│   ├── fixtures/                              # JSON test data files
│   │   ├── web/
│   │   │   └── flight_test_data.json          # Valid/invalid/restricted/nofound flight data
│   │   └── api/
│   │       └── booking_test_data.json         # Valid/invalid bookings, update data, filters
│   ├── pageobjects/                           # Page Object Model classes
│   │   ├── base.page.js                       # Core utilities: waits, clicks, text, scroll, screenshots
│   │   ├── home.page.js                       # Cheapflights home: search, dates, results, validation
│   │   └── booking.api.js                     # Restful Booker API: CRUD + reusable validators
│   ├── specs/                                 # Mocha test suites
│   │   ├── web/
│   │   │   ├── home-page.spec.js              # @tc_1 — home page elements + negatives
│   │   │   ├── flight-search-booking.spec.js  # @tc_3, @tc_4 — search + invalid params
│   │   │   └── flight-search-results.spec.js  # @tc_5, @tc_6 — results + error states
│   │   └── api/
│   │       └── booking.spec.js                # @api_tc_1–@api_tc_10 — full CRUD + negatives
│   └── utils/                                 # Core system dependencies
│       ├── logger.js                          # Pino logger with in-memory buffer + report context
│       ├── config.js                          # Centralized CONFIG + PATHS from .env
│       ├── data.manager.js                    # JSON fixture loader (DataManager)
│       ├── api.helpers.js                     # APIRequestHelper: auth tokens, payloads, validation
│       └── utils.js                           # Date formatting utility
├── reports/                                   # Mochawesome HTML reports (auto-generated)
├── .env                                       # Local secrets (git-ignored)
├── .kilo/                                     # Kilo agentic AI configuration
│   ├── rules/                                 # Always-applied enforcement rules
│   ├── agent/                                 # AI agent definitions
│   ├── command/                               # Kilo command definitions
│   ├── scripts/                               # Bootstrap, heal, generate scripts
│   ├── kilo.json                              # Kilo configuration
│   └── AGENTS.md                              # Unified AI agent coding guidelines
├── .vscode/
│   └── settings.json                          # Workspace settings
├── package.json                               # Dependencies, scripts, metadata
├── jsconfig.json                              # VS Code IntelliSense
├── AGENTIC_GUIDE.md                           # Complete agentic QA workflow reference
└── README.md                                  # This file
```

---

## Architecture Deep Dive

### Framework Layers

```
┌─────────────────────────────────────────────────────────────┐
│  Spec Layer (src/specs/)                                   │
│  - Thin test files with @tc_N markers                      │
│  - Delegate all actions to page objects                    │
│  - DataManager loads JSON fixtures                         │
└───────────────────────┬─────────────────────────────────────┘
                        │ calls
┌───────────────────────▼─────────────────────────────────────┐
│  Page Object Layer (src/pageobjects/)                      │
│  - Web: HomePage extends NavbarComponent extends BasePage  │
│  - API: BookingAPIBase (standalone POM)                    │
│  - Owns all selectors, actions, validations                │
│  - Every action uses logger.info() + Chai expect           │
└───────────────────────┬─────────────────────────────────────┘
                        │ uses
┌───────────────────────▼─────────────────────────────────────┐
│  Utility Layer (src/utils/)                                │
│  - logger.js: Pino structured logging + report context     │
│  - config.js: CONFIG + PATHS from .env                     │
│  - data.manager.js: JSON fixture loading                   │
│  - api.helpers.js: Auth tokens, payload builders           │
│  - utils.js: Date formatting                               │
└───────────────────────┬─────────────────────────────────────┘
                        │ reads
┌───────────────────────▼─────────────────────────────────────┐
│  Config Layer (config/ + .env)                             │
│  - wdio.shared.conf.js: baseUrl, capabilities, reporters  │
│  - wdio.local.conf.js / wdio.ci.conf.js: env overrides    │
│  - .env: secrets (API_USERNAME, API_PASSWORD)              │
└─────────────────────────────────────────────────────────────┘
```

### Configuration Architecture

| Config Source | Purpose | Example Values |
|---------------|---------|----------------|
| `.env` (local) | Secrets and local overrides | `API_USERNAME`, `API_PASSWORD`, `HEADLESS=false` |
| `src/utils/config.js` | Centralized `CONFIG` + `PATHS` objects | `BASE_URL`, `TIMEOUT`, `SCREENSHOT_DIR` |
| `config/wdio.shared.conf.js` | Base WDIO config (shared across all environments) | `baseUrl`, `apiBaseUrl`, `capabilities`, `reporters`, `suites` |
| `config/wdio.local.conf.js` | Local execution overrides | Headed Chrome, pretty logs, open report |
| `config/wdio.ci.conf.js` | CI execution overrides | Headless mode, minimal output |

---

## Page Object Model

### Component Hierarchy

```
BasePage (src/pageobjects/base.page.js)
├── NavbarComponent (src/components/navbar.component.js)
│   ├── HomePage (src/pageobjects/home.page.js)
│   │   └── Used by: home-page.spec.js, flight-search-booking.spec.js, flight-search-results.spec.js
│   └── (extensible for other pages with shared navbar)
└── (BasePage utilities available to all pages)

BookingAPIBase (src/pageobjects/booking.api.js)
└── Used by: booking.spec.js
```

### BasePage Capabilities

| Method | Purpose |
|--------|---------|
| `open(path)` | Navigate to base URL + path, assert URL |
| `clickElement(el)` | Click with visibility wait |
| `clickElementByText(text)` | Click by visible text via XPath |
| `enterText(el, value)` | Clear + set value + wait for load |
| `setText(el, value)` | Set value without Enter key |
| `getTextElement(text)` | Find element by visible text (XPath) |
| `waitForElementVisible(el, timeout)` | Explicit wait for visibility |
| `waitForElementClickable(el, timeout)` | Wait for visible + enabled |
| `waitForPageLoad()` | Wait for URL + DOM ready + loaders gone |
| `waitForLoadingToFinish()` | Wait for spinners/skeletons to disappear |
| `waitForElementToDisappear(el, timeout)` | Wait for element removal |
| `scrollToElement(el)` | Scroll element into viewport |
| `takeScreenshot(name)` | Timestamped screenshot capture |
| `verifyContainsText(text)` | Assert element contains expected text |
| `verifyEqualsText(text, message)` | Assert element text equals expected |

### BookingAPIBase Capabilities

| Method | Purpose | Returns |
|--------|---------|---------|
| `getAuthToken()` | Generate/cached Basic auth token from config credentials | `Promise<string>` |
| `createBooking(data)` | POST new booking with payload | `Promise<{response, status, json}>` |
| `getBookingById(id)` | GET booking by ID | `Promise<{response, status, json}>` |
| `getBookingsByFilter(filters)` | GET bookings filtered by query params | `Promise<{response, status, json}>` |
| `updateBooking(id, data, partial)` | PUT or PATCH booking by ID | `Promise<{response, status, json}>` |
| `partialUpdateBooking(id, data)` | PATCH booking by ID | `Promise<{response, status, json}>` |
| `deleteBooking(id)` | DELETE booking by ID | `Promise<{response, status}>` |

### Reusable POM Validators

All validation logic lives in the page object. Specs call these methods instead of writing inline assertions.

| Validator Method | Used By | Validates |
|------------------|---------|-----------|
| `validateStatusResponse(status, expected)` | TC_1, TC_2 | HTTP status code matches expected |
| `validateBookingCreation(response, expectedData)` | TC_1 | Response has `bookingid` + `booking`, fields match payload |
| `validateGetBookingResponse(result, expectedData)` | TC_3 | GET response status + all fields + booking dates |
| `validateFilterResponse(result, createdBookingId)` | TC_4 | Filter is array, non-empty, contains created booking |
| `validateUpdateResponse(result, expectedData)` | TC_6, TC_7 | PUT/PATCH status + updated fields + dates |
| `validateDeleteResponse(result)` | TC_9 | DELETE returns 200/201/204 |
| `validateErrorThrown(action)` | TC_5, TC_8, TC_10 | Wraps async action, asserts error is thrown |

---

## Data-Driven Testing

### Web Test Data (`src/fixtures/web/flight_test_data.json`)

```json
{
  "valid_flights": [
    { "from": "Boracay, Philippines (MPH)", "to": "Kalibo, Philippines (KLO)", ... }
  ],
  "invalid_flights": [
    { "from": "InvalidCityDheoClaveria", "to": "Boracay, Philippines (MPH)", ... }
  ],
  "restricted_flights": [
    { "from": "Rasht, Iran (RAS)", "to": "Sharjah, United Arab Emirates (SHJ)", ... }
  ],
  "nofound_flights": [
    { "from": "Boracay, Philippines (MPH)", "to": "Kalibo, Philippines (KLO)", ... }
  ]
}
```

### API Test Data (`src/fixtures/api/booking_test_data.json`)

```json
{
  "valid_bookings": [
    { "firstname": "John", "lastname": "Doe", "totalprice": 150, ... }
  ],
  "invalid_bookings": [
    { "firstname": "", "lastname": "", "totalprice": 150, ... }
  ],
  "update_data": [
    { "firstname": "UpdatedJohn", "lastname": "UpdatedDoe", "totalprice": 250, ... }
  ],
  "filter_data": {
    "firstname": "John",
    "lastname": "Doe"
  }
}
```

### DataManager Usage

```javascript
import { DataManager } from '../../utils/data.manager.js';

// Web data
const flightData = DataManager.getWebData('flight_test_data.json').valid_flights[0];

// API data
const bookingData = DataManager.getApiData('booking_test_data.json').valid_bookings[0];
```

---

## Utilities & Helpers

### Logger (`src/utils/logger.js`)

- Pino-based structured logging with `pino-pretty` for local development
- In-memory log buffer captures all `logger.info()` calls per test
- Logs auto-attached to Mochawesome report via `afterTest` hook
- Auto-captures calling function name via stack trace

### Config (`src/utils/config.js`)

```javascript
export const CONFIG = {
  BASE_URL: 'https://www.cheapflights.com.au',
  API_BASE_URL: 'https://restful-booker.herokuapp.com',
  BROWSER: 'chrome',
  TIMEOUT: 60000,
  API_USERNAME: process.env.API_USERNAME,
  API_PASSWORD: process.env.API_PASSWORD,
  OPEN_MOCHAWESOME_REPORT: true
};

export const PATHS = {
  TEST_DATA_WEB: '../fixtures/web',
  TEST_DATA_API: '../fixtures/api',
  MOCHA_REPORT: '../reports',
  LOGS: '../logs'
};
```

### API Helpers (`src/utils/api.helpers.js`)

```javascript
export class APIRequestHelper {
  static createAuthToken(username, password)     // Base64 Basic auth
  static getCommonHeaders(authToken)             // JSON headers + optional auth
  static getBookingPayload(overrides)            // Default booking + field overrides
  static getBookingDatesPayload(overrides)       // Default dates + overrides
  static validateBookingResponse(booking)        // Field presence validation
}
```

---

## Reporting

### Mochawesome HTML Report

- **Location**: `reports/mochawesome.html`
- **Auto-generated** after every test run via `onComplete` hook
- **Includes**:
  - Test pass/fail status with duration
  - Screenshots on failure (auto-captured)
  - Application logs attached per test (from Pino buffer)
  - Charts and summary statistics
  - Inline report (all assets embedded)

### Report Generation Flow

```
onPrepare → Clean reports dir, create fresh dir
  ↓
Test Execution → Each test logs to in-memory buffer
  ↓
afterTest → Clear cookies/storage, attach logs to report context, screenshot on failure
  ↓
onComplete → Merge JSON results, dedupe suites, generate HTML via marge, auto-open
```

### Opening Reports

```bash
npm run report
# Opens ./reports/mochawesome.html in default browser
```

---

## Agentic AI Workflow

The framework includes a complete agentic QA workflow powered by Kilo.

### Available Agents

| Agent | Purpose |
|-------|---------|
| **Test Planner** | Analyze requirements, identify `@tc_` tags, audit page objects, plan coverage |
| **Test Generator** | Generate specs, page objects, and test data from natural language requirements |
| **Test Executor** | Run targeted tests, analyze results, generate reports |
| **Test Healer** | Automatically fix broken selectors, waits, and assertions |

### Workflow Stages

```
Plan → Generate → Execute → Heal → Verify → Report
```

### Commands

```bash
npm run agentic:bootstrap      # Validate environment and dependencies
npm run agentic:heal -- --test="@tc_6"           # Auto-heal broken test
npm run agentic:generate -- --requirement="user can search flights"  # Generate from req
```

---

## CI/CD Pipeline

### Full Pipeline

```bash
npm run pipeline
```

Executes sequentially:
1. `agentic:bootstrap` — Validate environment
2. `collect` — WDIO dry-run to verify test discovery
3. `test:tag --tag=@tc_1` — Fast feedback on smoke test
4. `test:tag --tag=@e2e_1` — Full regression suite
5. `report` — Generate and open HTML report

### GitHub Actions

The repository includes `.github/workflows/main.yml` for automated CI execution.

---

## How to Run

### Prerequisites

```bash
# 1. Clone the repository
git clone <repository-url>
cd DClaveria_JS_Mocha_Chai

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env   # if .env.example exists
# Edit .env with API credentials and settings
```

### Quick Start Commands

| Command | What It Does |
|---------|-------------|
| `npm run test` | Run full suite (maxInstances=10) |
| `npm run test:parallel` | Run all tests in parallel (maxInstances=5) |
| `npm run test:web` | Run web UI tests only |
| `npm run test:api` | Run API tests only |
| `npm run test:tag --tag="@tc_1"` | Run specific test case by tag |
| `npm run test:web:tag --tag="@tc_5"` | Run web test filtered by tag |
| `npm run test:api:tag --tag="@api_tc_7"` | Run API test filtered by tag |
| `npm run collect` | Verify test discovery (dry-run) |
| `npm run report` | Generate and open Mochawesome HTML report |
| `npm run pipeline` | Run full CI/CD pipeline |

### Environment Variables

Create a `.env` file in the project root (git-ignored):

```env
# Web Application
BASE_URL=https://www.cheapflights.com.au

# API Application
API_BASE_URL=https://restful-booker.herokuapp.com
API_USERNAME=adminname
API_PASSWORD=adminpass

# Browser Configuration
BROWSER=chrome
HEADLESS=false
TIMEOUT=60000

# Reporting
OPEN_MOCHAWESOME_REPORT=true
```

### Debug Commands

```bash
# Run single test with visible browser
HEADLESS=false npm run test:tag --tag="@tc_5"

# Run with debug logging
LOG_LEVEL=debug npm run test:tag --tag="@tc_5"

# Run with single instance for stability
npm run test:tag --tag="@tc_5" -- --maxInstances=1

# Lint
npx eslint src/ --ext .js
```

---

## Best Practices & Guardrails

### Non-Negotiable Rules

1. **NO selectors in spec files** — All selectors live in page objects (`src/pageobjects/`)
2. **NO `time.sleep()`** — Use `waitForDisplayed`, `waitForEnabled`, `browser.waitUntil`
3. **NO long spec files** — Keep specs thin; delegate logic to page objects
4. **NO hardcoded secrets** — Use `config` block in `wdio.shared.conf.js` and `.env`
5. **ALWAYS run dry-run before commit** — `npm run collect` to verify discovery
6. **ALWAYS tag tests with `@tc_N` markers**
7. **ALWAYS use semantic selectors** — `data-testid`, `aria-label`, `role`, partial class matches
8. **ALWAYS add `beforeEach`** for parallel stability
9. **ALWAYS use `logger.info()`** for proper reporting
10. **ALWAYS use Chai `expect`** for assertions with descriptive messages

### Selector Priority

| Priority | Strategy | Example |
|----------|----------|---------|
| 1 | `data-testid` | `$('//input[@data-test-origin]')` |
| 2 | Semantic attributes | `$('a[aria-label="Search for flights"]')` |
| 3 | Partial attribute matches | `$('div[class*="unified-login"]')` |
| 4 | Text-based XPath | `this.getTextElement('Car hire.')` |
| 5 | CSS class (last resort) | `$('div[class*="loading"]')` |
| 6 | Multi Handling Element Result | `$$('div[class="Fxw9-result-item-container"]')` |

### Wait Strategy

| Method | Use Case |
|--------|----------|
| `waitForDisplayed({ timeout })` | Element exists AND is visible |
| `waitForEnabled({ timeout })` | Element is interactive |
| `waitForElementClickable()` | Visible + enabled combined |
| `waitForPageLoad()` | URL change + DOM ready + loaders gone |
| `waitForLoadingToFinish()` | Spinners/skeletons/ARIA loading gone |
| `browser.waitUntil()` | Custom polling condition |

### Definition of Done

Before committing any test changes:
- [ ] Scenario(s) pass locally
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

## Reference Templates

All new tests MUST follow these reference templates exactly.

### WEB UI Template: `@tc_5`

**File**: `src/specs/web/flight-search-results.spec.js`

```javascript
describe('@smoke @search_results Validate and Verify Search Flight Results', () => {
  const homePage = new HomePage();
  const commonComponent = new NavbarComponent();

  beforeEach(async () => {
    await browser.reloadSession();
    logger.info('Navigating to home page');
  });

  it('@tc_5 @positive Search Flight Results Checking', async () => {
    logger.info('TC_5: [Positive Testing] Validating search results display');
    const flightData = DataManager.getWebData('flight_test_data.json').valid_flights[1];

    await homePage.open();
    await homePage.isOnHomePage();
    await homePage.waitForPageLoad();
    await commonComponent.isLogoDisplayed();

    await homePage.clickFlightsButton();
    await homePage.waitForPageLoad();

    await homePage.searchFlights(
      flightData.from, flightData.to,
      flightData.departure_date, flightData.return_date, flightData.trip_type
    );
    await homePage.waitForSearchResults();

    const hasResults = await homePage.hasSearchResults(
      flightData.from, flightData.to,
      flightData.departure_date, flightData.return_date
    );
    expect(hasResults).to.be.true;

    const results = await homePage.getSearchResults();
    expect(results).to.have.length.greaterThan(0);
  });
});
```

### API Template: `@api_tc_7`

**File**: `src/specs/api/booking.spec.js`

```javascript
describe('@api @api_e2e_1 Restful Booker API Automation', () => {
  let bookingAPI;
  let createdBookingId;

  before(() => {
    bookingAPI = new BookingAPIBase();
    logger.info('API test suite initialized');
  });

  afterEach(async () => {
    if (createdBookingId) {
      try {
        logger.info(`Cleaning up booking ID: ${createdBookingId}`);
        await bookingAPI.deleteBooking(createdBookingId);
        logger.info(`Cleanup completed for booking ${createdBookingId}`);
      } catch (error) {
        logger.error(`Cleanup failed: ${error.message}`);
      }
      createdBookingId = null;
    }
  });

  it('@api_tc_7 should partially update an existing booking with PATCH', async () => {
    logger.info('TC_API_7: Creating booking before partial update');
    const validBooking = DataManager.getApiData('booking_test_data.json').valid_bookings[1];
    const createResult = await bookingAPI.createBooking(validBooking);
    createdBookingId = createResult.json.bookingid;

    const updateData = DataManager.getApiData('booking_test_data.json').update_data[0];
    logger.info(`TC_API_7: Partially updating booking ID: ${createdBookingId}`);
    const result = await bookingAPI.partialUpdateBooking(createdBookingId, updateData);

    bookingAPI.validateUpdateResponse(result, updateData);

    logger.info(`TC_API_7: Booking partially updated successfully for ID: ${createdBookingId}`);
  });
});
```

---

## Documentation

| Document | Purpose |
|----------|---------|
| `README.md` | **This file** — Full project overview, coverage, and usage |
| `AGENTIC_GUIDE.md` | Complete agentic QA workflow, agents, commands, rules |
| `.kilo/AGENTS.md` | AI agent coding guidelines and standards |
| `.kilo/rules/*.md` | Always-applied enforcement rules |
| `.kilo/agent/*.md` | Agent definitions and prompts |
| `.kilo/command/*.md` | Kilo command definitions |

---

## License

ISC
