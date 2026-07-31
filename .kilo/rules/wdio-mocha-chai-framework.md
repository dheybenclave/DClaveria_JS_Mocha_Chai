---
description: "Repository-specific WebDriverIO + Mocha + Chai framework conventions and execution workflow."
alwaysApply: true
---

# WebDriverIO Mocha Chai Framework Conventions

## Key Paths

- Specs: `src/specs/web/`, `src/specs/api/`
- Pages: `src/pageobjects/`
- Components: `src/components/`
- Config: `config/wdio.shared.conf.js`
- Utilities: `src/utils/`
- Reports: `reports/`

## Workflow

1. Update or add test behavior in spec files.
2. Implement page-level actions/assertions.
3. Add `logger.info()` for reporting.
4. Run targeted tag/scenario and then dry-run.
5. Run parallel tests to verify no session conflicts.

## Command Quickstart

```bash
npm run test:tag --tag="@tc_1"
npm run report
npx wdio run ./config/wdio.local.conf.js --suite regression --dry-run
```

## Reference Examples (MANDATORY Templates)

| Domain | Reference Test | File | What It Demonstrates |
|--------|---------------|------|---------------------|
| **WEB UI** | `@tc_5` | `src/specs/web/flight-search-results.spec.js` | Fresh session per test, data-driven, page object actions, descriptive assertions, proper cleanup |
| **API** | `@tc_7` | `src/specs/api/booking.spec.js` | Suite-level setup, per-test cleanup by ID, status validation, JSON property checks |

**Rule:** All new tests MUST follow these reference templates exactly.
- WEB UI tests → follow `@tc_5` pattern exactly
- API tests → follow `@tc_7` pattern exactly

## Reliability Guardrails

- Do not put selectors directly in spec files.
- Keep waits centralized and deterministic.
- Preserve existing marker naming and report output paths.
- Use `config` block in `config/wdio.shared.conf.js` for all settings.
- Add `beforeEach` + `afterEach` for parallel stability.
- Create new `HomePage` instance in `beforeEach`, not `before`.
- Use `browser.reloadSession()` in `beforeEach` for fresh browser state.
- Clear cookies, localStorage, sessionStorage in `afterEach`.
- Remove any open dialogs/modals in `afterEach`.
