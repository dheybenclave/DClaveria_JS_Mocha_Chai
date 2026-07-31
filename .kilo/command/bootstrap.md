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
2. Verify WDIO CLI installed (`npx wdio --version`)
3. Verify Chrome browser available
4. Run dry-run to verify test discovery:
   ```bash
   npx wdio run ./config/wdio.local.conf.js --suite regression --dry-run
   ```
5. Verify reference templates still pass:
   ```bash
   # WEB UI reference
   npm run test:tag --tag="@tc_5"
   
   # API reference
   npm run test:tag --tag="@tc_7"
   ```
6. Verify `reports/` directory can be created
7. Confirm all `@tc_` tests discoverable
8. Verify `src/utils/logger.js` initializes without errors

## Expected Result

- All validations PASS
- No collection errors
- Report artifacts directory created
- All test specs discovered

## Troubleshooting

| Issue | Fix |
|-------|-----|
| WDIO CLI not found | `npm install` |
| Chrome not found | Install Chrome or set `BROWSER=firefox` |
| Collection errors | Check import paths in specs |
| Report dir fails | Check `reports/` permissions |
