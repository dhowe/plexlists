# Example Config Files

This directory contains example configuration files for different Plex server setups.

## Quick Start

Copy an example and customize it:

```bash
# Local server
cp examples/config-local.json ~/.plexlists-cli.json
nano ~/.plexlists-cli.json  # Edit token

# Remote server
cp examples/config-remote.json ~/my-project/.plexlists.json
nano ~/my-project/.plexlists.json  # Edit host and token
```

## Files

- `config-local.json` - Local Plex server (localhost:32400)
- `config-remote.json` - Remote Plex server with HTTPS
- `config-lan.json` - LAN server via IP address
- `config-minimal.json` - Minimal config (uses defaults)

## Usage

See [CLI.md](../CLI.md) and [CONFIG-PRIORITY.md](../docs/CONFIG-PRIORITY.md) for full documentation.
