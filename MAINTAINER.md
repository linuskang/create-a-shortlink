# Maintainer Guide

This guide is for repository maintainers who review and approve shortlink requests.

## Quick Start for Maintainers

### Reviewing Pull Requests

1. **Automated Validation**
   - GitHub Actions will automatically run `validate.js` on every PR
   - Check the PR comments for validation results
   - Only PRs that pass validation should be considered for merge

2. **Manual Review Checklist**
   - [ ] URL is appropriate and not malicious
   - [ ] Slug name makes sense for the destination
   - [ ] Destination URL is accessible (not broken)
   - [ ] Not spam or advertising
   - [ ] Follows community guidelines
   - [ ] Owner/description metadata is present (if using extended format)

3. **Approve and Merge**
   - Use "Squash and merge" to keep history clean
   - The `generate-redirects.yml` workflow will automatically run
   - Shortlink will be live within 1-2 minutes

### Reviewing Issues

For shortlink requests submitted as issues:

1. **Review the request**
   - Check if it meets guidelines
   - Verify URL is valid and appropriate

2. **Create the shortlink yourself**
   - Fork or clone the repo
   - Add the entry to `redirects.json`
   - Create a PR on behalf of the requester
   - Reference the issue in the PR description

3. **Close the issue**
   - Link to the merged PR
   - Thank the contributor

## Common Review Scenarios

### ✅ Good Examples

```json
{
  "myportfolio": {
    "url": "https://johnsmith.dev",
    "description": "John's portfolio website",
    "owner": "johnsmith"
  },
  "discord": "https://discord.gg/example123",
  "docs": {
    "url": "https://docs.myproject.com",
    "description": "Project documentation"
  }
}
```

### ❌ Reject Examples

```json
{
  "admin": "https://example.com",  // Reserved word
  "My-Cool-Site": "https://example.com",  // Wrong case
  "spam-ads": "https://clickbait.com/ads",  // Inappropriate
  "x": "https://example.com",  // Too short
  "localhost": "http://localhost:3000"  // Local URL
}
```

## Managing Shortlinks

### Updating an Existing Shortlink

If someone needs to update their shortlink:
1. They should submit a new PR modifying their entry
2. Review the changes
3. Ensure it's the original owner or justified update
4. Merge if appropriate

### Removing Shortlinks

To remove a shortlink:
1. Delete the entry from `redirects.json`
2. Commit and push
3. The cleanup process will automatically remove the directory

Reasons to remove:
- Destination URL permanently dead (404)
- Owner requests removal
- Link becomes inappropriate or malicious
- Spam/abuse detected

### Bulk Operations

For bulk updates or cleanup:
1. Edit `redirects.json` locally
2. Run `node validate.js` to check
3. Run `node generate.js` to preview
4. Commit and push all changes at once

## Validation Script

### Running Manually

```bash
node validate.js
```

### Understanding Output

**Success**:
```
🔍 Validating redirects.json...

✅ Validation successful!

📊 Statistics:
   Total shortlinks: 15
   With metadata: 10
```

**Errors**:
```
❌ Validation failed with errors:

   • [admin] Invalid slug: Slug "admin" is reserved and cannot be used
   • [my-site] Invalid URL: Invalid protocol: ftp:. Only http, https, and mailto are allowed.

⚠️  Warnings:

   • [example] Duplicate URL detected: also used by "test"
```

## Configuration

### Updating Reserved Words

Edit `validate.js`:

```javascript
const RESERVED_SLUGS = new Set([
  "admin", "api", "assets", // ... add more
]);
```

### Changing Validation Rules

In `validate.js`, modify:
- `MAX_SLUG_LENGTH` - Maximum slug length (default: 50)
- `MIN_SLUG_LENGTH` - Minimum slug length (default: 2)
- `MAX_URL_LENGTH` - Maximum URL length (default: 2000)

### Protected Files

Edit `generate.js` to protect additional files:

```javascript
const PROTECTED_ITEMS = new Set([
  '.git', '.github', 'CNAME', // ... add more
]);
```

## Automation Setup

### GitHub Actions Secrets

Required secrets:
- `LINUS_PAT_FOR_ACTIONS` (or `GITHUB_TOKEN`)

To create a PAT:
1. GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `workflow`
4. Add to repository secrets

### GitHub Pages Setup

1. Repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / `(root)`
4. Save

### Custom Domain (Optional)

1. Add `CNAME` file with your domain
2. Configure DNS:
   ```
   Type: CNAME
   Name: @  (or subdomain)
   Value: yourusername.github.io
   ```
3. Enable HTTPS in Pages settings

## Monitoring

### Check Recent Activity

```bash
# View recent commits
git log --oneline -10

# Check which files were generated
ls -la */index.html

# Count total shortlinks
cat redirects.json | grep -c "url"
```

### Analytics (Optional)

Consider adding:
- Google Analytics
- Cloudflare Analytics
- Custom tracking pixels

## Troubleshooting

### Workflow fails after merge
- Check Actions tab for error details
- Verify `generate.js` runs locally
- Check file permissions

### Shortlink not working after merge
- Wait 1-2 minutes for Pages to deploy
- Check if file was generated in repo
- Verify GitHub Pages is enabled
- Clear browser cache

### Validation passing bad URLs
- Update validation rules in `validate.js`
- Add more reserved words if needed
- Adjust URL validation logic

## Best Practices

1. **Response Time**: Try to review PRs within 1-3 days
2. **Communication**: Be friendly and helpful in PR comments
3. **Consistency**: Apply guidelines fairly to all requests
4. **Documentation**: Keep CONTRIBUTING.md updated
5. **Security**: Regularly check for malicious links
6. **Cleanup**: Periodically review and remove dead links

## Support

For questions or issues:
- Review documentation in `/docs` (if exists)
- Check GitHub Discussions
- Open an issue for bugs or feature requests

## Resources

- [GitHub Actions Logs](../../actions)
- [Open Pull Requests](../../pulls)
- [Open Issues](../../issues)
- [Repository Settings](../../settings)
