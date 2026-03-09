# Publishing to npm

## Prerequisites

1. npm account: https://www.npmjs.com/signup
2. Login: `npm login`
3. Verify: `npm whoami`

## Prepare for publishing

### 1. Update package.json

Set your repository URL:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/plexlists.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/plexlists/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/plexlists#readme"
}
```

### 2. Test locally first

```bash
# Install dependencies
npm install

# Test the CLI
./bin/plexlists.js --help

# Run test script
npm test

# Link globally for testing
npm link
plexlists --help

# When done testing
npm unlink -g
```

### 3. Check package contents

```bash
# See what will be published
npm pack --dry-run

# Or create actual tarball for inspection
npm pack
tar -tzf plex-folder-playlist-cli-1.0.0.tgz
rm plex-folder-playlist-cli-1.0.0.tgz
```

### 4. Update version

```bash
# Bump version (patch/minor/major)
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

## Publish

### First time publish

```bash
npm publish
```

Package will be available at: https://www.npmjs.com/package/plex-folder-playlist-cli

### Subsequent updates

1. Make changes
2. Test locally: `npm link`
3. Update version: `npm version patch`
4. Publish: `npm publish`

## After publishing

Users can install with:

```bash
npm install -g plex-folder-playlist-cli
```

## CI/CD (GitHub Actions)

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
      
      - run: npm test
      
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Add `NPM_TOKEN` to GitHub repo secrets:
1. Create npm token: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Add to GitHub: Settings → Secrets → Actions → New secret

## Versioning Strategy

Follow semantic versioning (semver):

- **Patch** (1.0.x) - Bug fixes, no breaking changes
- **Minor** (1.x.0) - New features (backward compatible)
- **Major** (x.0.0) - Breaking changes

## Pre-release versions

Test before stable release:

```bash
npm version prerelease --preid=beta  # 1.0.0-beta.0
npm publish --tag beta
```

Users install with:
```bash
npm install -g plex-folder-playlist-cli@beta
```

## Troubleshooting

### "Package name already taken"

Change name in `package.json` or use scoped package (`@username/plex-folder-playlist-cli`).

### "You must verify your email"

Check npm account email verification.

### "403 Forbidden"

Ensure you're logged in: `npm whoami`

## Check package status

```bash
# View package info
npm info plex-folder-playlist-cli

# View all versions
npm view plex-folder-playlist-cli versions

# Download count (after published)
npm info plex-folder-playlist-cli downloads
```

## Unpublish (emergency only)

```bash
# Only within 72 hours of publish
npm unpublish plex-folder-playlist-cli@1.0.0

# Never unpublish if others depend on it!
```

## Best Practices

1. **Test thoroughly** before publishing
2. **Update README** with accurate install instructions
3. **Tag releases** in git: `git tag v1.0.0 && git push --tags`
4. **Write CHANGELOG** for each version
5. **Announce** new releases (GitHub, Twitter, etc.)

## License

Ensure LICENSE file is included and properly set in package.json.
