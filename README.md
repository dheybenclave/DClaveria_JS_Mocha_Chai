# Web and API Automation Framework

JavaScript automation framework using **WebDriverIO**, **Mocha**, **Chai**, and **Mochawesome** for E2E web and API testing.

## Project Structure

```
DClaveria_JS_Mocha_Chai/
├── .github/
│   ├── agents/
│   │   ├── wdio-test-generator.agent.md
│   │   ├── wdio-test-healer.agent.md
│   │   └── wdio-test-planner.agent.md
│   └── workflows/
│       ├── main.yml
│       └── agentic-ci-cd.yml
├── .kilo/
│   ├── AGENTS.md
│   ├── AGENTIC_GUIDE.md
│   ├── kilo.json
│   ├── agent/
│   │   ├── test-generator.md
│   │   ├── test-healer.md
│   │   ├── test-planner.md
│   │   ├── test-executor.md
│   │   ├── test-architect.md
│   │   ├── product-owner.md
│   │   └── scrum-master.md
│   ├── command/
│   │   ├── test.md
│   │   ├── collect.md
│   │   ├── heal.md
│   │   ├── generate.md
│   │   ├── bootstrap.md
│   │   ├── debug.md
│   │   └── verify.md
│   ├── rules/
│   │   ├── common-testing.md
│   │   ├── wdio-mocha-chai-framework.md
│   │   ├── js-coding-style.md
│   │   ├── js-security.md
│   │   └── test-automation-guardrails.md
│   └── scripts/
│       ├── bootstrap.js
│       ├── heal.js
│       └── generate.js
├── src/
│   ├── pages/
│   │   ├── web/
│   │   │   ├── base.page.js
│   │   │   └── cheapflights/
│   │   │       ├── home.page.js
│   │   │       ├── search.page.js
│   │   │       └── login.page.js
│   │   └── api/
│   │       └── restful-booker/
│   │           └── booking.api.js
│   └── utils/
│       ├── config.js
│       ├── logger.js
│       ├── data.manager.js
│       └── api.helpers.js
├── test-data/
│   ├── web/
│   │   └── flight_test_data.json
│   └── api/
│       └── booking_test_data.json
├── tests/
│   ├── web/
│   │   └── cheapflights/
│   │       └── cheapflights.spec.js
│   └── api/
│       └── booking/
│           └── booking.spec.js
├── scripts/
│   └── generate-report.js
├── mochawesome-report/
├── package.json
└── wdio.conf.js
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure settings in `wdio.conf.js` under the `config` block:
   - `baseUrl` - Web application URL
   - `apiBaseUrl` - API base URL
   - `apiUsername` - API authentication username
   - `apiPassword` - API authentication password

## Run Tests

```bash
# Run all tests
npm run test

# Run web tests only
npm run test:web

# Run API tests only
npm run test:api

# Run specific tag
npm run test:tag -- --mochaOpts.grep="@tc_1"

# Run specific test case
npm run test:tc1

# Run in parallel
npm run test:parallel
```

## Test Coverage

### Web Automation (Cheapflights)
- ✅ Logo validation
- ✅ Login button validation
- ✅ Flight search functionality
- ✅ Search results assertions
- ✅ UI element position assertions

### API Automation (Restful Booker)
- ✅ Create Booking API
- ✅ Get Booking API
- ✅ Update Booking API
- ✅ Delete Booking API
- ✅ Response field assertions

## Report

Mochawesome HTML reports are generated in `mochawesome-report/` directory.

```bash
# Generate and open report
npm run report
```

The report auto-opens after test execution when `--config.openMochawesomeReport=true` is passed.

## Agentic AI (Kilo)

This project uses Kilo AI for agentic test automation.

### Bootstrap
```bash
npm run agentic:bootstrap
```

### Self-Heal
```bash
npm run agentic:heal -- --test="@tc_6"
```

### Generate Test
```bash
npm run agentic:generate -- --requirement="user can search flights"
```

### Agents
- **Test Generator** - Creates tests from requirements
- **Test Healer** - Fixes broken selectors and waits
- **Test Planner** - Plans test coverage and strategy
- **Test Executor** - Executes and monitors test runs
- **Test Architect** - Designs framework architecture

## Framework Features

- Page Object Model (POM) pattern
- Mocha BDD style tests
- Chai assertions
- WebDriverIO v9
- Data-driven testing
- API request helpers
- Screenshot on failure
- Mochawesome HTML reporting
- Kilo agentic AI integration
