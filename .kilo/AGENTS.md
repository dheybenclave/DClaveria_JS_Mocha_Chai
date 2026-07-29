# AGENTS.md - Kilo AI Agent Coding Guidelines

This document provides commands and code style guidelines for **all AI coding agents** operating in this WebDriverIO Mocha Chai test automation project. It applies to Kilo only.

---

## Project Overview

- **Stack**: WebDriverIO (JS), Mocha, Chai, Mochawesome
- **Domain**: UI + API automation for `https://www.cheapflights.com.au` and `https://restful-booker.herokuapp.com`
- **Framework**: Page Object Model with WDIO BDD style
- **Report**: Mochawesome HTML report
- **Agentic AI**: Kilo-only (`.kilo/`)

## Architecture

| Path | Description |
|------|-------------|
| `tests/web/**/*.spec.js` | UI E2E test specs with `@tc_` markers |
| `tests/api/**/*.spec.js` | API test specs |
| `src/pages/web/` | Page objects with locators and actions |
| `src/pages/api/` | API client/page objects |
| `src/utils/` | Configuration, helpers, logger utilities |
| `mochawesome-report/` | HTML test reports |
| `.kilo/` | Kilo agentic AI configuration |

## Design Principles

- **Thin specs, rich pages**: Test specs delegate to page objects; page objects own locators, actions, and assertions
- **Data-driven**: Test data flows from `src/utils/config.js` and JSON files
- **Marker-driven execution**: Use `@tc_` tags for test selection
- **Centralized config**: All settings in `wdio.conf.js` `config` block and `src/utils/config.js`
- **Mochawesome reporting**: Primary report is `mochawesome-report/report.html`

---

## Build/Lint/Test Commands

```bash
# === Test Execution ===
npm run test                    # Run all tests
npm run test:parallel          # Run all tests in parallel
npm run test:web               # Run only web tests
npm run test:api               # Run only API tests
npm run test:tag -- --mochaOpts.grep="@tc_1"  # Run specific tag
npm run test:tc1               # Run @tc_1 specifically
npm run report                 # Generate and open HTML report

# === Agentic AI ===
npm run agentic:bootstrap      # Validate environment
npm run agentic:heal -- --test="@tc_6"  # Heal broken test
npm run agentic:generate -- --requirement="user can search flights"  # Generate test

# === Verification ===
npx wdio run ./wdio.conf.js --suite regression --mochaOpts.grep="@tc_1"
npx eslint src/ tests/ --ext .js
```

## Agentic AI Directives

When working in this repository:

1. **Always read AGENTIC_GUIDE.md first** before implementing any test changes
2. **Follow the 5 core rules** in `.kilo/rules/`
3. **Use wdio.conf.js config block** for all settings — NO `.env` files
4. **Use `logger.step()` and Chai assertions** in page objects for proper reporting
5. **Run `npm run report` after test execution** to generate the Mochawesome HTML report
6. **Keep selectors in page objects only** — never in spec files
7. **Use explicit waits** via `waitForDisplayed`, `waitForEnabled` — never `time.sleep()`
