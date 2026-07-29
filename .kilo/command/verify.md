---
name: verify
description: Run full validation sequence before commit.
---

# /verify

Execute full validation: collection, targeted tests, and reporting.

## Usage

```bash
npm run verify
```

## Steps

1. Run `npx wdio run ./wdio.conf.js --suite regression --dry-run`
2. Run `npm run test:tc1`
3. Generate report: `npm run report`
4. Verify no console errors
5. Confirm all steps logged in report
