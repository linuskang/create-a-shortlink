# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this shortlink service, please report it responsibly:

### How to Report

1. **Do NOT open a public issue** - This could expose the vulnerability
2. **Use GitHub Security Advisories**: Go to the Security tab and click "Report a vulnerability"
3. **Or email directly**: Contact the maintainer at the email listed in the repository

### What to Include

Please provide:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)

### Response Time

We aim to respond to security reports within:
- **Initial response**: 48 hours
- **Assessment**: 7 days
- **Fix timeline**: Varies by severity

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | ✅ Yes             |
| Older   | ❌ No              |

This service is continuously deployed from the `main` branch.

## Security Considerations

### For Shortlink Submissions

When submitting shortlinks:

1. **URL Validation**
   - Only `http://`, `https://`, and `mailto:` protocols are allowed
   - No localhost or private IP addresses
   - URLs are validated before redirect generation

2. **XSS Prevention**
   - All URLs are HTML-escaped in generated pages
   - JSON-escaped for JavaScript contexts
   - No user-supplied HTML is rendered

3. **Malicious Content**
   - Links to phishing sites will be removed
   - Spam and malicious URLs are rejected
   - Regular audits of existing links

### For Maintainers

1. **GitHub Actions Security**
   - Use minimal required permissions
   - PAT tokens should be stored as secrets
   - Review workflow changes carefully

2. **Validation**
   - Always run `validate.js` before merging
   - Check destination URLs manually
   - Verify contributor identity for updates

3. **Access Control**
   - Limit repository write access
   - Use branch protection rules
   - Require PR reviews

## Known Limitations

1. **Open Redirect**: This is an intentional feature - we redirect to user-submitted URLs
2. **No Rate Limiting**: Static site has no built-in rate limiting
3. **Public Submissions**: Anyone can submit PRs (by design)

## Best Practices

### For Users

- ✅ Only submit links you own or have permission to share
- ✅ Keep destination URLs updated
- ✅ Report dead or compromised links
- ❌ Don't submit shortened URLs (defeats the purpose)
- ❌ Don't submit temporary/disposable URLs

### For Maintainers

- ✅ Regularly audit existing shortlinks
- ✅ Check destination URLs before approval
- ✅ Keep dependencies updated
- ✅ Monitor Actions logs for suspicious activity
- ✅ Use branch protection on `main`

## Automated Security

This repository uses:
- **GitHub Dependabot** - Dependency vulnerability alerts
- **GitHub Actions validation** - Automatic PR validation
- **Branch protection** - Prevents direct commits to main
- **Code scanning** - (Optional) Enable in Security tab

## Disclosure Policy

When a security issue is fixed:
1. We will credit the reporter (unless they prefer anonymity)
2. A security advisory will be published
3. The fix will be deployed immediately
4. Users will be notified via release notes

## Contact

For security concerns:
- GitHub Security Advisories (preferred)
- Repository Issues (for non-security bugs)
- Email: [maintainer email]

Thank you for helping keep this service secure! 🔒
