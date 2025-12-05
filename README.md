# Shortlink Redirect Service

A community-driven, static shortlink/URL redirect service hosted on GitHub Pages.

## 🌟 Overview

This repository provides a simple yet powerful shortlink service where anyone can submit redirect requests via Pull Requests. Each shortlink is a clean, memorable URL that redirects to your longer destination URL. Built entirely with static HTML and automated via GitHub Actions - no server required!

## ✨ Features

- **🚀 Fast redirects**: Meta refresh + JavaScript for instant redirection
- **🔍 Search functionality**: Live search to find shortlinks and see who owns them
- **🎨 Modern UI**: Beautiful landing page with gradient design and smooth animations
- **🌐 Universal compatibility**: Works in all browsers with fallback mechanisms
- **🤝 Community-driven**: Anyone can submit shortlink requests via PR or Issues
- **🔒 Validated**: Automated validation ensures quality and security
- **📱 Social media ready**: Open Graph and Twitter Card support for rich previews
- **⚡ Automated**: GitHub Actions handles generation and deployment
- **🆓 Free & Open**: No server costs, fully static on GitHub Pages
- **📊 Metadata support**: Optional descriptions and owner tracking
- **🔐 Privacy first**: Zero tracking, no cookies, no analytics - fully documented
- **📄 Professional pages**: Terms, Privacy Policy, About, and custom 404 page

## 🤝 How to Request a Shortlink

We welcome community contributions! There are two ways to request a shortlink:

### Option 1: Submit an Issue (Easiest)

1. Go to [Issues](../../issues/new/choose)
2. Select "Request a Shortlink"
3. Fill out the form
4. Wait for approval (typically 1-3 days)

### Option 2: Submit a Pull Request

1. Fork this repository
2. Edit `redirects.json` to add your shortlink
3. Run `node validate.js` to check for errors
4. Submit a PR using the provided template

📖 **For detailed instructions, see [CONTRIBUTING.md](CONTRIBUTING.md)**

### Shortlink Guidelines

- **Allowed**: Personal projects, portfolios, social media, documentation, open source projects
- **Not allowed**: Malicious links, spam, NSFW content, phishing
- **Format**: 2-50 characters, lowercase alphanumeric and hyphens only
- **Reserved words**: Cannot use `admin`, `api`, `files`, etc. (see full list in `validate.js`)

## 📋 Current Shortlinks

