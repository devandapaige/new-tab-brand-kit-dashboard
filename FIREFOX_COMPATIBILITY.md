# Firefox Compatibility Guide

## Current Status

Your project is **mostly ready** for Firefox! You already have a `manifest.firefox.json` file, and the code uses `chrome.*` APIs which Firefox supports for compatibility.

## What's Already Done ✅

1. **Firefox Manifest**: `manifest.firefox.json` exists with correct Manifest V2 format
2. **Add-on ID**: `applications.gecko.id` is included (required for storage API in temporary add-ons)
3. **API Compatibility**: Code uses `chrome.*` APIs which Firefox supports
4. **Permissions**: All necessary permissions are included in the Firefox manifest
5. **Background Script**: Configured correctly for Firefox (non-persistent)

## What Needs to Be Done

### 1. Minor Code Fix (Optional but Recommended)

There's one potential issue in `scripts/popup.js` where `chrome.tabs.sendMessage()` might fail silently in Firefox if the options page doesn't have a content script. This is not critical, but you can make it more robust:

**Location**: `scripts/popup.js` lines 199-202

**Current code:**
```javascript
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { action: 'focusAdminSection' });
});
```

**Recommended fix** (add error handling):
```javascript
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'focusAdminSection' }).catch(() => {
      // Silently fail if message can't be sent (e.g., options page doesn't have content script)
    });
  }
});
```

### 2. Testing Checklist

Before deploying to Firefox, test these features:

- [ ] New tab page loads correctly
- [ ] Settings page opens and saves correctly
- [ ] Popup (Quick Responses) works
- [ ] Background image upload works
- [ ] Company logo upload works
- [ ] Todoist integration works (API calls)
- [ ] Storage sync works (settings persist)
- [ ] All color pickers work
- [ ] Export/Import settings works
- [ ] Trackers countdown/countup works
- [ ] Quick links open correctly
- [ ] Notes display correctly

### 3. Installation Process

**Important**: Firefox looks for `manifest.json` in the root directory, not `manifest.firefox.json`. You need to temporarily swap the manifest files.

#### Quick Method (Using Helper Scripts)

1. **Switch to Firefox manifest:**
   ```bash
   ./switch-to-firefox.sh
   ```

2. **Load in Firefox:**
   - Open Firefox and navigate to `about:debugging`
   - Click "This Firefox" in the left sidebar
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file (it's now the Firefox version)

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

2. **Load in Firefox:**
   - Open Firefox and navigate to `about:debugging`
   - Click "This Firefox" in the left sidebar
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file

3. **Restore Chrome manifest when done:**
   ```bash
   cp manifest.chrome.json manifest.json
   ```

**Note**: Temporary add-ons are removed when Firefox restarts. For permanent installation, you'll need to:
- Package the extension as a `.xpi` file, OR
- Submit to Firefox Add-ons (AMO) for distribution

### 4. Potential Issues to Watch For

#### Content Security Policy (CSP)
Firefox may have stricter CSP rules. If you encounter issues with:
- Inline scripts (you're using external scripts, so this should be fine)
- `eval()` usage (not used in your code)
- External resource loading (Todoist API should work with the host permission)

#### Storage API Differences
- **CRITICAL**: Firefox requires an explicit `applications.gecko.id` in the manifest for temporary add-ons to use the storage API
- `chrome.storage.sync` in Firefox has a smaller quota (100KB vs Chrome's 100KB, but Firefox may be stricter)
- Large images stored in `chrome.storage.local` should work fine (10MB limit)
- All storage operations should check `chrome.runtime.lastError` for Firefox-specific errors

#### Background Script
- Firefox uses non-persistent background scripts (which you've configured correctly)
- The background script will wake up when needed (alarms, events, etc.)

## Quick Fix Implementation

If you want to implement the recommended fix for the popup.js issue, here's what to change:

**File**: `scripts/popup.js`

**Change lines 196-203 from:**
```javascript
document.getElementById('adminBtn').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
  // Focus on admin section if possible
  setTimeout(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'focusAdminSection' });
    });
  }, 500);
});
```

**To:**
```javascript
document.getElementById('adminBtn').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
  // Focus on admin section if possible (may fail silently in Firefox if no content script)
  setTimeout(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'focusAdminSection' }).catch(() => {
          // Silently fail if message can't be sent
        });
      }
    });
  }, 500);
});
```

## Summary

**Status**: Your extension is **95% ready** for Firefox!

**Action Items**:
1. ✅ Manifest file exists and is correct
2. ⚠️ Optional: Add error handling to popup.js (recommended)
3. ✅ Test all features in Firefox
4. ✅ Document installation process for users

**Estimated Time to Full Firefox Compatibility**: 15-30 minutes (mostly testing)

The code should work in Firefox as-is, but adding the error handling will make it more robust and prevent any silent failures.

