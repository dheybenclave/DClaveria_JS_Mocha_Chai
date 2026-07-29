---
description: "Security requirements for test automation code."
alwaysApply: true
---

# JavaScript Security

## Secrets Management

- **NO hardcoded secrets** in code
- All credentials in `wdio.conf.js` `config` block
- Never commit passwords, tokens, or API keys
- Use `config.apiUsername`, `config.apiPassword`

## Logging Safety

- Never log sensitive data (passwords, tokens, PII)
- Sanitize URLs before logging
- Use `logger.step()` for actions, not secrets

## Example

```javascript
// ✅ CORRECT
const password = this.config.apiPassword;
await this.passwordInput.setValue(password);
logger.step('Password entered');

// ❌ WRONG
await this.passwordInput.setValue('admin123');
console.log('Password: admin123');
```
