# Brand Kit Dashboard - Browser Extension

A customizable new tab dashboard extension for Chrome and Firefox, designed for small businesses to create a branded bulletin board experience with reminders, favorite links, notes, and more.

> **📌 Developer Mode Extension:** This extension must be installed in developer mode (Chrome) or via `about:debugging` (Firefox) since it's not published to browser stores. See the [Installation](#installation) section below for detailed instructions.

## Features

### Core Dashboard Features
- **Fully Customizable Brand Colors** - Match your business brand with customizable primary, secondary, and accent colors with live previews
- **Custom Background** - Set your own background image via URL or file upload with adjustable overlay and opacity controls
- **Team Branding** - Customize greeting with your team/user name and company logo
- **Business Information** - Display up to 4 lines of business info (address, phone, etc.) with hover card for better visibility during video calls
- **Custom Header** - Customize header text with placeholders for greeting, date, and user name (case-insensitive)
- **Card Visibility & Order Controls** - Arrange card order and show/hide specific cards (Trackers, Notes, Quick Links, Todoist, and custom text cards) for all users

### Content Management
- **Trackers** - Create countdowns or countups to track important dates and events with icons and optional clickable URLs
- **Quick Links** - Organize favorite links with custom icons. Support for multiple URLs per link (opens all in new tabs)
- **Notes** - Keep important notes visible on the dashboard with optional clickable URLs
- **Todoist Integration** - Connect your Todoist account to display today's tasks directly on the dashboard
- **Quick Responses Popup** - Admin-managed text templates that can be copied to clipboard with one click

### Customization Options
- **Card Appearance** - Customize card background color, opacity, text colors, border colors, shadow intensity, and border radius
- **Background Overlay** - Adjustable overlay color and opacity for better text readability
- **Color Previews** - Live preview boxes for all color selections
- **Company Logo** - Upload a PNG logo to display in the top-left corner

### Admin & Security
- **Admin Password Protection** - Lock settings with a password so staff can view but not modify
- **Settings Lock/Unlock** - Easy toggle to protect configuration changes
- **Export/Import Settings** - Backup and share your configuration as JSON files

### User Experience
- **Keyboard Shortcuts** - Quick access to features (see [KEYBOARD_SHORTCUTS.md](KEYBOARD_SHORTCUTS.md))
- **Sticky Navigation** - Quick navigation menu in settings for easy access to all sections
- **Smooth Animations** - Polished transitions and hover effects throughout
- **Responsive Design** - Works beautifully on all screen sizes
- **Accessibility** - Focus states, ARIA labels, and keyboard navigation support

## Installation

> **⚠️ Developer Mode Required:** This extension must be installed in developer mode since it's not published to browser stores. Developer mode allows you to load unpacked extensions directly from your local filesystem.

### Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. **Enable "Developer mode"** (toggle in the top right corner) - This is required to load unpacked extensions
3. Click "Load unpacked"
4. Select this project folder
5. The extension will now replace your new tab page

**Note:** Extensions loaded in developer mode will persist across browser restarts, but you'll see a developer mode warning banner. This is normal and safe for personal/development use.

### Firefox

