---
description: "JavaScript/TypeScript coding standards for this WDIO project."
alwaysApply: true
---

# JavaScript Coding Style

## Standards

- **ES6+**: Use async/await, arrow functions, destructuring
- **Modules**: Use ES modules (`import/export`), not CommonJS
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **Files**: `.page.js` for page objects, `.spec.js` for tests

## Async Patterns

```javascript
// ✅ CORRECT
async searchFlights(from, to) {
    await this.fromCityInput.setValue(from);
    return await this.searchButton.click();
}

// ❌ WRONG
searchFlights(from, to) {
    this.fromCityInput.setValue(from);
    return this.searchButton.click();
}
```

## Error Handling

```javascript
// ✅ CORRECT
try {
    await this.loginButton.click();
} catch (error) {
    logger.info(`Login failed: ${error.message}`);
    throw error;
}
```

## Imports

```javascript
// ✅ CORRECT
import BasePage from '../base.page.js';
import { logger } from '../../utils/logger.js';
import { expect } from 'chai';
```

## QA Engineers

See `AGENTIC_GUIDE.md` for standard test writing patterns, page object conventions, and common workflows.
