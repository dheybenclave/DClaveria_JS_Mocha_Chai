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

## Guardrails

- Never change test logic without user approval
- Always prefer data-testid over CSS/XPath
- Add explicit waits, never remove them
