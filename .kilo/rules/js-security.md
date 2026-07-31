---
description: "Security requirements for test automation code."
alwaysApply: true
---

# JavaScript Security

## Secrets Management

- **NO hardcoded secrets** in code
- All credentials in `config/wdio.shared.conf.js` `config` block
- Never commit passwords, tokens, or API keys
- Use `config.apiUsername`, `config.apiPassword`
- Never store secrets in JSON test data files
- Never log credentials in any form

## Logging Safety

- Never log sensitive data (passwords, tokens, PII)
- Sanitize URLs before logging
- Use `logger.info()` for actions, not `console.log()`
- Never log session cookies or authentication headers
- Mask sensitive values in log output

## Example

```javascript
// ✅ CORRECT
const password = this.config.apiPassword;
await this.passwordInput.setValue(password);
logger.info('Password entered');

// ❌ WRONG
await this.passwordInput.setValue('admin123');
console.log('Password: admin123');
```

## CI/CD Security

- Use environment variables for secrets in pipeline
- Never expose `config/wdio.shared.conf.js` credentials in logs
- Mask secrets in CI/CD output
- Rotate credentials regularly
- Use `.env` for local secrets only (git-ignored)
- Use `config` block in `wdio.shared.conf.js` for all test config

## Data Safety

- Test data files must not contain real credentials
- Use placeholder values in test data JSON
- Sanitize any data written to reports
- Do not include PII in screenshots or report attachments