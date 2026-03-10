# plexlists

Command-line tool for syncing folder-based playlists in Plex

## Features

- ✅ **Sync playlists from folders** - Folder name becomes playlist name
- ✅ **Update existing playlists** - Automatic update of playlists on content change
- ✅ **Batch processing** - Sync multiple folders at once
- ✅ **Config file** - Store credentials once
- ✅ **Symlink support** - Works with symlinked files


## Installation

### Via npm

```bash
npm install -g plexlists
plexlists --help
```

### From source

```bash
git clone https://github.com/dhowe/plexlists.git
cd plexlists
npm install
npm link
plexlists --help
```

## Quick Start

```bash
# 1. Configure
plexlists config set \
  --host=192.168.1.100 \
  --port=32400 \
  --token=YOUR_PLEX_TOKEN \
  --library=Music

# 2. Test connection
plexlists test

# 3. Sync playlists
plexlists sync ~/Music/Playlists/*
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
- `token` (required) - Plex authentication token ([how to find](docs/FIND_PLEX_TOKEN.md))
- `library` (optional) - Default library name (e.g., "Music", "Movies")
- `timeout` (optional) - Request timeout in ms (default: 60000)

### Config file locations (priority order)

1. `--config` flag - Explicit path
2. `PLEX_PLAYLIST_CONFIG` env var
3. `./.plexlists-conf.json` - Project-specific
4. `~/.plexlists-conf.json` - User default

See [examples/](examples/) for sample configs and [docs/CONFIG-PRIORITY.md](docs/CONFIG-PRIORITY.md) for details.

## Usage

### Sync playlists

```bash
# Sync all playlists (library from config)
plexlists sync ~/Music/Playlists/*

# Override library
plexlists sync ~/Movies/Playlists/* --library=Movies

# Dry run (preview changes)
plexlists sync ~/Music/Playlists/* --dry-run

# Verbose logging
plexlists sync ~/Music/Playlists/* --verbose
```

### Config management

```bash
# Show config
plexlists config show

# Set config
plexlists config set --host=X --token=Y --library=Music

# Show config path
plexlists config path
```

### Test connection

```bash
plexlists test
```

## Automation

### Cron example (daily at 2 AM)

```bash
crontab -e
```

Add:
```cron
0 2 * * * cd /home/user/music-project && plexlists sync Playlists/* >> /var/log/plexlists.log 2>&1
```

### systemd timer (Linux)

Create `/etc/systemd/system/plexlists.service`:

```ini
[Unit]
Description=Sync Plex playlists

[Service]
Type=oneshot
User=your-user
WorkingDirectory=/home/your-user/music-project
ExecStart=/usr/local/bin/plexlists sync Playlists/*
```

Create `/etc/systemd/system/plexlists.timer`:

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
sudo systemctl enable --now plexlists.timer
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
plexlists sync Playlists/*
```

Result in Plex:
- Playlist "Favorites" with 2 tracks
- Playlist "Workout" with 1 track
- Playlist "Chill" with 2 tracks

## Documentation

- [Finding Plex Token](docs/FIND_PLEX_TOKEN.md)
- [Finding Host & Port](docs/FINDHOST_PORT.md)
- [Config Priority Guide](docs/CONFIG-PRIORITY.md)
- [Publishing to npm](PUBLISHING.md)

## Troubleshooting

### "Error: Plex token not configured"

```bash
plexlists config set --token=YOUR_TOKEN
```

### "Connection failed"

1. Check config: `plexlists config show`
2. Test connection: `plexlists test`
3. Verify Plex server is running and accessible
4. Check firewall settings

### "No tracks found"

- Verify folder contains audio files
- Check symlinks are not broken: `ls -la folder/`
- Enable verbose logging: `--verbose`
- Ensure Plex has scanned the library

### Which config is being used?

```bash
plexlists config path   # Show active config file
plexlists config show   # Show config contents
```

## Related Projects

- [Plex Folder Playlist Creator (GUI)](https://github.com/zackria/Plex-Folder-Playlist-Creator) - Electron desktop app with same functionality

## Credits
Based on code by Zack Dawood (https://github.com/zackria)

## License

MIT - See [LICENSE](LICENSE)

## Contributing

Issues and pull requests welcome!

## Support

- [GitHub Issues](https://github.com/yourusername/plexlists/issues)
- [Original Project](https://github.com/zackria/Plex-Folder-Playlist-Creator)
