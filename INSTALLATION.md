# Installation Guide

This document provides detailed instructions for installing the Stash URL Sorter plugin.

## Prerequisites

- A working Stash instance
- Access to your Stash plugins directory

## Installation Methods

### Method 1: Manual Installation

1. Download the plugin files from GitHub:
   - `stash-url-sorter.js`
   - `stashURLSorter.yml`

2. Create a directory for the plugin in your Stash plugins directory:
   ```bash
   mkdir -p ~/.stash/plugins/stashURLSorter
   ```
   
   Note: The exact path may vary depending on your Stash installation. Common locations include:
   - Linux: `~/.stash/plugins/` or `/root/.stash/plugins/`
   - Windows: `C:\Users\YourUsername\.stash\plugins\`
   - Docker: You'll need to mount a volume to access the plugins directory

3. Copy the plugin files to the directory:
   ```bash
   cp stash-url-sorter.js stashURLSorter.yml ~/.stash/plugins/stashURLSorter/
   ```

4. Restart Stash or reload plugins from the Settings page

### Method 2: Using Git

1. Navigate to your Stash plugins directory:
   ```bash
   cd ~/.stash/plugins/
   ```

2. Clone the repository:
   ```bash
   git clone https://github.com/[YourUsername]/stash-url-sorter.git stashURLSorter
   ```

3. Restart Stash or reload plugins from the Settings page

## Verification

To verify that the plugin is installed correctly:

1. Open Stash in your web browser
2. Go to Settings > Plugins
3. Check that "Stash URL Sorter" appears in the list of plugins
4. Navigate to any performer's edit page to confirm the "Sort URLs" button appears next to the URLs field

## Troubleshooting

If the plugin doesn't appear or work correctly:

1. Check that the files are in the correct location
2. Ensure the plugin is enabled in the Stash plugins settings
3. Check your browser's console for any JavaScript errors
4. Restart your Stash instance completely

## Updates

To update the plugin:

1. Download the latest version from GitHub
2. Replace the existing files in your plugins directory
3. Restart Stash or reload plugins from the Settings page

If you installed using git, simply run:
```bash
cd ~/.stash/plugins/stashURLSorter
git pull
```