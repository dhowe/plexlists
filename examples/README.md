# Example Config Files

Example config files for different setups

## Quick Start

Copy an example and customize it:

```bash
# Local server
cp examples/config-local.json ~/.plexlists-conf.json
nano ~/.plexlists-conf.json  # Edit token

# Remote server
cp examples/config-remote.json ~/my-project/.plexlists-conf.json
nano ~/my-project/.plexlists-conf.json  # Edit host and token
```

## Files

- `config-local.json` - Local Plex server (localhost:32400)
- `config-remote.json` - Remote Plex server with HTTPS
- `config-lan.json` - LAN server via IP address