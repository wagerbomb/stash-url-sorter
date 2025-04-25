# Stash URL Sorter

A plugin for Stash that adds a "Sort URLs" button to the performer edit page, allowing you to automatically sort performer URLs alphabetically by domain.

## Features

- Adds a "Sort URLs" button next to the URLs field in the performer edit page
- Sorts URLs by prioritizing known domains (social media, adult platforms, etc.)
- Secondary sorting is alphabetical by domain name
- Simple one-click operation
- Automatically refreshes the page after sorting

## Installation

1. Create a directory for the plugin in your Stash plugins directory:
   ```
   mkdir -p ~/.stash/plugins/stashURLSorter
   ```

2. Copy the plugin files to the directory:
   ```
   cp stash-url-sorter.js stashURLSorter.yml ~/.stash/plugins/stashURLSorter/
   ```

3. Restart Stash or reload plugins from the Settings page

## Usage

1. Navigate to a performer's edit page
2. Find the "URLs" field 
3. Click the "Sort URLs" button that appears next to the field
4. URLs will be sorted with recognized domains first, then alphabetically
5. The page will automatically reload to show the sorted URLs

## Customization

The plugin comes with a default list of domains that are prioritized during sorting. You can edit the `DOMAINS` array in the JavaScript file to customize this list.

## How It Works

The plugin uses Stash's GraphQL API to:
1. Fetch the current list of URLs for a performer
2. Sort them according to domain priority and alphabetical order
3. Update the performer record with the sorted URLs
4. Refresh the page to show the changes

## License

MIT License

## Author

wagerbomb

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
