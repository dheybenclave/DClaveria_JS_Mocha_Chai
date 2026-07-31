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
2. Detect test type: WEB UI or API
3. Apply mandatory template (`@tc_5` for web, `@tc_7` for API)
4. Create page object methods
5. Create spec file with `@tc_` tags
6. Add `logger.info()` calls
7. Run collection to verify

## MANDATORY Templates

### WEB UI Template: `@tc_5` (`src/specs/web/flight-search-results.spec.js`)

**USE THIS WHEN:** User requests web/UI test generation.

```javascript
import { expect } from 'chai';
import HomePage from '../../pageobjects/home.page.js';
import { DataManager } from '../../utils/data.manager.js';
import logger from '../../utils/logger.js';

describe('@smoke @e2e_1 Feature Name', () => {
  let homePage;

  beforeEach(async () => {
    homePage = new HomePage();
    await browser.reloadSession();
    await homePage.open();
    await homePage.waitForPageLoad();
  });

  afterEach(async () => {
    try {
      await homePage.open();
      await browser.deleteAllCookies();
      await browser.execute(() => {
        window.sessionStorage.clear();
        window.localStorage.clear();
      });
    } catch (error) {
      logger.info(`Cleanup encountered an issue: ${error.message}`);
    }
  });

  it('@tc_N Should do something positive', async () => {
    logger.info('TC_N: Description');
    const testData = DataManager.getWebData('test_data.json').valid_items[0];
    await homePage.someAction(testData.field);
    expect(result).to.be.true;
  });
});
```

### API Template: `@tc_7` (`src/specs/api/booking.spec.js`)

**USE THIS WHEN:** User requests API test generation.

```javascript
import { expect } from 'chai';
import BookingAPIBase from '../../pageobjects/booking.api.js';
import { DataManager } from '../../utils/data.manager.js';
import { logger } from '../../utils/logger.js';

describe('@api @api_e2e_1 Feature Name', () => {
  let apiClient;
  let createdResourceId;

  before(() => {
    apiClient = new BookingAPIBase();
    logger.info('API test suite initialized');
  });

  afterEach(async () => {
    if (createdResourceId) {
      try {
        logger.info(`Cleaning up resource ID: ${createdResourceId}`);
        await apiClient.deleteBooking(createdResourceId);
      } catch (error) {
        logger.error(`Cleanup failed: ${error.message}`);
      }
      createdResourceId = null;
    }
  });

  it('@api_tc_N should perform API action', async () => {
    logger.info('TC_API_N: Description');
    const testData = DataManager.getApiData('test_data.json').valid_items[0];
    const result = await apiClient.someAction(testData);
    expect(result.status).to.equal(200);
    expect(result.json).to.have.property('id');
  });
});
```

## Output

- New spec file in `src/specs/web/` or `src/specs/api/`
- Updated page object in `src/pageobjects/`
- Test data in `src/fixtures/`

## Guardrails

- **WEB UI tests MUST follow `@tc_5` template exactly**
- **API tests MUST follow `@tc_7` template exactly**
- Always use `@tc_N` markers
- Always use `logger.info()` for each step
- Always delegate actions to page objects
- Never put selectors in spec files
- Always use explicit waits
- Preserve existing tag conventions
