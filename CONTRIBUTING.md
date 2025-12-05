# Contributing to the Shortlink Service

Thank you for your interest in contributing! This guide will help you submit a shortlink redirect request.

## How to Request a Shortlink

There are two ways to request a new shortlink:

### Option 1: Submit an Issue (Recommended for non-technical users)

1. Go to the [Issues](../../issues) tab
2. Click "New Issue"
3. Select "Request a Shortlink"
4. Fill out the form with:
   - Your desired shortlink slug (e.g., `myproject`)
   - The destination URL
   - Optional: A description of what it's for
5. Submit the issue and wait for approval

### Option 2: Submit a Pull Request (For technical users)

1. **Fork the repository**
   - Click the "Fork" button at the top right of this repository

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/create-a-shortlink.git
   cd create-a-shortlink
   ```

3. **Create a new branch**
   ```bash
   git checkout -b add-shortlink-yourname
   ```

4. **Edit `redirects.json`**
   
   Add your shortlink to the JSON file. The format supports two styles:
   
   **Simple format** (just a URL):
   ```json
   {
     "mylink": "https://example.com/my-long-url"
   }
   ```
   
   **Extended format** (with metadata):
   ```json
   {
     "mylink": {
       "url": "https://example.com/my-long-url",
       "description": "My awesome project",
       "owner": "yourusername"
     }
   }
   ```

5. **Validate your changes** (optional but recommended)
   ```bash
   node validate.js
   ```

6. **Commit your changes**
   ```bash
   git add redirects.json
   git commit -m "Add shortlink: mylink"
   ```

7. **Push to your fork**
   ```bash
   git push origin add-shortlink-yourname
   ```

8. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "Pull Request"
   - Fill out the PR template
   - Submit for review

## Shortlink Guidelines

### ✅ Accepted Shortlinks

- Personal projects and portfolios
- Open source projects
- Documentation and resources
- Social media profiles
- Contact information (email, Discord, etc.)
- Educational content
- Event registrations

### ❌ Rejected Shortlinks

- Malicious or phishing URLs
- Spam or advertising
- Illegal content
- Adult content (NSFW)
- Temporary/disposable URLs
- URLs that violate GitHub's Terms of Service
- Misleading or deceptive links

### Naming Rules

- **Length**: 2-50 characters
- **Characters**: Only lowercase letters, numbers, and hyphens
- **Format**: Must start and end with a letter or number
- **Reserved**: Cannot use `admin`, `api`, `assets`, `files`, etc.
- **Uniqueness**: Must not conflict with existing shortlinks

Examples:
- ✅ `myproject`, `my-blog`, `discord123`
- ❌ `MyProject`, `my_blog`, `-discord`, `admin`

## Review Process

1. **Automatic validation** - GitHub Actions will check your PR for errors
2. **Manual review** - I'll review the shortlink for appropriateness
3. **Approval or feedback** - I'll either approve or ask for changes
4. **Merge** - Once approved, the shortlink goes live automatically

Typical review time: 1-3 days

## Need Help?

- Check existing [Issues](../../issues) for similar requests
- Review the [README](README.md) for technical details
- Open a [Discussion](../../discussions) for questions

## Code of Conduct

- Be respectful and professional
- Don't spam with multiple requests
- Accept feedback graciously
- Follow the guidelines above

Thank you for contributing! 🎉
