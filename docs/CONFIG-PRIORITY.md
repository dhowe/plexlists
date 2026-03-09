# Quick Reference: Config File Priority

The CLI finds config in this order (first found wins):

```
1. --config flag       →  plex-playlist sync ... --config=/path/to/config.json
2. Environment var     →  export PLEX_PLAYLIST_CONFIG=~/my-config.json
3. Current directory   →  ./.plex-playlist.json
4. Home directory      →  ~/.plex-playlist-cli.json
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
- `token` (required) - Plex authentication token (see FINDPLEXTOKEN.md)
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
  "library": "Music",
  "timeout": 120000
}
```

**LAN server:**
```json
{
  "host": "192.168.1.50",
  "port": 32400,
  "token": "abc123xyz",
  "library": "Music"
}
```

**Minimal (port, library, timeout use defaults):**
```json
{
  "host": "plex.local",
  "token": "abc123xyz"
}
```

## Examples

### Default (home config)
```bash
plex-playlist config set --host=X --token=Y
# Creates: ~/.plex-playlist-cli.json
# Used by all commands unless overridden
```

### Project-specific config
```bash
cd ~/my-music-project
plex-playlist config set --host=X --token=Y
# Creates: ~/my-music-project/.plex-playlist.json
# Used when running from this directory
```

### Custom config path
```bash
plex-playlist sync folder --library=Music --config=/etc/plex/config.json
# Uses: /etc/plex/config.json (one-time)
```

### Environment variable
```bash
export PLEX_PLAYLIST_CONFIG=~/servers/home-plex.json
plex-playlist sync folder --library=Music
# Uses: ~/servers/home-plex.json
```

## Common Patterns

### Multiple Plex servers
```bash
# Home server
plex-playlist sync ~/Music/Playlists/* --library=Music \
  --config=~/.plex-home.json

# VPS server
plex-playlist sync ~/Music/Playlists/* --library=Music \
  --config=~/.plex-vps.json
```

### Per-project configs (recommended for teams)
```bash
# Each project has .plex-playlist.json in its root
cd ~/project-a && plex-playlist sync Playlists/* --library=Music
cd ~/project-b && plex-playlist sync Playlists/* --library=Music
```

### Shared config via env var (recommended for servers)
```bash
# In ~/.bashrc or cron environment
export PLEX_PLAYLIST_CONFIG=/opt/plex-config.json

# Now all commands use shared config
plex-playlist sync /media/playlists/* --library=Music
```

## Check active config

```bash
# Show config path
plex-playlist config path

# Show config contents
plex-playlist config show

# Both work with --config flag:
plex-playlist config show --config=/path/to/config.json
```

## Tips

✅ **DO:**
- Use project-specific configs (`.plex-playlist.json` in project root)
- Use env vars for shared servers
- Use `--config` for one-off commands

❌ **DON'T:**
- Mix configs without understanding priority
- Hardcode tokens in scripts (use config files)
- Forget to check `config path` when debugging
