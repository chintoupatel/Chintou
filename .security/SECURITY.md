# Security Policy

Portfolio project security guidelines and incident response.

---

## Dependency Management

### npm audit

Run before every deployment:
```bash
npm audit --audit-level=moderate
npm run build  # now includes audit check
```

### Lock File
- ✅ package-lock.json committed
- ✅ Never delete node_modules without updating lock
- ✅ Never manually edit package-lock.json
- ✅ Verify integrity: `npm ci` instead of `npm install`

### Dependency Updates
- Review security advisories weekly
- Use Dependabot (GitHub) or Snyk for automated scanning
- Test updates in dev/staging before production

---

## Secrets Management

### Environment Variables
- ❌ NO API keys, tokens, or secrets in code
- ✅ Use .env.local (not committed)
- ✅ Use environment secrets in CI/CD platform

### Database/Backend Integration (Future)
- Never store secrets in frontend (they're exposed)
- Use backend API for sensitive operations
- Implement server-side sessions if needed

---

## Frontend Security

### XSS Prevention (Cross-Site Scripting)
- ✅ React escapes by default
- ✅ Use `dangerouslySetInnerHTML` only for trusted content
- ✅ Sanitize user input (if forms added)
- ✅ No `eval()` or dynamic `Function()` constructors

### CSRF Protection (Cross-Site Request Forgery)
- If forms added: implement CSRF tokens
- Set SameSite cookies: `SameSite=Strict`
- Use POST/PUT/DELETE, not GET for mutations

### CSP (Content Security Policy)
- Set restrictive CSP headers in next.config.js
- Block inline scripts (require nonces)
- Whitelist only necessary external resources

### Clickjacking
- Set X-Frame-Options: `DENY` (prevent framing)
- Set X-Content-Type-Options: `nosniff`

---

## Data Protection

### Contact Form (If Implemented)
- ✅ Validate all inputs server-side
- ✅ Rate-limit submissions (prevent spam)
- ✅ No sensitive data in error messages
- ✅ Use HTTPS only (Vercel default)
- ✅ GDPR compliant: inform users of data use

### Analytics
- Use privacy-respecting analytics (Plausible, Fathom)
- Avoid Google Analytics (requires consent)
- Document data usage

---

## Deployment Security

### Vercel/Netlify Defaults
- ✅ HTTPS enforced
- ✅ Automatic certificate renewal
- ✅ DDoS protection built-in

### Security Headers
Add to next.config.js:
```javascript
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=()' },
    ],
  }];
}
```

---

## Incident Response

### If Vulnerability Found

1. **Assess severity** (CVSS score)
2. **If critical:** Immediately patch + deploy
3. **If high:** Patch within 1 week
4. **If medium:** Patch within 1 month
5. **Document** incident in this file

### Reporting Security Issues

Email: chintan05patel@gmail.com (private disclosure)

---

## Compliance

### GDPR (If EU Users)
- ✅ Privacy policy (if storing data)
- ✅ Cookie consent (if tracking)
- ✅ Right to deletion (if storing data)

### ADA/WCAG Accessibility
- ✅ WCAG 2.1 Level AAA compliance (already done)

---

## Security Checklist (Before Launch)

- [ ] npm audit passes (zero vulnerabilities)
- [ ] No secrets in code (check .env files)
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] CSP policy set
- [ ] Forms validated (if any)
- [ ] Rate limiting enabled (if forms)
- [ ] Analytics privacy-respecting
- [ ] Privacy policy ready (if needed)
- [ ] No console.log of sensitive data
- [ ] TypeScript strict mode enabled
- [ ] No unsafe dependencies
- [ ] Build passes security checks

---

## Resources

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- Next.js Security: https://nextjs.org/docs/advanced-features/security-headers
- npm Security: https://docs.npmjs.com/cli/v10/commands/npm-audit
