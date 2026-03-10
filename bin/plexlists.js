#!/usr/bin/env node

import { Command } from 'commander';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createPlexClient } from '../lib/plex/plexClient.js';
import { createPlaylist, deletePlaylist, getPlaylist } from '../lib/plex/index.js';
import logger from '../lib/plex/logger.js';

const DEFAULT_CONFIG_PATH = path.join(os.homedir(), '.plexlists-conf.json');
const program = new Command();

// ============================================================================
// Config Management
// ============================================================================

function getConfigPath(options) {
  // Priority: --config flag > env var > cwd/.plexlists-conf.json > default home config
  if (options?.config) {
    return path.resolve(options.config);
  }
  
  if (process.env.PLEX_PLAYLIST_CONFIG) {
    return path.resolve(process.env.PLEX_PLAYLIST_CONFIG);
  }
  
  const cwdConfig = path.join(process.cwd(), '.plexlists-conf.json');
  if (fs.existsSync(cwdConfig)) {
    return cwdConfig;
  }
  
  return DEFAULT_CONFIG_PATH;
}

function loadConfig(configPath) {
  try {
    if (!fs.existsSync(configPath)) {
      return null;
    }
    const raw = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Error loading config: ${error.message}`);
    return null;
  }
}

function saveConfig(config, configPath) {
  try {
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error saving config: ${error.message}`);
    return false;
  }
}

function getConfig(options) {
  const configPath = getConfigPath(options);
  const config = loadConfig(configPath);
  
  return {
    host: options.host || config?.host || 'localhost',
    port: options.port || config?.port || 32400,
    token: options.token || config?.token,
    timeout: options.timeout || config?.timeout || 60000,
    library: options.library || config?.library, // Library name from config
    configPath, // Include config path for display
  };
}

// ============================================================================
// Sync Command
// ============================================================================

