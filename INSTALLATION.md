# Installation Guide

## Quick Start

### For Chrome

1. **Prepare the extension:**
   - Make sure you have icon files in the `icons/` folder:
     - `icon16.png` (16x16 pixels)
     - `icon48.png` (48x48 pixels)
     - `icon128.png` (128x128 pixels)
   - If you don't have icons, you can create simple colored squares or use an online icon generator

2. **Load the extension:**
   - Open Chrome
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right corner)
   - Click "Load unpacked"
   - Select this project folder (`new-tab-brand-kit-dashboard`)
   - The extension should now appear in your extensions list

3. **Test it:**
   - Open a new tab
   - You should see the Brand Kit Dashboard instead of the default new tab page

### For Firefox

1. **Prepare the extension:**
   - You'll need to temporarily use the Firefox manifest
   - Option 1: Rename `manifest.firefox.json` to `manifest.json` (backup the Chrome one first)
   - Option 2: Create a copy and work with that

2. **Load the extension:**
   - Open Firefox
   - Navigate to `about:debugging`
   - Click "This Firefox" in the left sidebar
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file (or `manifest.firefox.json` if using that)
   - The extension should now be loaded

3. **Test it:**
   - Open a new tab
   - You should see the Brand Kit Dashboard

**Note:** Firefox temporary add-ons are removed when you restart Firefox or when Firefox updates. For a permanent installation, see the "Permanent Firefox Installation" section below.

### Permanent Firefox Installation

To prevent the extension from being removed after Firefox updates:

#### Quick Method (Package as .xpi)

1. **Package the extension:**
   ```bash
   chmod +x package-firefox.sh
   ./package-firefox.sh
   ```
   This creates a `brand-kit-dashboard-firefox.xpi` file.

2. **Install the .xpi:**
   - Open Firefox and navigate to `about:debugging`
   - Click "This Firefox" in the left sidebar
   - Click "Load Temporary Add-on"
   - Select the `brand-kit-dashboard-firefox.xpi` file

**Note:** Even with .xpi, Firefox may still require reloading after major updates. For truly permanent installation:

- **For Development:** Use Firefox Developer Edition and disable signature requirements
- **For Distribution:** Submit to [Firefox Add-ons (AMO)](https://addons.mozilla.org/) for signing
- **For Organizations:** Use Firefox Enterprise Policy for automatic installation

See `FIREFOX_COMPATIBILITY.md` for detailed instructions on all permanent installation methods.

## Creating Icons

If you don't have icon files yet, here are some options:

### Option 1: Online Icon Generator
1. Visit https://www.favicon-generator.org/ or similar
2. Upload a logo or create a simple design
3. Download the icons in the required sizes

### Option 2: Simple Colored Icons
1. Use any image editor (Photoshop, GIMP, Canva, etc.)
2. Create square images (16x16, 48x48, 128x128)
3. Use your brand colors
4. Save as PNG files with the correct names

### Option 3: Use Default Browser Icons
- You can temporarily use any PNG files - the extension will still work
- Replace them with proper icons later

## First-Time Setup

After installing the extension:

1. **Open Settings:**
   - Click the settings icon (⚙️) in the top right of the new tab page
   - Or right-click the extension icon and select "Options"

2. **Configure Brand Colors:**
   - Enter your primary brand color (hex format, e.g., #4A90E2)
   - Enter secondary and accent colors
   - Adjust background and text colors as needed

3. **Set Team Name:**
   - Enter your team or business name in the "Team/User Name" field


5. **Save Settings:**
   - Click "Save Settings"
   - Refresh your new tab page to see the changes

## Troubleshooting

### Extension won't load
- Make sure all required files are present
- Check that manifest.json is valid JSON
- Look for errors in the browser console

### New tab page doesn't change
- Make sure the extension is enabled
- Try disabling other new tab extensions
- Refresh the extension in `chrome://extensions/` or reload in Firefox

### Settings not saving
- Check browser permissions
- Make sure you're using a supported browser version
- Try clearing browser cache

### Colors not updating
- Save settings and refresh the new tab page
- Check that color values are in correct format
- Verify CSS variables are being applied (use browser DevTools)

## Next Steps

- Customize your brand colors
- Add your favorite links
- Set up daily reminders
- Share with your team!

