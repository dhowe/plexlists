# plex-folder-playlist-cli

Command-line tool for syncing folder-based playlists to Plex Media Server.

## Features

- ✅ **Sync playlists from folders** - Folder name becomes playlist name
- ✅ **Update existing playlists** - Delete and recreate when content changes
- ✅ **Batch processing** - Sync multiple folders at once
- ✅ **Error tolerance** - Continue if one playlist fails
- ✅ **Dry run mode** - Preview changes before applying
- ✅ **Config file** - Store Plex credentials once
- ✅ **Symlink support** - Works with symlinked files
- ✅ **Cron-friendly** - Exit codes, logging for automation

## Installation

### Via npm

```bash
npm install -g plex-folder-playlist-cli
plex-playlist --help
```

### From source

```bash
git clone https://github.com/yourusername/plexlists.git
cd plexlists
npm install
npm link
plex-playlist --help
```

## Quick Start

```bash
# 1. Configure
plex-playlist config set \
  --host=192.168.1.100 \
  --port=32400 \
  --token=YOUR_PLEX_TOKEN \
  --library=Music

# 2. Test connection
plex-playlist test

# 3. Sync playlists
plex-playlist sync ~/Music/Playlists/*
```

## Configuration

### Config file format

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
- `host` (required) - Plex server hostname or IP
- `port` (optional) - Server port (default: 32400)
- `token` (required) - Plex authentication token ([how to find](docs/FINDPLEXTOKEN.md))
- `library` (optional) - Default library name (e.g., "Music", "Movies")
- `timeout` (optional) - Request timeout in ms (default: 60000)

### Config file locations (priority order)

1. `--config` flag - Explicit path
2. `PLEX_PLAYLIST_CONFIG` env var
3. `./.plex-playlist.json` - Project-specific
4. `~/.plex-playlist-cli.json` - User default

See [examples/](examples/) for sample configs and [docs/CONFIG-PRIORITY.md](docs/CONFIG-PRIORITY.md) for details.

## Usage

### Sync playlists

```bash
# Sync all playlists (library from config)
plex-playlist sync ~/Music/Playlists/*

# Override library
plex-playlist sync ~/Movies/Playlists/* --library=Movies

# Dry run (preview changes)
plex-playlist sync ~/Music/Playlists/* --dry-run

# Verbose logging
plex-playlist sync ~/Music/Playlists/* --verbose
```

### Config management

```bash
# Show config
plex-playlist config show

# Set config
plex-playlist config set --host=X --token=Y --library=Music

# Show config path
plex-playlist config path
```

### Test connection

```bash
plex-playlist test
```

## Automation

### Cron example (daily at 2 AM)

```bash
crontab -e
```

Add:
```cron
0 2 * * * cd /home/user/music-project && plex-playlist sync Playlists/* >> /var/log/plex-sync.log 2>&1
```

### systemd timer (Linux)

Create `/etc/systemd/system/plex-sync.service`:

```ini
[Unit]
Description=Sync Plex playlists

[Service]
Type=oneshot
User=your-user
WorkingDirectory=/home/your-user/music-project
ExecStart=/usr/local/bin/plex-playlist sync Playlists/*
```

Create `/etc/systemd/system/plex-sync.timer`:

```ini
[Unit]
Description=Sync Plex playlists daily

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

Enable:
```bash
sudo systemctl enable --now plex-sync.timer
```

## Folder Structure Example

```
~/Music/
  ├── Library/              # Your actual music files
  │   ├── Artist 1/
  │   │   ├── track1.mp3
  │   │   └── track2.mp3
  │   └── Artist 2/
  │       └── track3.mp3
  │
  └── Playlists/            # Playlist folders (symlinks)
      ├── Favorites/
      │   ├── track1.mp3 -> ~/Music/Library/Artist 1/track1.mp3
      │   └── track3.mp3 -> ~/Music/Library/Artist 2/track3.mp3
      │
      ├── Workout/
      │   └── track2.mp3 -> ~/Music/Library/Artist 1/track2.mp3
      │
      └── Chill/
          ├── track1.mp3 -> ~/Music/Library/Artist 1/track1.mp3
          └── track2.mp3 -> ~/Music/Library/Artist 1/track2.mp3
```

Sync:
```bash
cd ~/Music
plex-playlist sync Playlists/*
```

Result in Plex:
- Playlist "Favorites" with 2 tracks
- Playlist "Workout" with 1 track
- Playlist "Chill" with 2 tracks

## Documentation

- [Finding Plex Token](docs/FINDPLEXTOKEN.md)
- [Finding Host & Port](docs/FINDHOST_PORT.md)
- [Config Priority Guide](docs/CONFIG-PRIORITY.md)
- [Publishing to npm](PUBLISHING.md)

## Troubleshooting

### "Error: Plex token not configured"

```bash
plex-playlist config set --token=YOUR_TOKEN
```

### "Connection failed"

1. Check config: `plex-playlist config show`
2. Test connection: `plex-playlist test`
3. Verify Plex server is running and accessible
4. Check firewall settings

### "No tracks found"

- Verify folder contains audio files
- Check symlinks are not broken: `ls -la folder/`
- Enable verbose logging: `--verbose`
- Ensure Plex has scanned the library

### Which config is being used?

```bash
plex-playlist config path   # Show active config file
plex-playlist config show   # Show config contents
```

## Related Projects

- [Plex Folder Playlist Creator (GUI)](https://github.com/zackria/Plex-Folder-Playlist-Creator) - Electron desktop app with same functionality

## License

MIT - See [LICENSE](LICENSE)

## Contributing

Issues and pull requests welcome!

## Support

- [GitHub Issues](https://github.com/yourusername/plexlists/issues)
- [Original Project](https://github.com/zackria/Plex-Folder-Playlist-Creator)
