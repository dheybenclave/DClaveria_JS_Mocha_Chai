# AGENTIC_GUIDE.md - Kilo Agentic QA Workflow

This guide provides the unified workflow for Kilo AI agents operating in this WebDriverIO Mocha Chai project.

## Overview

The agentic QA workflow enables Kilo to:
- Generate test cases from requirements
- Heal broken tests automatically
- Bootstrap and verify test environments
- Execute targeted test runs with Mochawesome reporting

## Platform

| Resource | Path |
|----------|------|
| **Config** | `.kilo/kilo.json` |
| **Agents** | `.kilo/agent/` |
| **Commands** | `.kilo/command/` |
| **Rules** | `.kilo/rules/` |
| **Scripts** | `.kilo/scripts/` |

## Unified Rules (Kilo)

The 5 core rule files:

1. **common-testing.md** — Validation sequence, DoD, stability rules
2. **wdio-mocha-chai-framework.md** — Workflow, paths, commands
3. **js-coding-style.md** — ES6+, async/await, naming conventions
4. **js-security.md** — Secrets management, logging safety
5. **test-automation-guardrails.md** — Selectors, waits, WDIO discipline

## Test Execution Matrix

| Need | Command |
|------|---------|
| Run all tests | `npm run test` |
| Run in parallel | `npm run test:parallel` |
| Run specific test case | `npm run test:tc1` |
| Run by tag | `npm run test:tag -- --mochaOpts.grep="@tc_1"` |
| Run by keyword | `npx wdio run ./wdio.conf.js --suite regression --mochaOpts.grep="search"` |
| Visible browser (debug) | `HEADLESS=false npm run test:tc1` |
| HTML report | `npm run report` |
| Verify discovery | `npx wdio run ./wdio.conf.js --suite regression --dry-run` |
| Bootstrap env | `npm run agentic:bootstrap` |
| Self-heal test | `npm run agentic:heal -- --test="@tc_6"` |
| Generate test | `npm run agentic:generate -- --requirement="user can search flights"` |

## Core Guardrails (Non-Negotiable)

1. **NO selectors in spec files** — All selectors in page objects (`src/pages/`)
2. **NO time.sleep()** — Use `waitForDisplayed`, `waitForEnabled`, `browser.waitUntil`
3. **NO long spec files** — Keep specs focused and minimal; delegate complex logic to page objects
4. **NO hardcoded secrets** — Use `wdio.conf.js` `config` block
5. **ALWAYS run dry-run before commit** to verify test discovery
6. **ALWAYS tag tests with `@tc_N` markers**
7. **ALWAYS use semantic selectors** — `[data-testid]`, `getByRole` equivalents in WDIO
8. **ALWAYS use Mochawesome report** — Primary report is `mochawesome-report/report.html`

## Agentic Workflow

### 1. Bootstrap
```bash
npm run agentic:bootstrap
```
Validates Node.js, WDIO CLI, config load, and report generation.

### 2. Plan
Use Test Planner agent to analyze requirements and define `@tc_` tags.

### 3. Generate
```bash
npm run agentic:generate -- --requirement="..."
```
Creates spec file, page object methods, and test data.

### 4. Execute
```bash
npm run test:tc1
```
Runs test with Mochawesome reporter and step logging.

### 5. Heal
```bash
npm run agentic:heal -- --test="@tc_6"
```
Fixes broken selectors and waits based on failure analysis.

### 6. Report
```bash
npm run report
```
Generates and opens `mochawesome-report/report.html` with steps and assertions.

## Reporting

- **Primary Report**: Mochawesome HTML (`mochawesome-report/report.html`)
- **Auto-open**: Enabled via `--config.openMochawesomeReport=true`
- **Steps**: Logged via `logger.step()` in console
- **Assertions**: Chai `expect()` in page objects for proper test status

## Notes

- Kilo-only setup — no Claude references
- All config in `wdio.conf.js` — no `.env` files
- Report auto-generated after each run
- Parallel execution supported via `maxInstances`
