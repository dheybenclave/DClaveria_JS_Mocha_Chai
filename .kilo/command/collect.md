---
name: collect
description: Verify WDIO test discovery without running tests.
---

# /collect

Verify test discovery and collection health.

## Usage

```bash
npm run collect
```

## What It Does

Runs WDIO in dry-run mode to verify all specs and `@tc_` tags are discoverable without executing tests.

## Steps

1. Run WDIO dry-run:
   ```bash
   npx wdio run ./config/wdio.local.conf.js --suite regression --dry-run
   ```
2. Verify all `@tc_` tagged tests are discovered
3. Check for any collection errors or warnings
4. Verify all page objects import correctly
5. Verify all test data JSON files load correctly
6. Verify reference templates are discoverable:
   ```bash
   npm run test:tag --tag="@tc_5"
   npm run test:tag --tag="@tc_7"
   ```

## Expected Output

- All specs discovered
- All `@tc_N` tests listed
- No import errors
- No missing page objects
- No missing fixtures

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Spec not found | Check file path in `config/wdio.shared.conf.js` `specs` array |
| Import error | Verify relative import paths in spec files |
| Page object missing | Ensure file exists in `src/pageobjects/` |
| Fixture missing | Ensure JSON file exists in `src/fixtures/` |
| Syntax error | Run `npx eslint src/ --ext .js` |
