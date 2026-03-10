# Pre-Publish Checklist

Before publishing to npm, verify everything is ready.

## Repository Setup

- [ ] Create GitHub repository: `https://github.com/YOUR_USERNAME/plexlists`
- [ ] Update package.json URLs (repository, bugs, homepage)
- [ ] Add repository description and topics
- [ ] Set repository to public (for npm publish)

## Code & Tests

- [ ] Install dependencies: `npm install`
- [ ] Run test script: `npm test` or `./test.sh`
- [ ] Test CLI locally: `npm link && plexlists --help`
- [ ] Test all commands:
  - [ ] `plexlists config set --host=X --token=Y`
  - [ ] `plexlists config show`
  - [ ] `plexlists test`
  - [ ] `plexlists sync FOLDER --dry-run`
- [ ] Verify examples work: `cp examples/config-local.json ~/.plexlists-conf.json`

## Documentation

- [ ] README.md complete and accurate
- [ ] QUICKSTART.md tested
- [ ] Examples in examples/ directory
- [ ] CHANGELOG.md updated with version
- [ ] PUBLISHING.md reviewed
- [ ] License file present

## Package

- [ ] package.json fields correct:
  - [ ] name
  - [ ] version
  - [ ] description
  - [ ] author
  - [ ] license
  - [ ] repository
  - [ ] keywords
- [ ] Check package contents: `npm pack --dry-run`
- [ ] Verify no sensitive files included
- [ ] .npmignore in place
- [ ] .gitignore in place

## npm Account

- [ ] npm account created
- [ ] Email verified
- [ ] Logged in: `npm whoami`
- [ ] Package name available: `npm info plexlists`

## Version

- [ ] Version number set: `npm version 1.0.0`
- [ ] Git tag created: `git tag v1.0.0`
- [ ] CHANGELOG.md reflects current version

## Git

- [ ] All changes committed
- [ ] Pushed to GitHub: `git push && git push --tags`
- [ ] README displays correctly on GitHub

## Publish

- [ ] Test publish: `npm publish --dry-run`
- [ ] Review output carefully
- [ ] Ready to publish: `npm publish`

## Post-Publish

- [ ] Verify on npm: https://www.npmjs.com/package/plexlists
- [ ] Test install from npm: `npm install -g plexlists`
- [ ] Create GitHub release with CHANGELOG
- [ ] Announce (optional):
  - [ ] GitHub Discussions
  - [ ] Reddit r/PleX
  - [ ] Twitter/X
  - [ ] Plex Forums

## Optional (but recommended)

- [ ] Add CI/CD GitHub Actions workflow
- [ ] Add badges to README (npm version, downloads, license)
- [ ] Create CONTRIBUTING.md guide
- [ ] Set up issue templates
- [ ] Add CODE_OF_CONDUCT.md
- [ ] Enable GitHub Discussions
- [ ] Add website/docs (GitHub Pages)

## Notes

Use this checklist for every release. Keep CHANGELOG.md updated!

## Quick Commands

```bash
# Pre-publish
npm install
npm test
npm link
npm pack --dry-run

# Set version
npm version patch  # or minor/major
git push && git push --tags

# Publish
npm publish

# Verify
npm info plexlists
npm install -g plexlists
plexlists --version
```
