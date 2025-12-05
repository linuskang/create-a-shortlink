# GitHub Automation

This directory contains automated workflows and templates for the shortlink service.

## Workflows

### 🔄 `generate-redirects.yml`
**Purpose**: Automatically generates redirect HTML pages when shortlinks are added/modified.

**Triggers**:
- Push to `main` branch (when `redirects.json` or `generate.js` changes)
- Manual trigger via GitHub Actions UI

**What it does**:
1. Checks out the repository
2. Runs `node generate.js` to create redirect pages
3. Commits and pushes generated files back to the repo
4. Deploys to GitHub Pages automatically

### ✅ `validate-pr.yml`
**Purpose**: Validates pull requests that add/modify shortlinks.

**Triggers**:
- Pull requests to `main` branch (when `redirects.json` changes)

**What it does**:
1. Runs `node validate.js` to check for errors
2. Posts a comment on the PR with validation results
3. Blocks merge if validation fails
4. Provides helpful error messages and suggestions

**Validation checks**:
- URL format and protocol (http/https/mailto only)
- Slug naming rules (2-50 chars, lowercase alphanumeric + hyphens)
- No reserved words
- No duplicate URLs or slugs
- Valid JSON structure

## Templates

### 📝 `pull_request_template.md`
Default template for all pull requests. Includes:
- Checklist for contributors
- Fields for shortlink details
- Link to contribution guidelines

### 📋 `ISSUE_TEMPLATE/shortlink-request.yml`
Form-based issue template for non-technical users to request shortlinks.

Includes fields for:
- Shortlink slug
- Destination URL
- Description
- Owner/requester
- Category selection
- Guidelines checklist

## Configuration

### Permissions Required

Both workflows need:
- `contents: write` - To commit generated files
- `pull-requests: write` - To comment on PRs

### Secrets

The `generate-redirects.yml` workflow uses:
- `LINUS_PAT_FOR_ACTIONS` - Personal Access Token for pushing commits

> **Note**: You may need to update this to use `GITHUB_TOKEN` or your own PAT depending on your repository settings.

## Testing Workflows Locally

You can test the validation logic locally:

```bash
node validate.js
```

And test the generation:

```bash
node generate.js
```

## Customization

To customize these workflows for your own repository:

1. **Update the PAT**: In `generate-redirects.yml`, replace `LINUS_PAT_FOR_ACTIONS` with your secret name or use `GITHUB_TOKEN`
2. **Change validation rules**: Modify `validate.js` to adjust slug rules, reserved words, etc.
3. **Adjust triggers**: Modify the `on:` section of workflows to change when they run
4. **Custom comments**: Edit the PR comment templates in `validate-pr.yml`

## Troubleshooting

### Workflow not running?
- Check if workflows are enabled in repository settings
- Verify the file paths in trigger conditions match your changes
- Check Actions tab for error logs

### Validation passing but should fail?
- Review validation rules in `validate.js`
- Check if reserved words list needs updating
- Verify URL validation logic

### Generated files not appearing?
- Check if `generate-redirects.yml` completed successfully
- Verify commit permissions
- Check if GitHub Pages is enabled

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [GitHub Script Action](https://github.com/actions/github-script)
