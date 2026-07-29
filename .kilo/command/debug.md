---
name: debug
description: Debug failing test with enhanced logging and screenshots.
---

# /debug

Debug a specific failing test with verbose output.

## Usage

```bash
npx wdio run ./wdio.conf.js --suite regression --mochaOpts.grep="@tc_6" --logLevel=debug
```

## Steps

1. Run test with debug logging
2. Capture screenshots on failure
3. Log browser console output
4. Analyze network requests
5. Report findings with evidence
