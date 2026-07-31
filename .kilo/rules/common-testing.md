---
description: "Testing requirements for this repository: collection hygiene, WDIO stability, and regression readiness."
alwaysApply: true
---

# Testing Requirements

## Required Validation Sequence

When implementing or fixing behavior:
1. Run targeted tag/scenario first (fast feedback).
2. Run WDIO dry-run to catch discovery issues.
3. Run broader regression selection before finalizing.
4. Run parallel tests to verify no session conflicts.

## Test Types Expected

- WebDriverIO specs under `src/specs/web/`
- API specs under `src/specs/api/`
- Page object driven assertions under `src/pageobjects/`
- Reusable components under `src/components/`

### Reference Examples (MANDATORY Templates)

| Domain | Reference Test | File | What It Demonstrates |
|--------|---------------|------|---------------------|
| **WEB UI** | `@tc_5` | `src/specs/web/flight-search-results.spec.js` | Fresh session per test, data-driven, page object actions, descriptive assertions, proper cleanup |
| **API** | `@tc_7` | `src/specs/api/booking.spec.js` | Suite-level setup, per-test cleanup by ID, status validation, JSON property checks |

**Rule:** All new tests MUST follow these reference templates exactly.
- WEB UI tests → follow `@tc_5` pattern exactly
- API tests → follow `@tc_7` pattern exactly

## Stability Rules

- Keep spec files thin and delegate UI actions/assertions to page objects.
- Avoid brittle selectors in specs; keep selectors inside page objects.
- Prefer deterministic waits and WDIO assertions over arbitrary sleeps.
- Preserve tag-driven execution (`@tc_1`, `@tc_6`, and related markers).
- Always add `beforeEach` + `afterEach` for parallel test stability.
- Create new `HomePage` instance in `beforeEach`, not `before`.
- Use `browser.reloadSession()` in `beforeEach` for fresh browser state.
- Clear cookies, localStorage, sessionStorage in `afterEach`.
- Remove any open dialogs/modals in `afterEach`.

## Definition of Done (Testing)

- [ ] Scenario(s) for the change pass
- [ ] WDIO dry-run passes
- [ ] No new flaky waits or timing hacks
- [ ] Report artifacts remain generated in `reports/`
- [ ] All steps logged with `logger.info()`
- [ ] Selectors in page objects only
- [ ] Explicit waits used — no `time.sleep()`
- [ ] Tag markers preserved
- [ ] Chai assertions include descriptive messages
- [ ] Parallel tests pass (no session conflicts)
- [ ] `afterEach` cleanup runs successfully

## QA Engineers

See `AGENTIC_GUIDE.md` for framework usage standards, test writing patterns, and debugging procedures.
