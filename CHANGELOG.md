# Changelog

All notable changes to this shortlink service will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Community contribution system with PR and Issue templates
- Automated validation workflow for pull requests
- Enhanced metadata support (description, owner fields)
- Local testing server (`server.js`)
- Comprehensive documentation (CONTRIBUTING.md, MAINTAINER.md, SECURITY.md)
- NPM scripts for common tasks
- Reserved slug validation
- Duplicate URL detection

### Changed
- README.md restructured for public contributions
- `redirects.json` now supports both string and object formats
- Improved validation with detailed error messages
- Enhanced `generate.js` to support metadata

### Security
- URL protocol validation (only http/https/mailto)
- XSS prevention with HTML escaping
- Private IP/localhost blocking
- Security policy documentation

## [1.0.0] - Initial Release

### Added
- Basic shortlink redirect functionality
- Static HTML generation
- GitHub Actions automation
- Meta refresh and JavaScript redirects
- 404 error page
- Open Graph and Twitter Card support

---

## How to Update This Changelog

### When Adding Shortlinks
No changelog entry needed for individual shortlink additions.

### When Modifying Core Functionality
Add entries under `[Unreleased]` in the appropriate category:

- **Added** - New features
- **Changed** - Changes to existing functionality  
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security improvements

### When Releasing
1. Change `[Unreleased]` to `[X.Y.Z] - YYYY-MM-DD`
2. Add new `[Unreleased]` section at top
3. Update version in `package.json`
4. Create a GitHub release with the same notes
