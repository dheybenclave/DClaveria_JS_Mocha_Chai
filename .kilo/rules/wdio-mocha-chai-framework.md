---
description: "Repository-specific WebDriverIO + Mocha + Chai framework conventions and execution workflow."
alwaysApply: true
---

# WebDriverIO Mocha Chai Framework Conventions

## Key Paths

- Specs: `src/specs/web/`, `src/specs/api/`
- Pages: `src/pageobjects/`
- Config: `config/wdio.shared.conf.js`
- Utilities: `src/utils/`
- Reports: `reports/`

## Workflow

1. Update or add test behavior in spec files.
2. Implement page-level actions/assertions.
3. Add `logger.step()` for reporting.
4. Run targeted tag/scenario and then dry-run.

## Command Quickstart

```bash
npm run test:tc1
npm run test:tag -- --mochaOpts.grep="@tc_1"
npm run report
npx wdio run ./config/wdio.local.conf.js --suite regression --dry-run
```

## Reliability Guardrails

- Do not put selectors directly in spec files.
- Keep waits centralized and deterministic.
- Preserve existing marker naming and report output paths.
- Use `config` block in `wdio.conf.js` for all settings.
