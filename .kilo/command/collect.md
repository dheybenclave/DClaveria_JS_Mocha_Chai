---
name: collect
description: Verify WDIO test discovery without running tests.
---

# /collect

Verify test discovery and collection health.

## Usage

```bash
npx wdio run ./wdio.conf.js --suite regression --dry-run
```

## Steps

1. Run WDIO in dry-run mode
2. Verify all `@tc_` tagged tests are discovered
3. Check for any collection errors or warnings
