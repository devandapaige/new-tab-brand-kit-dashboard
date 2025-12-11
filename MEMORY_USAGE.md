# Memory Usage Guide

## Overview

This extension is designed to be lightweight and only use memory when actively needed. Here's how it manages resources:

## Memory Usage Breakdown

### Background Script (`background.js`)
- **Status**: ✅ **Non-persistent** (`persistent: false`)
- **Memory Impact**: **Minimal** - Only runs on install/update, then unloads
- **What it does**: Sets default settings once when installed
- **When it uses memory**: Only during installation or updates

### New Tab Page (`newtab.html` + `newtab.js`)
- **Status**: Only active when a new tab is open
- **Memory Impact**: **Low** - Only uses memory when you have a new tab open
- **What it does**:
  - Updates date/time every 60 seconds
  - Updates countdown trackers every 1 second (only when trackers are visible)
  - Listens for storage changes
- **When it uses memory**: Only when you have a new tab open
- **When you close the tab**: All memory is freed

### Popup (`popup.html` + `popup.js`)
- **Status**: Only active when popup is open
- **Memory Impact**: **Very Low** - Only uses memory when popup is visible
- **What it does**: Displays quick responses, listens for storage changes
- **When it uses memory**: Only when you click the extension icon
- **When you close the popup**: All memory is freed

### Options Page (`options.html` + `options.js`)
- **Status**: Only active when settings page is open
- **Memory Impact**: **Low** - Only uses memory when settings are open
- **What it does**: Manages settings, listens for storage changes
- **When it uses memory**: Only when settings page is open
- **When you close the tab**: All memory is freed

## How to Monitor Memory Usage in Firefox

### Method 1: Firefox Task Manager
1. Press `Shift + Esc` (or go to `Menu` → `More Tools` → `Task Manager`)
2. Look for "Brand Kit Dashboard" entries
3. Check the "Memory" column
4. You should see:
   - **Background page**: Only when extension is installed/updated (briefly)
   - **New Tab**: Only when you have a new tab open
   - **Popup**: Only when popup is open (briefly)
   - **Options**: Only when settings page is open

### Method 2: about:debugging
1. Go to `about:debugging#/runtime/this-firefox`
2. Find "Brand Kit Dashboard" in the list
3. Click "Inspect" to open the developer tools
4. Check the "Memory" tab in the developer tools

### Method 3: about:memory
1. Go to `about:memory`
2. Click "Measure" to get a detailed memory report
3. Search for "brand-kit" or "Brand Kit Dashboard"
4. This shows detailed memory breakdown

## Expected Memory Usage

### When Extension is Idle (No tabs open)
- **Background script**: 0 MB (unloaded, `persistent: false`)
- **Total**: ~0 MB

### When New Tab is Open
- **New Tab page**: ~5-15 MB (typical for a web page)
- **Intervals running**: 
  - Date/time update: Every 60 seconds (minimal)
  - Countdown trackers: Every 1 second (only if trackers are visible)
- **Total**: ~5-15 MB

### When Popup is Open
- **Popup**: ~1-3 MB (very lightweight)
- **Total**: ~1-3 MB

### When Settings Page is Open
- **Options page**: ~5-10 MB (typical for a settings page)
- **Total**: ~5-10 MB

## Memory Optimization Features

✅ **Non-persistent background script** - Doesn't stay in memory  
✅ **Event-based listeners** - Only active when needed  
✅ **No unnecessary polling** - Intervals only run when relevant content is visible  
✅ **Automatic cleanup** - Memory freed when tabs/popups close  

## Verifying No Extra Memory Usage

### Test 1: Check Background Script
1. Open Firefox Task Manager (`Shift + Esc`)
2. Close all new tabs
3. Verify no "Brand Kit Dashboard" entries appear
4. ✅ **Expected**: No entries (background script is non-persistent)

### Test 2: Check New Tab Memory
1. Open a new tab (your dashboard)
2. Check Task Manager
3. Note the memory usage
4. Close the new tab
5. Check Task Manager again
6. ✅ **Expected**: Memory usage drops to 0 when tab is closed

### Test 3: Check Popup Memory
1. Click the extension icon (opens popup)
2. Check Task Manager
3. Note the memory usage
4. Close the popup
5. Check Task Manager again
6. ✅ **Expected**: Memory usage drops to 0 when popup closes

## Troubleshooting High Memory Usage

If you notice unexpectedly high memory usage:

1. **Check for multiple new tabs open**: Each new tab uses memory independently
2. **Check for large images**: Large background images or logos stored in `chrome.storage.local` can increase memory
3. **Check for many trackers/links/notes**: Very large lists might use more memory
4. **Restart Firefox**: Sometimes extensions need a restart after updates

## Best Practices

- ✅ Close new tabs when not needed (memory is freed immediately)
- ✅ Use reasonably sized images (recommended: < 2MB for logos, < 5MB for backgrounds)
- ✅ The extension automatically cleans up when tabs close
- ✅ Background script doesn't persist, so no idle memory usage

## Summary

**This extension is designed to be memory-efficient:**
- Background script is non-persistent (doesn't stay in memory)
- Only uses memory when pages are actually open
- Automatically frees memory when tabs/popups close
- No unnecessary background processes

**When not in use, the extension uses ~0 MB of memory.**

