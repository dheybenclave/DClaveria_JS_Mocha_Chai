---
name: generate
description: Generate new test case from natural language requirement.
---

# /generate

Create new test specs, page objects, or step definitions from requirements.

## Usage

```bash
npm run agentic:generate -- --requirement="user can search for flights"
```

## Steps

1. Parse requirement
2. Create page object methods
3. Create spec file with `@tc_` tags
4. Add logger.info() calls
5. Run collection to verify

## Output

- New spec file in `src/specs/web/` or `src/specs/api/`
- Updated page object in `src/pageobjects/`
- Test data in `src/fixtures/`
