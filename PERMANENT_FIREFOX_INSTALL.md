# Permanent Firefox Installation Guide

## Quick Access: Reload Extension

If your extension disappeared, reload it:

1. **Switch to Firefox manifest:**
   ```bash
   ./switch-to-firefox.sh
   ```

2. **Load in Firefox:**
   - Open Firefox
   - Navigate to `about:debugging`
   - Click "This Firefox" in the left sidebar
   - Click "Load Temporary Add-on"
   - Select `manifest.json` from this folder

## Permanent Installation Options

### Option 1: Firefox Developer Edition (Recommended for Personal Use)

This is the **best option** for personal use. Developer Edition allows unsigned extensions to persist permanently.

**Steps:**

1. **Install Firefox Developer Edition:**
   - Download from: https://www.mozilla.org/en-US/firefox/developer/
   - Install it (you can have both regular Firefox and Developer Edition installed)

2. **Disable signature requirement:**
   - Open Firefox Developer Edition
   - Navigate to `about:config`
   - Search for: `xpinstall.signatures.required`
   - Double-click to set it to `false` (⚠️ This is safe for personal use, but only do this in Developer Edition)

3. **Package your extension:**
   ```bash
   ./package-firefox.sh
   ```
   This creates `brand-kit-dashboard-firefox.xpi`

4. **Install the .xpi:**
   - In Firefox Developer Edition, navigate to `about:addons`
   - Click the gear icon (⚙️) in the top right
   - Select "Install Add-on From File..."
   - Select `brand-kit-dashboard-firefox.xpi`
   - The extension will install permanently!

**Benefits:**
- ✅ Extension persists across Firefox updates
- ✅ Extension persists across browser restarts
- ✅ No need to reload manually
- ✅ Works exactly like a regular extension

**Note:** You can use Developer Edition as your main browser, or keep both versions installed.

---

### Option 2: Package as .xpi (Semi-Permanent)

This creates a packaged extension, but it may still need reloading after major Firefox updates.

**Steps:**

1. **Package the extension:**
   ```bash
   ./package-firefox.sh
   ```
   This creates `brand-kit-dashboard-firefox.xpi`

2. **Install the .xpi:**
   - Open Firefox and navigate to `about:debugging`
   - Click "This Firefox" in the left sidebar
   - Click "Load Temporary Add-on"
   - Select `brand-kit-dashboard-firefox.xpi`

**Limitations:**
- ⚠️ May still be removed after major Firefox updates
- ⚠️ Still shows as "temporary" in the UI
- ✅ Better than loading manifest.json directly
- ✅ Persists across normal restarts

---

### Option 3: Submit to Firefox Add-ons (AMO) (Best for Distribution)

For a truly permanent, signed extension that works in regular Firefox:

1. **Create an account:**
   - Go to https://addons.mozilla.org/
   - Create a developer account

2. **Submit your extension:**
   - Follow AMO's submission process
   - Your extension will be reviewed and signed
   - Once approved, it can be installed permanently in any Firefox

3. **Install from AMO:**
   - Users can install from the AMO website
   - Or you can distribute the signed .xpi file

**Benefits:**
- ✅ Works in regular Firefox (no Developer Edition needed)
- ✅ Truly permanent across all updates
- ✅ Signed and verified by Mozilla
- ✅ Can be shared with others

**Note:** This requires going through Mozilla's review process, which may take a few days.

---

### Option 4: Firefox Enterprise Policy (For Organizations)

If you're deploying to a team or organization:

1. Create a `policies.json` file (see [Firefox Enterprise Policy docs](https://github.com/mozilla/policy-templates))
2. Configure automatic extension installation
3. Deploy via group policy or configuration management

---

## Recommendation

**For personal use:** Use **Option 1 (Firefox Developer Edition)** - it's the easiest and most reliable way to keep your extension permanently installed.

**For sharing with others:** Use **Option 3 (AMO submission)** - it's the most professional and permanent solution.

---

## Troubleshooting

### Extension disappeared after Firefox update

If you used Option 2 (.xpi via about:debugging), you'll need to reload it:
1. Run `./switch-to-firefox.sh`
2. Go to `about:debugging` → "This Firefox" → "Load Temporary Add-on"
3. Select `manifest.json` or the `.xpi` file

If you used Option 1 (Developer Edition), it should persist automatically.

### Can't find the extension

- Check `about:addons` to see if it's installed but disabled
- Make sure you're using the correct Firefox version (Developer Edition for Option 1)
- Verify the manifest was switched correctly (`./switch-to-firefox.sh`)

### Extension not working

- Make sure all files are present (icons, scripts, styles)
- Check the browser console for errors (F12)
- Verify the manifest.json is valid JSON

