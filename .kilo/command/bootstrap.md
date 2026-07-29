---
name: bootstrap
description: Validate environment and dependencies.
---

# /bootstrap

Initialize and validate local Kilo QA environment.

## Usage

```bash
npm run agentic:bootstrap
```

## Steps

1. Verify Node.js version (>= 18)
2. Verify WDIO CLI installed
3. Verify Chrome/Chromedriver available
4. Run `npx wdio run ./wdio.conf.js --dry-run`
5. Verify mochawesome-report directory exists
6. Confirm all `@tc_` tests discoverable

## Expected Result

- All validations PASS
- No collection errors
- Report artifacts directory created
