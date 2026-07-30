# Project State Memory

## Goal
Configure a WebDriverIO project with dynamic tag filtering, proper CI/CD workflows, VS Code IntelliSense, and stable page object methods.

## Constraints & Preferences
- Fix VS Code IntelliSense/go-to-definition after project restructuring
- Use dotenv for environment variable management
- Maintain standard WebDriverIO directory layout
- `main.yml` should only run specific tags, not full regression
- Separate workflows for web regression and API regression
- Dynamic npm scripts for tag filtering instead of hardcoded per-tag scripts
- Use `wdio.ci.conf.js` for CI workflows, `wdio.local.conf.js` for local/debug
- XPath parent-relative selectors for location group elements

## Progress
### Done
- Restructured project to standard layout: `src/pageobjects/`, `src/specs/`, `src/fixtures/`, `config/wdio.shared.conf.js`, `config/wdio.local.conf.js`, `config/wdio.ci.conf.js`
- Added JSDoc annotations to pageobjects, API, and utility files
- Created `.env`, `.github/workflows/main.yml`, `.github/workflows/regression-web.yml`, `.github/workflows/regression-api.yml`, `README.md`, `src/components/navbar.component.js`
- Updated `package.json` with dynamic tag scripts (`test:tag`, `test:web:tag`, `test:api:tag`)
- Updated `jsconfig.json` with path aliases and proper module resolution for IntelliSense
- Updated all documentation (`README.md`, `AGENTIC_GUIDE.md`, `.kilo/*.md`) to use new tag commands
- Created `.vscode/launch.json` with 7 debug configurations for tag-specific runs
- Removed ESLint from pipeline (lint job and script)
- Fixed ESM import error: `cheapflights.spec.js` now uses named import for `DataManager`
- Fixed logger redundancy: `getTestLogger` returns base logger instead of child with test metadata
- Fixed `enterText` in `base.page.js` to use `getElement` instead of `getTextElement`
- Added `waitForIntSecond(seconds)` to `base.page.js`
- Fixed `selectLocationGroup` in `home.page.js` with XPath parent-relative selectors and resilient remove button handling
- Created `src/utils/date.utils.js` with `DateUtils.formatDateDisplay(isoDate)` for date formatting
- Updated `.github/workflows/main.yml` to use absolute paths (`${{ github.workspace }}`) for spec discovery
- Updated `.github/workflows/main.yml` to use `wdio.ci.conf.js` instead of `wdio.local.conf.js`
- Removed redundant `@api` tags from `src/specs/api/booking.spec.js`
- Updated `regression-api.yml` to run API only (removed web job)
- Fixed `jsconfig.json` to include proper path mappings and include patterns
- Created `.vscode/settings.json` and `.vscode/extensions.json` for IntelliSense enforcement

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- `main.yml` handles only tag-specific runs; `regression-web.yml` and `regression-api.yml` handle full regression runs for their respective domains
- Using `%npm_config_tag%` for dynamic tag passing in npm scripts on Windows
- Using `--suite` instead of `--specs` with glob strings in debug configs to avoid WDIO parser errors
- XPath parent-relative selectors for location group remove/value display elements
- `waitForIntSecond(seconds)` uses `browser.pause()` with logging
- `DateUtils.formatDateDisplay()` converts `YYYY-MM-DD` to `Month DD. YYYY`

## Next Steps
- (none)

## Critical Context
- `selectLocationGroup` uses XPath `parent::div//div[@aria-label="Remove value"]` for remove button and `parent::div//div[contains(@class,"neb-item-value")]` for value verification
- `waitForExist({ reverse: true })` throws on timeout; use `waitForIntSecond` instead for non-critical waits
- `verifyElementTextValue` does not exist in `BasePage`; use `waitForElementVisible` + `getText` + `expect` instead
- WDIO dry-run discovered 0 specs when using relative glob paths; fixed with `${{ github.workspace }}` absolute paths
- Stale VS Code tabs pointing to restructured files break IntelliSense; close stale tabs and reload window
- `getTestLogger` no longer binds `test`/`suite` to every log entry; mochawesome reporter handles test association via `addContext`
- `DataManager` is a static utility class with only named exports; use `import { DataManager }` not `import DataManager`
- Debug configs must use `--suite` not `--specs` with glob strings due to WDIO v9 CLI parser behavior
- `main.yml` uses `wdio.ci.conf.js` (headless, no report auto-open); `wdio.local.conf.js` is for local debugging only

## Relevant Files
- `config/wdio.shared.conf.js`: base WDIO config with suites (regression, web, api) and absolute path resolution
- `config/wdio.ci.conf.js`: CI-optimized config (headless, maxInstances 5, no report auto-open)
- `config/wdio.local.conf.js`: local config (headed, report auto-open)
- `.github/workflows/main.yml`: tag-specific runs (test_tag required, runs web+api specs)
- `.github/workflows/regression-web.yml`: full web regression
- `.github/workflows/regression-api.yml`: full API regression
- `src/pageobjects/home.page.js`: contains `selectLocationGroup`, `searchFlights`, date getters
- `src/pageobjects/base.page.js`: contains `enterText`, `waitForIntSecond`, `getElement`, `getSelectorName`
- `src/specs/web/cheapflights.spec.js`: uses named `DataManager` import
- `src/specs/api/booking.spec.js`: API booking tests with redundant `@api` tags removed
- `src/utils/logger.js`: `getTestLogger` returns base logger
- `src/utils/date.utils.js`: `DateUtils.formatDateDisplay()` for date formatting
- `src/utils/config.js`: reads from `process.env` via `dotenv`
- `package.json`: dynamic tag scripts and pipeline
- `.vscode/launch.json`: debug configurations for tag-specific runs
- `jsconfig.json`: path aliases for IntelliSense
- `.env`: environment variables (gitignored)
