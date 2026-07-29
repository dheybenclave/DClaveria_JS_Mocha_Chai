# AGENTIC_GUIDE.md - Agentic QA Workflow

This guide provides the unified workflow for AI agents operating in this WebDriverIO Mocha Chai project.

## Overview

The agentic QA workflow enables AI agents to:
- Generate test cases from requirements
- Heal broken tests automatically
- Bootstrap and verify test environments
- Execute targeted test runs with proper reporting

## Platform Support

| Platform | Config Path | Agent Definitions | Commands | Skills |
|----------|-------------|-------------------|----------|--------|
| **Kilo** | `.kilo/kilo.json` | `.kilo/agent/` | `.kilo/command/` | `.kilo/skills/` |
| **Claude** | `.claude/settings.json` | `.github/agents/` | `.claude/commands/` | — |

## Unified Rules (All Platforms)

The 5 core rule files are synchronized across all platforms:

1. **common-testing.md** — Validation sequence, DoD, stability rules
2. **wdio-mocha-chai-framework.md** — Workflow, paths, commands
3. **js-coding-style.md** — ES6+, async/await, naming conventions
4. **js-security.md** — Secrets management, logging safety
5. **test-automation-guardrails.md** — Selectors, waits, WDIO discipline

**Synchronized copies**: Rules are maintained in both `.kilo/rules/` and `.claude/rules/`.

## Test Execution Matrix

| Need | Command |
|------|---------|
| Run all tests | `npm run test` |
| Run specific test case | `npm run test:tc1` |
| Run by tag | `npm run test:tag -- --mochaOpts.grep="@tc_1"` |
| Run by keyword | `npx wdio run ./wdio.conf.js --suite regression --mochaOpts.grep="search"` |
| Parallel execution | Configured via `maxInstances` in wdio.conf.js |
| Visible browser (debug) | `HEADLESS=false npm run test:tc1` |
| HTML report | `npm run report` |
| Verify discovery | `npx wdio run ./wdio.conf.js --suite regression --dry-run` |

## Core Guardrails (Non-Negotiable)

1. **NO selectors in spec files** — All selectors in page objects (`src/pages/`)
2. **NO time.sleep()** — Use `waitForDisplayed`, `waitForEnabled`, `browser.waitUntil`
3. **NO long spec files** — Keep specs focused and minimal; delegate complex logic to page objects
4. **NO hardcoded secrets** — Use `wdio.conf.js` `config` block
5. **ALWAYS run with --dry-run before commit** to verify test discovery
6. **ALWAYS tag tests with `@tc_N` markers**
7. **ALWAYS use semantic selectors** — `[data-testid]`, `getByRole` equivalents in WDIO

## Agentic Commands

### Bootstrap
```bash
npm run agentic:bootstrap
```
Validates environment, dependencies, and test collection.

### Self-Heal
```bash
npm run agentic:heal -- --test="@tc_6"
```
Automatically fixes broken selectors and waits for specified test.

### Generate Test
```bash
npm run agentic:generate -- --requirement="user can search flights"
```
Generates test case from natural language requirement.
