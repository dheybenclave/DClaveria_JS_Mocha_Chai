# Web and API Automation Framework

JavaScript automation framework using **WebDriverIO**, **Mocha**, **Chai**, and **Mochawesome** for E2E web and API testing.

## Project Structure

```
DClaveria_JS_Mocha_Chai/
├── .github/
│   ├── agents/
│   │   ├── wdio-test-generator.agent.md
│   │   ├── wdio-test-healer.agent.md
│   │   ├── wdio-test-planner.agent.md
│   │   └── wdio-test-executor.agent.md
│   └── workflows/
│       ├── main.yml
│       └── agentic-ci-cd.yml
├── .kilo/
│   ├── .kilo/AGENTS.md
│   ├── AGENTIC_GUIDE.md
│   ├── kilo.json
│   ├── agent/
│   │   ├── test-planner.md
│   │   ├── test-executor.md
│   │   ├── test-healer.md
│   │   ├── test-generator.md
│   ├── command/
│   │   ├── test.md
│   │   ├── collect.md
│   │   ├── heal.md
│   │   ├── generate.md
│   │   ├── bootstrap.md
│   │   ├── debug.md
│   │   ├── verify.md
│   │   ├── pipeline.md
│   │   └── report.md
│   ├── rules/
│   │   ├── common-testing.md
│   │   ├── wdio-mocha-chai-framework.md
│   │   ├── js-coding-style.md
│   │   ├── js-security.md
│   │   ├── test-automation-guardrails.md
│   │   └── qa-engineering.md
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
├── reports/
├── mochawesome-report/
├── scripts/
│   └── generate-serenity-report.js
├── AGENTIC_GUIDE.md
├── README.md
├── package.json
└── wdio.conf.js
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure settings in `wdio.conf.js` under the `config` block:
   - `baseUrl` — Web application URL
   - `apiBaseUrl` — API base URL
   - `apiUsername` — API authentication username
   - `apiPassword` — API authentication password
   - `openMochawesomeReport` — Auto-open HTML report after test run

## Run Tests

### Local

```bash
# Run all tests
npm run test

# Run web tests only
npm run test:web

# Run API tests only
npm run test:api

# Run specific test case
npm run test:tc1

# Run by tag
npm run test:tag -- --mochaOpts.grep="@tc_1"

# Run in parallel
npm run test:parallel

# Dry-run (verify test discovery)
npm run collect

# Full pipeline (bootstrap → collect → test → report → lint)
npm run pipeline

# Generate and open report
npm run report

# Lint
npm run lint
```

### GitHub Actions

The workflow supports tag-based test runs, parallel execution, and branch targeting via `workflow_dispatch` inputs.

| Input | Description | Example |
|-------|-------------|---------|
| `test_tag` | Run specific `@tc_` tag | `@tc_1`, `@e2e_1`, `@smoke`, `@api_e2e_1` |
| `test_filter` | Custom mocha grep filter | `--mochaOpts.grep="@tc_1"` |
| `run_parallel` | Enable parallel execution | `true` / `false` |
| `target_branch` | Target branch for execution | `main`, `develop`, `feature/x` |
| `open_report` | Auto-open mochawesome report | `true` / `false` |

#### Running specific tags

1. Go to **Actions** → **WDIO Tests** → **Run workflow**
2. Set `test_tag` to the desired tag (e.g., `@tc_1`)
3. Set `run_parallel` to `true` for parallel execution
4. Set `target_branch` to the branch to test (leave empty for current branch)
5. Click **Run workflow**

#### Workflow jobs

| Job | Description |
|-----|-------------|
| `setup` | Checks out code, installs deps, determines filter/parallel settings |
| `test` | Runs WDIO tests with tag filter or full regression |
| `lint` | Runs ESLint on source and test files |
| `report` | Generates combined HTML report and comments PR with summary |

## Test Coverage

### Web Automation (Cheapflights)
- ✅ Logo validation
- ✅ Login button validation
- ✅ Car hire and stay button verification
- ✅ Text content assertions

### API Automation (Restful Booker)
- ✅ Create Booking API
- ✅ Get Booking API
- ✅ Update Booking API
- ✅ Delete Booking API
- ✅ Response field assertions

## Report

Mochawesome HTML reports are generated in `./reports/` directory.

```bash
# Generate and open report
npm run report
```

The report auto-opens after test execution when `openMochawesomeReport: true` is set in `wdio.conf.js`.

## Agentic AI (Kilo)

This project uses Kilo AI for agentic test automation.

### Available Agents

| Agent | Purpose |
|-------|---------|
| **Test Planner** | Plan test coverage and strategy from requirements |
| **Test Executor** | Execute and monitor test runs, analyze results |
| **Test Healer** | Automatically fix broken selectors and waits |
| **Test Generator** | Generate new test specs, page objects, and test data |

### Commands

```bash
# Validate environment
npm run agentic:bootstrap

# Self-heal broken test
npm run agentic:heal -- --test="@tc_6"

# Generate test from requirement
npm run agentic:generate -- --requirement="user can search flights"

# Run full pipeline
npm run pipeline
```

### Agentic AI Directives

When working in this repository:

1. **Always read AGENTIC_GUIDE.md first** before implementing any test changes
2. **Follow the rules** in `.kilo/rules/`
3. **Use wdio.conf.js config block** for all settings — NO `.env` files
4. **Use `logger.info()` and Chai assertions** in page objects for proper reporting
5. **Run `npm run report` after test execution** to generate the Mochawesome HTML report
6. **Keep selectors in page objects only** — never in spec files
7. **Use explicit waits** via `waitForDisplayed`, `waitForEnabled` — never `time.sleep()`

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
- Hierarchical child loggers
- Automatic caller function name in logs

## Documentation

| Document | Purpose |
|----------|---------|
| `AGENTIC_GUIDE.md` | Single unified agentic AI document — workflow, agents, rules, standards |
| `.kilo/rules/` | Enforcement rules (always applied) |
| `.kilo/agent/` | Agent definitions |
| `.kilo/command/` | Command definitions |
| `README.md` | Project overview and setup |
