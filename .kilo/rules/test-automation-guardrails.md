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
    return $('[data-testid="from-input"], input[placeholder*="From"]');
}
```

### Avoid Brittle Selectors

```javascript
// ❌ AVOID — Fragile
$('div.mc6t-logo > span:nth-child(2)')
$('.btn-primary-large[type="submit"]')
```

## Wait Strategy

### Always Use Explicit Waits

```javascript
// ❌ WRONG
// time.sleep(2);

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
        async () => (await browser.getUrl()).includes(this.baseUrl),
        { timeout: this.timeout }
    );
}
```