async function syncPlaylists(folders, options) {
  const config = getConfig(options);
  
  if (!config.token) {
    console.error('Error: Plex token not configured.');
    console.error('Run: plexlists config set --token=YOUR_TOKEN');
    process.exit(1);
  }

  const { library, dryRun, cleanup, verbose } = options;
  
  // Library can come from --library flag or config file
  const libraryName = library || config.library;
  
  if (!libraryName) {
    console.error('Error: --library is required (or set "library" in config file)');
    console.error('Example: plexlists sync folder --library=Music');
    console.error('Or add "library": "Music" to your config file');
    process.exit(1);
  }

  logger.setDebugMode(verbose || false);

  const results = {
    updated: [],
    created: [],
    failed: [],
    skipped: [],
  };

  console.log(`\n🔄 Syncing playlists to Plex library: "${libraryName}"`);
  console.log(`   Host: ${config.host}:${config.port}`);
  console.log(`   Config: ${config.configPath}`);
  console.log(`   Folders: ${folders.length}`);
  if (dryRun) console.log(`   Mode: DRY RUN (no changes will be made)\n`);
  else console.log('');

  // Get existing playlists
  let existingPlaylists = [];
  try {
    const playlists = await getPlaylist(config.host, config.port, config.token, config.timeout);
    existingPlaylists = playlists || [];
  } catch (error) {
    console.warn(`⚠️  Could not fetch existing playlists: ${error.message}`);
  }

  // Process each folder
  for (const folderPath of folders) {
    const absolutePath = path.resolve(folderPath);
    
    if (!fs.existsSync(absolutePath)) {
      console.log(`⏭️  Skipping: ${folderPath} (not found)`);
      results.skipped.push({ folder: folderPath, reason: 'not found' });
      continue;
    }

    const stats = fs.statSync(absolutePath);
    if (!stats.isDirectory()) {
      console.log(`⏭️  Skipping: ${folderPath} (not a directory)`);
      results.skipped.push({ folder: folderPath, reason: 'not a directory' });
      continue;
    }

    const playlistName = path.basename(absolutePath);
    
    try {
      // Check if playlist already exists
      const existingPlaylist = existingPlaylists.find(
        p => p.title?.toLowerCase() === playlistName.toLowerCase()
      );

      if (existingPlaylist) {
        console.log(`🔄 Updating: "${playlistName}" (${absolutePath})`);
        
        if (!dryRun) {
          // Delete existing playlist
          await deletePlaylist(config.host, config.port, config.token, config.timeout, existingPlaylist.ratingKey);
          
          // Create new playlist
          const createData = {
            folderPath: absolutePath,
            playlistName: playlistName,
            libraryTitle: libraryName,
          };
          
          await createPlaylist(config.host, config.port, config.token, config.timeout, createData);
        }
        
        results.updated.push({ name: playlistName, folder: absolutePath });
        console.log(`   ✅ Updated\n`);
      } else {
        console.log(`➕ Creating: "${playlistName}" (${absolutePath})`);
        
        if (!dryRun) {
          const createData = {
            folderPath: absolutePath,
            playlistName: playlistName,
            libraryTitle: libraryName,
          };
          
          await createPlaylist(config.host, config.port, config.token, config.timeout, createData);
        }
        
        results.created.push({ name: playlistName, folder: absolutePath });
        console.log(`   ✅ Created\n`);
      }
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}\n`);
      results.failed.push({ name: playlistName, folder: absolutePath, error: error.message });
      // Continue with other playlists
    }
  }

  // Summary
  console.log('━'.repeat(60));
  console.log('📊 Summary:');
  console.log(`   ✅ Created: ${results.created.length}`);
  console.log(`   🔄 Updated: ${results.updated.length}`);
  console.log(`   ❌ Failed: ${results.failed.length}`);
  console.log(`   ⏭️  Skipped: ${results.skipped.length}`);
  console.log('━'.repeat(60));

  if (results.failed.length > 0) {
    console.log('\n❌ Failed playlists:');
    results.failed.forEach(f => {
      console.log(`   - ${f.name}: ${f.error}`);
    });
  }

  if (dryRun) {
    console.log('\n💡 This was a dry run. Run without --dry-run to apply changes.');
  }

  // Exit with error code if any failed
  process.exit(results.failed.length > 0 ? 1 : 0);
}

// ============================================================================
// Config Command
// ============================================================================

program
  .name('plexlists')
  .description('CLI for Plex Folder Playlist Creator')
  .version('1.0.0');

program
  .command('config')
  .description('Manage configuration')
  .argument('<action>', 'Action: set, show, path')
  .option('-c, --config <file>', 'Config file path (default: ~/.plexlists-conf.json)')
  .option('--host <host>', 'Plex server host/IP')
  .option('--port <port>', 'Plex server port', '32400')
  .option('--token <token>', 'Plex authentication token')
  .option('--library <name>', 'Default Plex library name (e.g., Music)')
  .option('--timeout <ms>', 'Request timeout in milliseconds', '60000')
  .action((action, options) => {
    const configPath = getConfigPath(options);
    
    if (action === 'show') {
      const config = loadConfig(configPath);
      if (!config) {
        console.log('No configuration found.');
        console.log(`Config file: ${configPath}`);
        return;
      }
      console.log('Current configuration:');
      console.log(`  Host: ${config.host || '(not set)'}`);
      console.log(`  Port: ${config.port || '(not set)'}`);
      console.log(`  Token: ${config.token ? '***' + config.token.slice(-4) : '(not set)'}`);
      console.log(`  Library: ${config.library || '(not set)'}`);
      console.log(`  Timeout: ${config.timeout || '(not set)'}`);
      console.log(`\nConfig file: ${configPath}`);
    } else if (action === 'set') {
      const existingConfig = loadConfig(configPath) || {};
      const newConfig = {
        host: options.host || existingConfig.host,
        port: parseInt(options.port) || existingConfig.port,
        token: options.token || existingConfig.token,
        library: options.library || existingConfig.library,
        timeout: parseInt(options.timeout) || existingConfig.timeout,
      };
      
      if (saveConfig(newConfig, configPath)) {
        console.log('✅ Configuration saved.');
        console.log(`Config file: ${configPath}`);
      } else {
        console.error('❌ Failed to save configuration.');
        process.exit(1);
      }
    } else if (action === 'path') {
      console.log(configPath);
    } else {
      console.error(`Unknown action: ${action}`);
      console.error('Valid actions: set, show, path');
      process.exit(1);
    }
  });

program
  .command('sync')
  .description('Sync playlists from folders')
  .argument('<folders...>', 'Folders to sync (e.g., ~/Music/Playlists/*)')
  .option('--library <name>', 'Plex library name (e.g., Music) - can also be set in config')
  .option('-c, --config <file>', 'Config file path')
  .option('--host <host>', 'Plex server host/IP')
  .option('--port <port>', 'Plex server port')
  .option('--token <token>', 'Plex authentication token')
  .option('--timeout <ms>', 'Request timeout in milliseconds')
  .option('--dry-run', 'Show what would be done without making changes')
  .option('--verbose', 'Enable verbose logging')
  .action(syncPlaylists);

program
  .command('test')
  .description('Test connection to Plex server')
  .option('-c, --config <file>', 'Config file path')
  .option('--host <host>', 'Plex server host/IP')
  .option('--port <port>', 'Plex server port')
  .option('--token <token>', 'Plex authentication token')
  .option('--timeout <ms>', 'Request timeout in milliseconds')
  .action(async (options) => {
    const config = getConfig(options);
    
    console.log('Testing connection to Plex server...');
    console.log(`Host: ${config.host}:${config.port}`);
    console.log(`Config: ${config.configPath}`);
    
    try {
      const client = createPlexClient(config.host, config.port, config.token, config.timeout);
      const serverInfo = await client.query('/');
      
      console.log('\n✅ Connection successful!');
      console.log(`Server: ${serverInfo.MediaContainer?.friendlyName || 'Unknown'}`);
      console.log(`Version: ${serverInfo.MediaContainer?.version || 'Unknown'}`);
    } catch (error) {
      console.error('\n❌ Connection failed:');
      console.error(`   ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
