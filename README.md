# lkang.au

A simple, static shortlinks/URL redirect service hosted on GitHub Pages.

## Overview

This repository powers the `lkang.au` domain with short, memorable URLs that redirect to longer destinations. It uses static HTML files with meta refresh and JavaScript redirects for maximum compatibility.

## Features

- **Fast redirects**: Uses `<meta http-equiv="refresh">` for instant redirection
- **JavaScript fallback**: Ensures compatibility with all browsers
- **SEO-friendly**: Includes canonical URLs and Open Graph meta tags
- **Social media ready**: Twitter Card and Open Graph support for link previews
- **Automated generation**: GitHub Actions automatically regenerates pages when `redirects.json` is updated
- **No server required**: Fully static, works with GitHub Pages

## Current Shortlinks

| Shortlink | Destination |
|-----------|-------------|
| [lkang.au](https://lkang.au) | https://linuskang.au |
| [lkang.au/software](https://lkang.au/software) | https://software.linuskang.au |
| [lkang.au/discord](https://lkang.au/discord) | https://discord.com/invite/qW6SH74kNR |
| [lkang.au/github](https://lkang.au/github) | https://github.com/linuskang |
| [lkang.au/support](https://lkang.au/support) | mailto:support@linus.id.au |
| [lkang.au/bubblymaps](https://lkang.au/bubblymaps) | https://bubbly.linuskang.au |

## How to Add a New Shortlink

1. Open `redirects.json`
2. Add a new entry with the slug (short path) as the key and the destination URL as the value:

```json
{
  "": "https://linuskang.au",
  "mylink": "https://example.com/long-url-here"
}
```

3. Commit and push your changes
4. GitHub Actions will automatically generate the redirect pages

### Manual Generation (Optional)

If you want to generate redirect pages locally:

```bash
node generate.js
```

This will:
- Read all entries from `redirects.json`
- Create a directory for each shortlink slug
- Generate an `index.html` file with the redirect logic
- **Delete any old shortlink directories** that are no longer in `redirects.json`
- Display a summary of generated and deleted redirects

## File Structure

```
lkang.au/
├── redirects.json          # Shortlink definitions
├── generate.js             # Redirect page generator
├── generate-index.js       # File index generator
├── index.html              # Root redirect page
├── CNAME                   # GitHub Pages custom domain
├── README.md               # This file
├── .github/
│   └── workflows/
│       ├── generate-redirects.yml  # Auto-generate on redirects.json change
│       └── generate-index.yml      # Auto-generate file index
└── [slug]/
    └── index.html          # Generated redirect pages
```

## How It Works

### Redirect Mechanism

Each generated redirect page uses three methods to ensure the redirect works:

1. **Meta Refresh** (Primary): `<meta http-equiv="refresh" content="0; url=...">`
2. **JavaScript** (Fallback): `window.location.replace("...")`
3. **Clickable Link** (Manual): For users with JavaScript disabled

### GitHub Actions

Two workflows automate the generation process. Both can also be triggered manually via the GitHub Actions UI using "Run workflow".

#### 1. Generate Redirects (`generate-redirects.yml`)

| Trigger | Description |
|---------|-------------|
| `push` to `main` | When `redirects.json` or `generate.js` is modified |
| `workflow_dispatch` | Manual trigger via GitHub Actions UI |

**What it does:**
- Runs `node generate.js` to create/update redirect pages
- Automatically deletes shortlink directories that are no longer in `redirects.json`
- Commits and pushes the generated files back to the repository

**Example:** When you add a new shortlink to `redirects.json` and push, this workflow automatically creates the redirect page. When you remove a shortlink, it automatically deletes the old directory.

#### 2. Generate File Index (`generate-index.yml`)

| Trigger | Description |
|---------|-------------|
| `push` to `main` | When `generate-index.js`, `*.pdf`, or `*.json` files change |
| `workflow_dispatch` | Manual trigger via GitHub Actions UI |

**What it does:**
- Creates an HTML index of all files in the repository
- Outputs to `files/index.html`
- Available at [lkang.au/files](https://lkang.au/files)

### Automatic Cleanup

When you remove a shortlink from `redirects.json`, the generator automatically:
1. Detects directories that were previously generated shortlinks
2. Verifies they contain our redirect marker (to avoid deleting unrelated files)
3. Deletes the old shortlink directories

This ensures your repository stays clean without manual cleanup.

## Configuration

### Adding Custom Metadata

Each redirect page includes:
- Open Graph meta tags for social media previews
- Twitter Card meta tags
- Canonical URL for SEO
- Proper HTML5 document structure

### URL Validation

The generator validates all URLs before creating redirect pages. Invalid URLs will be skipped with an error message.

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/linuskangsoftware/lkang.au.git
   cd lkang.au
   ```

2. Modify `redirects.json` to add or update shortlinks

3. Generate redirect pages:
   ```bash
   node generate.js
   ```

4. (Optional) Generate the file index:
   ```bash
   node generate-index.js
   ```

5. Commit and push to trigger GitHub Actions

## License

See [LICENSE](LICENSE) file for details.
