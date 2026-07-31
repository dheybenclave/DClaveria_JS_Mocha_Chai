# WebDriverIO Test Automation Framework

A scalable WebDriverIO + Mocha + Chai framework following the Page Object Model.

## Project Structure

```
├── config/                        # Environment-specific configurations
│   ├── wdio.shared.conf.js        # Base config (Framework hooks, log levels)
│   ├── wdio.local.conf.js         # Local execution (Headed mode, pretty logs)
│   └── wdio.ci.conf.js            # Build server execution (Headless, parallel limits)
├── src/
│   ├── components/                # Reusable global UI widgets
│   │   └── navbar.component.js
│   ├── fixtures/                  # Data-Driven json structures
│   │   ├── web/
│   │   │   └── flight_test_data.json
│   │   └── api/
│   │       └── booking_test_data.json
│   ├── pageobjects/               # UI Selectors and raw atomic actions
│   │   ├── base.page.js           # Houses custom wrapped utilities
│   │   ├── home.page.js
│   │   └── booking.api.js
│   ├── specs/                     # Mocha test suites
│   │   ├── web/
│   │   │   ├── home-page.spec.js
│   │   │   ├── flight-search-booking.spec.js
│   │   │   └── flight-search-results.spec.js
│   │   └── api/
│   │       └── booking.spec.js
│   └── utils/                     # Core system dependencies and helper functions
│       ├── logger.js              # Pino instantiation module
│       ├── config.js              # Centralized config
│       ├── api.helpers.js         # API request helpers
│       └── data.manager.js        # JSON test data loader
├── reports/                       # Mochawesome HTML reports
├── .env                           # Local secret variables (Ignored by git)
├── .kilo/                         # Kilo agentic AI configuration
│   ├── rules/                     # Always-applied coding/testing rules
│   ├── agent/                     # AI agent definitions
│   ├── command/                   # Kilo command definitions
│   └── AGENTS.md                  # Unified AI agent coding guidelines
├── package.json
└── jsconfig.json                  # VS Code intellisense config
```

## Getting Started

1. Install dependencies: `npm install`
2. Run local web tests: `npm run test:web`
3. Run API tests: `npm run test:api`
4. Run specific tag: `npm run test:tag --tag=@tc_1`
5. Generate report: `npm run report`

## Environment Variables

Copy `.env` and configure (`.env` is git-ignored):

```env
BASE_URL=https://www.cheapflights.com.au
API_BASE_URL=https://restful-booker.herokuapp.com
BROWSER=chrome
TIMEOUT=60000
HEADLESS=false
OPEN_MOCHAWESOME_REPORT=false
API_USERNAME=admin
API_PASSWORD=password123
```

## NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run test` | Run full regression suite (maxInstances=10) |
| `npm run test:parallel` | Run all tests in parallel (maxInstances=5) |
| `npm run test:web` | Run web tests only |
| `npm run test:api` | Run API tests only |
| `npm run test:tag` | Run by tag/marker |
| `npm run test:tag --tag=@tc_1` | Run TC_1 only |
| `npm run collect` | Verify test discovery (dry-run) |
| `npm run report` | Open Mochawesome HTML report |
| `npm run pipeline` | Run full CI/CD pipeline |
| `npm run agentic:bootstrap` | Validate environment |
| `npm run agentic:heal -- --test="@tc_6"` | Heal broken test |
| `npm run agentic:generate -- --requirement="..."` | Generate test from requirement |

## Documentation

| Document | Purpose |
|----------|---------|
| `AGENTIC_GUIDE.md` | Complete agentic QA workflow reference |
| `.kilo/AGENTS.md` | AI agent coding guidelines |
| `.kilo/rules/*.md` | Enforcement rules (always applied) |
| `.kilo/agent/*.md` | Agent definitions |
| `.kilo/command/*.md` | Command definitions |

## Reference Test Examples (MANDATORY Templates)

| Domain | Reference Test | File | What It Demonstrates |
|--------|---------------|------|---------------------|
| **WEB UI** | `@tc_5` | `src/specs/web/flight-search-results.spec.js` | Fresh session per test, data-driven, page object actions, descriptive assertions, proper cleanup |
| **API** | `@tc_7` | `src/specs/api/booking.spec.js` | Suite-level setup, per-test cleanup by ID, status validation, JSON property checks |

**Rule:** All new tests MUST follow these reference templates exactly.
- WEB UI tests → follow `@tc_5` pattern exactly
- API tests → follow `@tc_7` pattern exactly
