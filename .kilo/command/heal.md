---
name: heal
description: Automatically heal broken selectors and waits for a failing test.
---

# /heal

Self-heal broken tests by analyzing failures and fixing selectors/wait conditions.

## Usage

```bash
npm run agentic:heal -- --test="@tc_6"
```

## Steps

1. Identify failing test from mochawesome report
2. Analyze error message and stack trace
3. Propose selector/wait fixes to user
4. Apply fixes with proper logging
5. Re-run test to verify

## Reference Test Health Check

Before healing, verify reference templates still pass:

```bash
# WEB UI reference
npm run test:tag --tag="@tc_5"

# API reference
npm run test:tag --tag="@tc_7"
```

If reference tests fail, fix them first before healing other tests.

## Common Healing Patterns

| Failure | Root Cause | Fix |
|---------|-----------|-----|
| `invalid selector` | XPath/CSS syntax error | Use `getTextElement()` for text lookups |
| `element not clickable` | Overlay or dialog blocking | Wait for dialog to close, use JS click |
| `stale element` | DOM changed after reference | Re-fetch element in page object |
| `timeout exceeded` | Page not loaded | Add `waitForPageLoad()` before action |
| `session conflict` | Shared session in parallel | Add `beforeEach` cleanup, fresh instance |
| `WebdriverBidiException` | JS click with object instead of selector | Pass `element.selector` string, not element object |

## Guardrails

- Never change test logic without user approval
- Always prefer data-testid over CSS/XPath
- Add explicit waits, never remove them
- Log all healing actions with `logger.info()`
- Always verify fix with targeted test run
- Run parallel tests after healing to confirm stability
