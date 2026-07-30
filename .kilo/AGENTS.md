# AGENTS.md - Unified AI Agent Coding Guidelines

This document provides commands and code style guidelines for **all AI coding agents** operating in this WebDriverIO Mocha Chai test automation project. It applies to Kilo, Claude, and other AI platforms.

---

## Project Overview

- **Stack**: WebDriverIO (JS), Mocha, Chai, Mochawesome
- **Domain**: UI + API automation for `https://www.cheapflights.com.au` and `https://restful-booker.herokuapp.com`
- **Framework**: Page Object Model with WDIO BDD style

## Architecture

| Path | Description |
|------|-------------|
| `src/specs/web/**/*.spec.js` | UI E2E test specs with `@tc_` markers |
| `src/specs/api/**/*.spec.js` | API test specs |
| `src/pageobjects/` | Page objects with locators and actions |
| `src/pageobjects/` | API client/page objects |
| `src/utils/` | Configuration, helpers, logger utilities |
| `mochawesome-report/` | HTML test reports |

## Design Principles

- **Thin specs, rich pages**: Test specs delegate to page objects; page objects own locators, actions, and assertions
- **Data-driven**: Test data flows from `src/utils/data.manager.js` and JSON files
- **Marker-driven execution**: Use `@tc_` tags for test selection
- **Centralized config**: All settings in `config/wdio.shared.conf.js` and `src/utils/config.js`

---

## Build/Lint/Test Commands

```bash
# === Test Execution ===
npm run test                    # Run all tests
npm run test:web               # Run only web tests
npm run test:api               # Run only API tests
npm run test:tag --tag="@tc_1"  # Run specific tag
npm run test:tag --tag="@tc_1"               # Run @tc_1 specifically
npm run report                 # Generate and open HTML report

# === Verification ===
npx wdio run ./config/wdio.local.conf.js --suite regression --mochaOpts.grep="@tc_1"
npx eslint src/ --ext .js
```

## Agentic AI Directives

When working in this repository:

1. **Always read AGENTIC_GUIDE.md first** before implementing any test changes
2. **Follow the rules** in `.kilo/rules/`
3. **Use config/wdio.local.conf.js for all settings** — NO `.env` files in wdio config (use `.env` for local secrets only)
4. **Use `logger.info()` and Chai assertions** in page objects for proper reporting
5. **Run `npm run report` after test execution** to generate the Mochawesome HTML report
6. **Keep selectors in page objects only** — never in spec files
7. **Use explicit waits** via `waitForDisplayed`, `waitForEnabled` — never `time.sleep()`
8. **See `AGENTIC_GUIDE.md`** for the complete agentic AI workflow, agent definitions, and QA engineering standards

---

## VS Code Intellisense & Snippets

### Configuration Files

| File | Purpose |
|------|---------|
| `jsconfig.json` | JS project config for VS Code intellisense |
| `.vscode/settings.json` | Workspace-level VS Code settings |
| `.vscode/extensions.json` | Recommended extensions for the workspace |

### Key Settings for Intellisense

- **`jsconfig.json`**: `checkJs: true`, `moduleResolution: "bundler"`, `types: ["node"]`, `esModuleInterop: true`
- **`@types/node`**: Must be installed as dev dependency for Node.js global type definitions (`process`, `require`, etc.)
- **`moduleResolution: "bundler"`**: Required for ES modules (`"type": "module"` in `package.json`); `"node"` is outdated
- **`checkJs: true`**: Enables type checking and intellisense in `.js` files

### Intellisense Troubleshooting

1. If intellisense is not working, verify `jsconfig.json` has `checkJs: true` and `moduleResolution: "bundler"`
2. Ensure `@types/node` is installed (`npm install --save-dev @types/node`)
3. Check `.vscode/extensions.json` has recommended extensions (ESLint, Node/TS language features)
4. Verify `.vscode/settings.json` has `js/ts.implicitProjectConfig.checkJs: true`
5. Reload VS Code window after config changes (`Ctrl+Shift+P` → `Developer: Reload Window`)
6. Ensure `node_modules` is not excluded in `jsconfig.json` `exclude` array
