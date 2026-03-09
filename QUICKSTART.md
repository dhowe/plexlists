# Quick Setup

Get started with plex-folder-playlist-cli in 5 minutes.

## 1. Install

### Option A: From npm (recommended)

```bash
npm install -g plex-folder-playlist-cli
```

### Option B: From source

```bash
git clone https://github.com/yourusername/plexlists.git
cd plexlists
npm install
npm link
```

## 2. Find your Plex token

See [docs/FINDPLEXTOKEN.md](docs/FINDPLEXTOKEN.md) for instructions.

Quick method:
1. Open Plex Web
2. Play any media
3. Click ⋮ (three dots) → "Get Info"
4. Click "View XML"
5. Look for `X-Plex-Token=` in the URL

## 3. Configure

```bash
plexlists config set \
  --host=192.168.1.100 \
  --port=32400 \
  --token=YOUR_PLEX_TOKEN \
  --library=Music
```

**Or** copy an example config:

```bash
cp examples/config-local.json ~/.plexlists-cli.json
nano ~/.plexlists-cli.json  # Edit token
```

## 4. Test connection

```bash
plexlists test
```

Expected output:
```
Testing connection to Plex server...
Host: 192.168.1.100:32400
Config: /Users/you/.plexlists-cli.json

✅ Connection successful!
Server: My Plex Server
Version: 1.32.0
```

## 5. Create playlist folders

```bash
mkdir -p ~/Music/Playlists/Favorites
mkdir -p ~/Music/Playlists/Workout

# Add symlinks to tracks
ln -s ~/Music/Library/Artist/track1.mp3 ~/Music/Playlists/Favorites/
ln -s ~/Music/Library/Artist/track2.mp3 ~/Music/Playlists/Workout/
```

**Tip:** Use real files or symlinks - both work!

## 6. Sync to Plex

**Dry run first (preview):**

```bash
plexlists sync ~/Music/Playlists/* --dry-run
```

**Apply changes:**

```bash
plexlists sync ~/Music/Playlists/*
```

Expected output:
```
🔄 Syncing playlists to Plex library: "Music"
   Host: 192.168.1.100:32400
   Config: /Users/you/.plexlists-cli.json
   Folders: 2

➕ Creating: "Favorites" (/Users/you/Music/Playlists/Favorites)
   ✅ Created

➕ Creating: "Workout" (/Users/you/Music/Playlists/Workout)
   ✅ Created

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Summary:
   ✅ Created: 2
   🔄 Updated: 0
   ❌ Failed: 0
   ⏭️  Skipped: 0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 7. Check Plex

Open Plex and you'll see:
- Playlist "Favorites" with your tracks
- Playlist "Workout" with your tracks

## 8. Automate (optional)

### Cron (daily sync at 2 AM)

```bash
crontab -e
```

Add:
```cron
0 2 * * * cd ~/Music && plexlists sync Playlists/*
```

### On file change (macOS/Linux)

```bash
# Install fswatch (macOS: brew install fswatch)
fswatch -o ~/Music/Playlists | xargs -n1 -I{} plexlists sync ~/Music/Playlists/*
```

## Troubleshooting

### "Error: Plex token not configured"

Run: `plexlists config set --token=YOUR_TOKEN`

### "Connection failed"

1. Check host/port: `plexlists config show`
2. Verify Plex is running
3. Check firewall

### "No tracks found"

- Ensure folder has audio files
- Check symlinks: `ls -la ~/Music/Playlists/Favorites/`
- Use `--verbose` for debug logs

### Need help?

- [Full README](README.md)
- [Config guide](docs/CONFIG-PRIORITY.md)
- [GitHub Issues](https://github.com/yourusername/plexlists/issues)

## Next Steps

- Read [README.md](README.md) for advanced usage
- Explore [examples/](examples/) for different configs
- Set up [automation](README.md#automation)
- Contribute on [GitHub](https://github.com/yourusername/plexlists)

---

**That's it!** You're now syncing playlists to Plex. 🎉
