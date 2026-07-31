---
description: "WebDriverIO-specific test automation guardrails and best practices."
alwaysApply: true
---

# Test Automation Guardrails

## Core Principles

- **Thin specs, rich pages**: Specs delegate to page objects; page objects own locators, actions, and assertions
- **Selectors belong in page objects**: Never put CSS/XPath selectors directly in spec files
- **No time.sleep()**: Use `waitForDisplayed`, `waitForEnabled`, `browser.waitUntil`
- **Keep specs declarative**: Specs should be thin; delegate complex logic to page objects
- **Parallel-safe**: Add `beforeEach` + `afterEach` for stability
- **QA engineers**: See `AGENTIC_GUIDE.md` for framework usage standards and test writing patterns

## Selector Strategy

### Semantic First

```javascript
// ✅ BEST — Resilient selectors
get loginButton() {
    return $('a[href*="login"]');
}

get submitButton() {
    return $('button[aria-label="Search"]');
}
```

### Data Attributes

```javascript
// ✅ GOOD — Data attributes
get fromCityInput() {
    return $('//input[@data-test-origin]');
}
```

### Avoid Brittle Selectors

```javascript
// ❌ AVOID — Fragile
$('div.mc6t-logo > span:nth-child(2)')
$('.btn-primary-large[type="submit"]')
$('div.Fxw9-result-item-container') // full class match
```

## Wait Strategy

### Always Use Explicit Waits

```javascript
// ❌ WRONG
// time.sleep(2);
// browser.pause(500);

// ✅ CORRECT
await this.logo.waitForDisplayed({ timeout: 15000 });
await browser.waitUntil(async () => {
    return await this.resultsContainer.isDisplayed();
}, { timeout: 60000 });
```

### Page-Level Wait Hooks

Define common wait patterns in `BasePage`:

```javascript
async waitForPageLoad() {
    await browser.waitUntil(
        async () => {
            const currentUrl = await browser.getUrl();
            const isCorrectDomain = currentUrl.includes(CONFIG.BASE_URL);
            const isDOMReady = await browser.execute(() => document.readyState === 'complete');
            const isLoaderGone = await checkLoadingElements();
            return isCorrectDomain && isDOMReady && isLoaderGone;
        },
        {
            timeout: CONFIG.TIMEOUT,
            timeoutMsg: `Page failed to stabilize`
        }
    );
}
```

### Anti-Patterns to Avoid

- **`waitForIntSecond()`** in `base.page.js` — uses `browser.pause()`
- **Hardcoded `browser.pause(500)`** in `home.page.js` — arbitrary delays
- **Redundant `waitForElementVisible` before `clickElement`** — `clickElement` already waits
