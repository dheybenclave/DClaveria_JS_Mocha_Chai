# WebDriverIO Test Automation Framework

A scalable WebDriverIO + Mocha + Chai framework following the Page Object Model.

## Project Structure

```
├── config/                        # Environment-specific configurations
│   ├── wdio.shared.conf.js        # Base config (Framework hooks, log levels)
│   ├── wdio.local.conf.js         # Local execution (Headed mode, pretty logs)
│   └── wdio.ci.conf.js            # Build server execution (Headless, parallel limits)
├── src/
│   ├── components/                # Reusable global UI widgets (Header, Sidebar, Modals)
│   │   └── navbar.component.js
│   ├── fixtures/                  # Data-Driven json structures
│   │   ├── flight_test_data.json
│   │   └── booking_test_data.json
│   ├── pageobjects/               # UI Selectors and raw atomic actions
│   │   ├── base.page.js           # Houses custom wrapped utilities (waitForElementVisible)
│   │   ├── home.page.js
│   │   ├── search.page.js
│   │   └── booking.api.js
│   ├── specs/                     # Mocha test suites (Contains ONLY it() blocks and assertions)
│   │   ├── web/
│   │   │   └── cheapflights.spec.js
│   │   └── api/
│   │       └── booking.spec.js
│   └── utils/                     # Core system dependencies and helper functions
│       ├── logger.js              # Pino instantiation module
│       ├── config.js              # Centralized config from wdio.conf.js
│       ├── api.helpers.js         # API request helpers
│       └── data.manager.js        # JSON test data loader
├── logs/                          # Automatically created by logger for CI artifacts
│   ├── combined.log
│   └── error.log
├── reports/                       # Mochawesome HTML reports
├── .env                           # Local secret variables (Ignored by git)
├── .github/
│   └── workflows/
│       └── ci-tests.yml
├── package.json
└── jsconfig.json                  # Clean absolute paths configuration
```

## Getting Started

1. Install dependencies: `npm install`
2. Run local web tests: `npm run test:web`
3. Run API tests: `npm run test:api`
4. Run specific tag: `npm run test:tag -- --mochaOpts.grep="@tc_1"`
5. Generate report: `npm run report`

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
API_USERNAME=
API_PASSWORD=
```

## NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run test` | Run full regression suite |
| `npm run test:web` | Run web tests only |
| `npm run test:api` | Run API tests only |
| `npm run test:tag` | Run by tag/marker |
| `npm run test:tc1` | Run TC_1 only |
| `npm run report` | Open Mochawesome HTML report |
| `npm run lint` | Run ESLint |
