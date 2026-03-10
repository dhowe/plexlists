# Quick Reference: Config File Priority

`plexlists` finds config in this order:

```
1. --config flag       →  plexlists sync ... --config=/path/to/config.json
2. Environment var     →  export PLEX_PLAYLIST_CONFIG=~/my-config.json
3. Current directory   →  ./.plexlists-conf.json
4. Home directory      →  ~/.plexlists-conf.json
```

## Config File Format

All config files use the same JSON structure:

```json
{
  "host": "192.168.1.100",
  "port": 32400,
  "token": "YOUR_PLEX_TOKEN",
  "library": "Music",
  "timeout": 60000
}
```

**Fields:**
- `host` (required) - Plex server hostname or IP (can include protocol: `http://` or `https://`)
- `port` (optional) - Server port, default: 32400
- `token` (required) - Plex authentication token (see FIND_PLEX_TOKEN.md)
- `library` (optional) - Default Plex library name (e.g., "Music", "Movies", "TV Shows")
- `timeout` (optional) - Request timeout in milliseconds, default: 60000 (1 minute)

**Note:** `library` in config avoids repeating `--library` on every command. CLI `--library` flag overrides config.

## Sample Configs

**Local Plex server:**
```json
{
  "host": "localhost",
  "port": 32400,
  "token": "abc123xyz",
  "library": "Music"
}
```

**Remote server with HTTPS:**
```json
{
  "host": "https://plex.mydomain.com",
  "port": 443,
  "token": "abc123xyz",
  "library":"/Users/home/me/Music",
  "timeout": 120000
}
```

**LAN server:**
```json
{
  "host": "192.168.1.50",
  "port": 32400,
  "token": "abc123xyz",
  "library": "/Users/home/me/Music"
}
```

## Examples

### Default (home config)
```bash
plexlists config set --host=X --token=Y
# Creates: ~/.plexlists-conf.json
# Used by all commands unless overridden
```

### Project-specific config
```bash
cd ~/my-music-project
plexlists config set --host=X --token=Y
# Creates: ~/my-music-project/.plexlists-conf.json
# Used when running from this directory
```

### Custom config path
```bash
plexlists sync folder --library=Music --config=/etc/plex/config.json
# Uses: /etc/plex/config.json (one-time)
```

### Environment variable
```bash
export PLEX_PLAYLIST_CONFIG=~/servers/home-plex.json
plexlists sync folder --library=Music
# Uses: ~/servers/home-plex.json
```

## Common Patterns

### Multiple Plex servers
```bash
# Home server
plexlists sync ~/Music/Playlists/* --library=Music \
  --config=~/.plex-home.json

# VPS server
plexlists sync ~/Music/Playlists/* --library=Music \
  --config=~/.plex-vps.json
```

### Per-project configs (recommended for teams)
```bash
# Each project has .plexlists-conf.json in its root
cd ~/project-a && plexlists sync Playlists/* --library=Music
cd ~/project-b && plexlists sync Playlists/* --library=Music
```

### Shared config via env var (recommended for servers)
```bash
# In ~/.bashrc or cron environment
export PLEX_PLAYLIST_CONFIG=/opt/plex-config.json

# Now all commands use shared config
plexlists sync /media/playlists/* --library=Music
```

## Check active config

```bash
# Show config path
plexlists config path

# Show config contents
plexlists config show

# Both work with --config flag:
plexlists config show --config=/path/to/config.json
```

## Tips

✅ **DO:**
- Use project-specific configs (`.plexlists-conf.json` in project root)
- Use env vars for shared servers
- Use `--config` for one-off commands

❌ **DON'T:**
- Mix configs without understanding priority
- Hardcode tokens in scripts (use config files)
- Forget to check `config path` when debugging