| Shortlink | Destination | Owner |
|-----------|-------------|-------|
| [github](https://yourdomain.com/github) | https://github.com/linuskang/create-a-shortlink | linuskang |

*View all shortlinks in [redirects.json](redirects.json)*

## 📝 Redirects.json Format

The `redirects.json` file supports two formats:

**Simple format** (string URL):
```json
{
  "github": "https://github.com/yourusername"
}
```

**Extended format** (with metadata):
```json
{
  "github": {
    "url": "https://github.com/yourusername",
    "description": "My GitHub profile",
    "owner": "yourusername"
  }
}
```

Metadata fields are optional but recommended for better organization.

## 📁 Repository Structure

```
shortlink-service/
├── index.html                  # Main landing page with search
├── about/                      # About page
├── terms/                      # Terms & Conditions
├── privacy/                    # Privacy Policy
├── redirects.json              # Shortlink definitions
├── generate.js                 # Redirect page generator
├── validate.js                 # Validation script for PRs
├── server.js                   # Local testing server
├── 404.html                    # Custom 404 page
├── CONTRIBUTING.md             # Contribution guidelines
├── README.md                   # This file
├── .github/
│   ├── workflows/
│   │   ├── generate-redirects.yml   # Auto-generate on push
│   │   └── validate-pr.yml          # Validate PRs automatically
│   ├── ISSUE_TEMPLATE/
│   │   └── shortlink-request.yml    # Issue template for requests
│   └── pull_request_template.md     # PR template
└── [slug]/
    └── index.html              # Generated redirect pages (auto-created)
```

## 🛠️ Local Development

### Testing Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/shortlink-service.git
   cd shortlink-service
   ```

2. **Validate changes**:
   ```bash
   npm run validate
   # or: node validate.js
   ```

3. **Generate redirect pages**:
   ```bash
   npm run generate
   # or: node generate.js
   ```

4. **Test locally with built-in server**:
   ```bash
   npm run serve
   # or: node server.js
   ```
   
   Then visit `http://localhost:8080/yourslug` to test redirects.

5. **Run all checks and start server**:
   ```bash
   npm start
   ```

### NPM Scripts

- `npm run validate` - Check redirects.json for errors
- `npm run generate` - Generate redirect HTML pages
- `npm run serve` - Start local test server
- `npm test` - Validate and generate
- `npm start` - Generate and serve

## ⚙️ How It Works

### Redirect Mechanism

Each generated redirect page uses multiple methods for maximum compatibility:

1. **Meta Refresh** (Primary): `<meta http-equiv="refresh" content="0; url=...">` - Works even with JavaScript disabled
2. **JavaScript Redirect** (Fallback): `window.location.replace("...")` - Instant redirect
3. **Manual Link** (Last Resort): Clickable link for edge cases

### GitHub Actions Workflows

#### 1. Generate Redirects (`generate-redirects.yml`)

**Triggers:**
- Push to `main` when `redirects.json` or `generate.js` changes
- Manual trigger via "Run workflow"

**Actions:**
- Generates/updates HTML redirect pages
- Deletes removed shortlinks automatically
- Commits and pushes changes

#### 2. Validate PR (`validate-pr.yml`)

**Triggers:**
- Pull requests that modify `redirects.json`

**Actions:**
- Runs `validate.js` to check for errors
- Validates URL format, slug naming, duplicates
- Comments on PR with results
- Blocks merge if validation fails

### Validation Rules

The `validate.js` script checks:
- ✅ URL format and protocol (http, https, mailto only)
- ✅ Slug naming (2-50 chars, lowercase alphanumeric + hyphens)
- ✅ No reserved words (`admin`, `api`, etc.)
- ✅ No duplicate URLs or slugs
- ✅ Valid JSON structure
- ⚠️ Warns about very long URLs or duplicate destinations

### Automatic Cleanup

When shortlinks are removed from `redirects.json`:
1. Generator detects orphaned directories
2. Verifies they contain redirect markers (safety check)
3. Automatically deletes old shortlink folders
4. Keeps repository clean

## 🎨 Customization

### Meta Tags & SEO

Each redirect page automatically includes:
- Open Graph tags for social media previews
- Twitter Card metadata
- Canonical URLs
- Proper HTML5 structure

### Custom Domain

To use your own domain:
1. Add a `CNAME` file with your domain name
2. Configure DNS records (see [GitHub Pages docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site))
3. Enable GitHub Pages in repository settings

## 🔧 Configuration

### Protected Items

The following items are never deleted by the cleanup process:
- `.git`, `.github`, `node_modules`
- `CNAME`, `LICENSE`, `README.md`
- `generate.js`, `validate.js`, `redirects.json`
- `404.html`, `files/`

### Reserved Slugs

These slugs cannot be used as shortlinks (see `validate.js` for complete list):
- `admin`, `api`, `assets`, `config`
- `files`, `images`, `public`, `static`
- `help`, `support`, `docs`, `about`
- And more...

## 📊 Monitoring & Maintenance

### Checking Link Health

Contributors should verify their destination URLs are still active. Dead links may be removed during periodic maintenance.

### Analytics (Optional)

To track shortlink usage, you can:
- Use GitHub Pages built-in analytics
- Add Google Analytics or similar tracking
- Use URL shortener services that provide analytics

## ❓ FAQ

**Q: How long until my shortlink is live?**  
A: Once approved and merged, GitHub Actions deploys within 1-2 minutes.

**Q: Can I update my existing shortlink?**  
A: Yes! Submit a new PR modifying your entry in `redirects.json`.

**Q: Can I have multiple shortlinks?**  
A: Yes, as long as each follows the guidelines.

**Q: What if my shortlink stops working?**  
A: Open an issue and we'll investigate. May be due to invalid destination URL.

**Q: Can I delete my shortlink?**  
A: Yes, submit a PR removing your entry or open an issue requesting deletion.

## 📜 License

See [LICENSE](LICENSE) file for details.

## 🙏 Credits

Built with ❤️ for the community. Powered by GitHub Pages and GitHub Actions.
