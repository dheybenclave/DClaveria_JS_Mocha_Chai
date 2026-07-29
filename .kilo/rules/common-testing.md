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

## Test Types Expected

- WebDriverIO specs under `tests/web/`
- API specs under `tests/api/`
- Page object driven assertions under `src/pages/`

## Stability Rules

- Keep spec files thin and delegate UI actions/assertions to page objects.
- Avoid brittle selectors in specs; keep selectors inside page objects.
- Prefer deterministic waits and WDIO assertions over arbitrary sleeps.
- Preserve tag-driven execution (`@tc_1`, `@tc_6`, and related markers).

## Definition of Done (Testing)

- [ ] Scenario(s) for the change pass
- [ ] WDIO dry-run passes
- [ ] No new flaky waits or timing hacks
- [ ] Report artifacts remain generated in `mochawesome-report/`
- [ ] All steps logged with `logger.step()`