> **⚠️ Developer Mode Required:** Firefox uses `about:debugging` (Firefox's developer interface) to load unpacked extensions. Unlike Chrome, Firefox treats these as "temporary add-ons" which may be removed after browser updates.

**Important:** Firefox looks for `manifest.json` in the root directory. You need to temporarily swap the manifest files before loading.

#### Quick Method (Using Helper Scripts)

1. **Switch to Firefox manifest:**
   ```bash
   ./switch-to-firefox.sh
   ```

2. **Load the extension in developer mode:**
   - Open Firefox and navigate to `about:debugging` (Firefox's developer interface)
   - Click "This Firefox" in the left sidebar
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file (it's now the Firefox version)
   - The extension will now replace your new tab page

3. **After testing, restore Chrome manifest:**
   ```bash
   ./switch-to-chrome.sh
   ```

#### Manual Method

1. **Backup and swap manifests:**
   ```bash
   cp manifest.json manifest.chrome.json
   cp manifest.firefox.json manifest.json
   ```

2. **Load the extension:**
   - Open Firefox and navigate to `about:debugging`
   - Click "This Firefox" in the left sidebar
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file

3. **Restore Chrome manifest when done:**
   ```bash
   cp manifest.chrome.json manifest.json
   ```

#### Permanent Firefox Installation

**⚠️ Important:** Temporary add-ons loaded via `about:debugging` are removed when Firefox restarts or updates. For permanent installation, see **[PERMANENT_FIREFOX_INSTALL.md](PERMANENT_FIREFOX_INSTALL.md)** for detailed options:

- **Firefox Developer Edition** (Recommended for personal use) - Allows permanent installation of unsigned extensions
- **Package as .xpi** - Semi-permanent, may still need reloading after major updates
- **Submit to Firefox Add-ons (AMO)** - Truly permanent, signed extension for distribution
- **Enterprise Policy** - For organizational deployment

Quick permanent install option:
```bash
./package-firefox.sh
```
Then install the `.xpi` file in Firefox Developer Edition (see `PERMANENT_FIREFOX_INSTALL.md` for full instructions).

## Configuration

### Accessing Settings

1. Click the settings icon (⚙️) in the top right of the new tab page, OR
2. Right-click the extension icon in your browser toolbar and select "Options"

### Brand Colors

In the settings page, you can customize:

- **Primary Color**: Main brand color used for buttons and accents (with live preview)
- **Secondary Color**: Secondary brand color for highlights (with live preview)
- **Accent Color**: Accent color for reminders and alerts (with live preview)
- **Background Overlay**: Color that overlays the background image with adjustable opacity
- **Card Background**: Background color for dashboard cards with adjustable opacity
- **Text Colors**: Primary, secondary, and header text colors
- **Border Color**: Border color for cards and dividers with adjustable opacity
- **Shadow Intensity**: Adjust the intensity of card shadows (0-100%)
- **Border Radius**: Customize the roundness of all UI elements (0-24px)

### Background Image

1. Find an image URL online (or host your own), OR
2. Upload an image file directly (supports up to 5MB)
3. Preview the image before saving
4. Adjust the background overlay color and opacity for better text readability
5. Toggle overlay on/off as needed

### Team Name & Logo

- **Team/User Name**: Customize the greeting by setting your team or user name in the General Settings section
- **Company Logo**: Upload a square PNG logo (recommended: 200x200px or larger) to display in the top-left corner

### Business Information

Add up to 4 lines of business information (address, phone, etc.) that appears in the header:
- Use `{{userName}}` placeholder to insert the team/user name
- Hover over the business info to view it in a card with enhanced contrast (useful during video calls or busy backgrounds)

### Custom Header

Customize the header text with placeholders:
- **Header Title**: Use `{{greeting}}` for time-based greeting, `{{userName}}` for team name
- **Header Text**: Use `{{date}}` for current date/time, `{{userName}}` for team name
- Placeholders are case-insensitive

## Usage

### Trackers (Countdowns/Countups)

Trackers help you count down to or count up from important dates:

1. Go to Settings and unlock admin settings
2. Scroll to "Trackers" section
3. Click "+ Add Tracker"
4. Fill in:
   - **Name**: Event name (e.g., "Product Launch")
   - **Type**: Countdown (to date) or Count Up (from date)
   - **Date & Time**: Target date and time
   - **Icon**: Choose from emoji icons
   - **Pin to Dashboard**: Only pinned trackers appear on the dashboard
   - **Link URL** (optional): Make the tracker clickable
5. Click "Add Tracker"
6. Trackers appear on the dashboard with real-time countdown/countup display

**Batch Management**: Edit or delete trackers from the Settings page.

### Quick Links

Organize your favorite links for quick access:

1. Go to Settings and unlock admin settings
2. Scroll to "Quick Links" section
3. Click "+ Add Link" for single link, or "+ Batch Add" for multiple links
4. Fill in:
   - **Name**: Link name (e.g., "Newsletter")
   - **URLs**: One or multiple URLs (separate with commas for batch, or use "Add Another URL" button)
   - **Icon** (optional): Custom emoji or leave empty for first letter
5. Click "Add Link"
6. Links appear as clickable cards on the dashboard
7. Multiple URLs per link will all open in new tabs when clicked

**Batch Add Format**: `Name | URL1,URL2,URL3 | Icon`

### Notes

Keep important notes visible on your dashboard:

1. Go to Settings and unlock admin settings
2. Scroll to "Notes" section
3. Click "+ Add Note"
4. Fill in:
   - **Title**: Note title
   - **Content**: Note content
   - **Link URL** (optional): Make the note clickable
5. Click "Add Note"
6. Notes appear on the dashboard

### Todoist Integration

Display your Todoist tasks directly on the dashboard:

1. Go to Settings
2. Scroll to "Todoist Integration" section
3. Get your API token from [Todoist Settings → Integrations](https://todoist.com/app/settings/integrations)
4. Paste the API token in the settings
5. Save settings
6. Your Todoist tasks for today will appear in the "Todoist Today" card
7. Click the refresh button (↻) to manually refresh tasks
8. Check off tasks directly on the dashboard (syncs with Todoist)

### Quick Responses (Admin Feature)

**Setting up Quick Responses:**

1. Go to Settings
2. Scroll to "Quick Responses" section
3. Set an admin password (optional but recommended) in the "Admin Access" section
4. Click "Unlock Settings" and enter the password if set
5. Scroll to "Quick Responses" section
6. Click "+ Add Response" to create text templates
7. Fill in:
   - **Title**: A short name for the response
   - **Category**: Optional category (e.g., "Customer Service", "Sales")
   - **Text**: The text that will be copied to clipboard
8. Click "Add Response"

**Using Quick Responses:**

1. Click the extension icon in your browser toolbar
2. A popup will show all available quick responses
3. Search for responses using the search bar (searches title, category, and text)
4. Click any response to copy it to your clipboard
5. A confirmation message appears when copied
6. Paste it wherever you need it!

**Admin Features:**
- Password protection for admin settings (staff can view but not modify)
- Add, edit, and delete responses
- Organize responses by category
- All responses are synced across devices
- Search functionality in popup

### Admin Password Protection

Protect your settings from unauthorized changes:

1. Go to Settings
2. In the "Admin Access" section, set an admin password (or leave empty for no protection)
3. Click "Set Password"
4. Settings will be locked - staff can view but cannot make changes
5. Click "Unlock Settings" and enter password to make changes
6. Click "Lock Settings" when done to protect again

**Note**: If no password is set, settings are unlocked by default.

### Card Visibility & Order

Control which cards appear on the dashboard and arrange their order:

1. Go to Settings
2. Scroll to "Card Visibility & Order" section
3. **Reorder cards**: Drag cards up or down to change their order (cards appear left to right on the dashboard)
4. **Toggle visibility**: Use the toggle switches to show/hide cards:
   - **Trackers Card**: Show/hide countdown trackers
   - **Notes Card**: Show/hide notes
   - **Quick Links Card**: Show/hide quick links
   - **Todoist Card**: Show/hide Todoist tasks
5. **Add text cards**: Click "+ Add Blank Text Card" to create custom text cards with HTML content
6. Changes are saved automatically - no need to click save
7. Cards appear on the dashboard in the order shown in settings, distributed across columns left to right

### Export/Import Settings

**Export Settings:**
1. Go to Settings
2. Scroll to "Export & Import Settings"
3. Click "Export Settings"
4. A JSON file will be downloaded with all your settings (except large images stored locally)

**Import Settings:**
1. Go to Settings
2. Click "Import Settings"
3. Select a previously exported JSON file
4. Your settings will be restored
5. Refresh the dashboard to see changes

This is useful for:
- Backing up your configuration
- Sharing settings with team members
- Transferring settings between browsers
- Setting up multiple workstations with the same configuration

## File Structure

```
brand-kit-dashboard/
├── manifest.json              # Chrome manifest (swapped to Firefox version for testing)
├── manifest.chrome.json        # Chrome manifest backup (created when switching)
├── manifest.firefox.json      # Firefox manifest
├── switch-to-firefox.sh       # Helper script to switch to Firefox manifest
├── switch-to-chrome.sh        # Helper script to restore Chrome manifest
├── newtab.html               # New tab page HTML
├── options.html              # Settings page HTML
├── background.js             # Background service worker
├── styles/
│   ├── newtab.css           # New tab page styles
│   ├── options.css          # Settings page styles
│   └── popup.css            # Extension popup styles
├── scripts/
│   ├── newtab.js            # New tab page logic
│   ├── options.js           # Settings page logic
│   └── popup.js             # Extension popup logic
├── icons/                    # Extension icons (create these)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── popup.html              # Extension popup (Quick Responses)
├── README.md                      # This file
├── INSTALLATION.md                 # Detailed installation guide
├── FIREFOX_COMPATIBILITY.md        # Firefox compatibility guide
├── PERMANENT_FIREFOX_INSTALL.md    # Guide for permanent Firefox installation
└── KEYBOARD_SHORTCUTS.md          # Keyboard shortcuts reference
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

This extension runs in **developer mode**, which means:

- ✅ You can edit code and see changes immediately
- ✅ No need to repackage or reinstall for development
- ✅ Full access to browser developer tools
- ⚠️ Chrome shows a developer mode warning (normal and safe)
- ⚠️ Firefox may remove temporary add-ons after updates (use Developer Edition for permanent dev install)

### Making Changes

1. Edit the relevant files in your code editor
2. **For Chrome:** 
   - Go to `chrome://extensions/`
   - Find your extension and click the refresh icon (🔄)
   - Changes will be applied immediately
3. **For Firefox:** 
   - Make sure you've switched to Firefox manifest (`./switch-to-firefox.sh`)
   - Go to `about:debugging` → "This Firefox"
   - Find your extension and click "Reload"
   - After testing, restore Chrome manifest (`./switch-to-chrome.sh`)

### Developer Mode Tips

- **Chrome:** Keep Developer mode enabled in `chrome://extensions/` to maintain your extension
- **Firefox:** Use Firefox Developer Edition with `xpinstall.signatures.required` set to `false` for permanent development installation
- **Hot Reload:** Both browsers support reloading extensions without restarting the browser
- **Debugging:** Use browser DevTools (F12) to debug extension code
- **Console Logs:** Check the extension's service worker console (Chrome) or background page console (Firefox) for debugging

### Testing

- Test color changes in the settings page
- Verify all features work in both Chrome and Firefox
- Test responsive design on different screen sizes
- **Remember:** When testing in Firefox, use the helper scripts to switch manifests, or manually swap `manifest.json` with `manifest.firefox.json`

## License

This project is open source and available for customization.

## Support

For issues or questions, check the code comments or modify as needed for your business requirements.

