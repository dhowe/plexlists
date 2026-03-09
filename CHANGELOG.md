# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-09

### Added
- Initial release
- Sync playlists from folders to Plex
- Config file support with priority system
- Dry-run mode
- Verbose logging
- Symlink support
- Error tolerance (continue on failure)
- Batch processing
- Library name in config
- Examples for different server setups
- Test script

### Commands
- `sync` - Sync playlists from folders
- `config` - Manage configuration (show/set/path)
- `test` - Test Plex connection

### Documentation
- README with quick start
- PUBLISHING guide
- CONFIG-PRIORITY guide
- FINDPLEXTOKEN guide
- FINDHOST_PORT guide
- Example configs

## [Unreleased]

### Planned
- Progress bars for long syncs
- JSON output mode for scripting
- Watch mode (auto-sync on file changes)
- Playlist diff (compare before updating)
- Multi-library support in single command
- Smart playlist creation rules
