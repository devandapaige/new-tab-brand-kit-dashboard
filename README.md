# Brand Kit Dashboard - Browser Extension

A customizable new tab dashboard extension for Chrome and Firefox, designed for small businesses to create a branded bulletin board experience with reminders, favorite links, notes, and more.

## Features

- 🎨 **Fully Customizable Brand Colors** - Match your business brand with customizable primary, secondary, and accent colors
- 📝 **Daily Focus** - Set and track your main focus for the day
- ⏰ **Smart Reminders** - Add time-based reminders with browser notifications
- 🔔 **Notification Support** - Get notified when reminders are due
- 🔗 **Quick Links** - Organize your favorite links for quick access
- 📋 **Notes** - Keep important notes visible on your dashboard
- 💬 **Daily Inspiration** - Motivational quotes that change daily
- 🖼️ **Custom Background** - Set your own background image
- 👥 **Team Branding** - Customize greeting with your team name
- 💾 **Export/Import Settings** - Backup and share your configuration
- ⌨️ **Keyboard Shortcuts** - Quick access to features (see [KEYBOARD_SHORTCUTS.md](KEYBOARD_SHORTCUTS.md))
- 📋 **Quick Responses Popup** - Admin-managed text templates that can be copied to clipboard with one click

## Installation

### Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select this project folder
5. The extension will now replace your new tab page

### Firefox

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Select the `manifest.firefox.json` file from this project
5. The extension will now replace your new tab page

**Note:** For Firefox, you may need to rename `manifest.firefox.json` to `manifest.json` temporarily, or use a build process to switch between versions.

## Configuration

### Accessing Settings

1. Click the settings icon (⚙️) in the top right of the new tab page, OR
2. Right-click the extension icon in your browser toolbar and select "Options"

### Brand Colors

In the settings page, you can customize:

- **Primary Color**: Main brand color used for buttons and accents
- **Secondary Color**: Secondary brand color for highlights
- **Accent Color**: Accent color for reminders and alerts
- **Background Overlay**: Color that overlays the background image
- **Card Background**: Background color for dashboard cards
- **Text Colors**: Primary and secondary text colors

### Background Image

1. Find an image URL online (or host your own)
2. Paste the URL in the "Background Image URL" field
3. Adjust the background overlay color for better text readability

### Team Name

Customize the greeting by setting your team or user name in the General Settings section.

## Usage

### Daily Focus

- Type your main focus for the day in the "Daily Focus" section
- Click "Save" to store it
- It will persist throughout the day

### Adding Reminders

1. Click "+ Add" in the Reminders section (or press **R**)
2. Enter a title and optional description
3. Set the date and time (must be in the future)
4. Click "Add Reminder"
5. Reminders are sorted by time and only show upcoming ones
6. You'll receive a browser notification when the reminder time arrives

### Adding Links

1. Click "+ Add" in the Quick Links section (or press **L**)
2. Enter a name and URL
3. Click "Add Link"
4. Links appear as clickable cards
5. Right-click a link to delete it

### Adding Notes

1. Click "+ Add" in the Notes section (or press **N**)
2. Enter a title and content
3. Click "Add Note"
4. Right-click a note to delete it

### Quick Responses (Admin Feature)

**Setting up Quick Responses:**

1. Go to Settings
2. Scroll to "Quick Responses (Admin)" section
3. Set an admin password (optional but recommended)
4. Click "Unlock Admin Settings" and enter the password
5. Click "+ Add Response" to create text templates
6. Fill in:
   - Title: A short name for the response
   - Category: Optional category (e.g., "Customer Service", "Sales")
   - Text: The text that will be copied to clipboard
7. Click "Add Response"

**Using Quick Responses:**

1. Click the extension icon in your browser toolbar
2. A popup will show all available quick responses
3. Search for responses using the search bar
4. Click any response to copy it to your clipboard
5. Paste it wherever you need it!

**Admin Features:**
- Password protection for admin settings
- Add, edit, and delete responses
- Organize responses by category
- All responses are synced across devices

### Export/Import Settings

**Export Settings:**
1. Go to Settings
2. Scroll to "Export & Import Settings"
3. Click "Export Settings"
4. A JSON file will be downloaded with all your settings

**Import Settings:**
1. Go to Settings
2. Click "Import Settings"
3. Select a previously exported JSON file
4. Your settings will be restored

This is useful for:
- Backing up your configuration
- Sharing settings with team members
- Transferring settings between browsers

## File Structure

```
brand-kit-dashboard/
├── manifest.json              # Chrome manifest
├── manifest.firefox.json      # Firefox manifest
├── newtab.html               # New tab page HTML
├── options.html              # Settings page HTML
├── background.js             # Background service worker
├── styles/
│   ├── newtab.css           # New tab page styles
│   └── options.css          # Settings page styles
├── scripts/
│   ├── newtab.js            # New tab page logic
│   ├── options.js           # Settings page logic
│   └── popup.js             # Extension popup logic
├── icons/                    # Extension icons (create these)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── popup.html              # Extension popup (Quick Responses)
├── README.md                 # This file
├── INSTALLATION.md          # Detailed installation guide
└── KEYBOARD_SHORTCUTS.md    # Keyboard shortcuts reference
```

## Creating Icons

You'll need to create icon files for the extension:

- `icons/icon16.png` - 16x16 pixels
- `icons/icon48.png` - 48x48 pixels
- `icons/icon128.png` - 128x128 pixels

### Methods to Create Icons

- Use any image editor (Photoshop, GIMP, Canva, etc.)
- Use online icon generators (e.g., favicon-generator.org)
- Create simple colored squares with your brand colors
- The icons should represent your brand or the dashboard concept

## Customization for Administrators

### Brand Color Setup

1. Identify your brand's primary, secondary, and accent colors
2. Convert them to hex format (e.g., #4A90E2)
3. Enter them in the settings page
4. All dashboard elements will update to match your brand

### Team Deployment

For deploying to a team:

1. Configure the extension with your brand colors
2. Set up default links that your team uses
3. Export the settings (you may need to manually document them)
4. Share the configured extension or settings with your team

**Note:** Browser extensions store data locally. For team-wide deployment, consider:
- Creating a setup guide with recommended settings
- Using group policy (for enterprise Chrome)
- Creating a packaged extension with default settings

## Browser Compatibility

- **Chrome**: Manifest V3 (Chrome 88+)
- **Firefox**: Manifest V2 (Firefox 109+)

## Privacy

- All data is stored locally in your browser
- No data is sent to external servers

## Troubleshooting

### Settings not saving
- Check browser permissions
- Try refreshing the settings page
- Clear browser cache if issues persist

### Colors not updating
- Save settings and refresh the new tab page
- Check that color values are in correct format (hex for colors, rgba for backgrounds)

## Development

### Making Changes

1. Edit the relevant files
2. In Chrome: Go to `chrome://extensions/` and click the refresh icon on your extension
3. In Firefox: Reload the extension in `about:debugging`

### Testing

- Test color changes in the settings page
- Verify all features work in both Chrome and Firefox
- Test responsive design on different screen sizes

## License

This project is open source and available for customization.

## Support

For issues or questions, check the code comments or modify as needed for your business requirements.

