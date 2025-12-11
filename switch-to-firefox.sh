#!/bin/bash
# Script to switch manifest files for Firefox testing

cd "$(dirname "$0")"

# Backup Chrome manifest and switch to Firefox
if [ -f "manifest.json" ]; then
    cp manifest.json manifest.chrome.json
    echo "✅ Backed up Chrome manifest to manifest.chrome.json"
fi

if [ -f "manifest.firefox.json" ]; then
    cp manifest.firefox.json manifest.json
    echo "✅ Switched to Firefox manifest"
    echo ""
    echo "You can now load the extension in Firefox at about:debugging"
    echo "After testing, run switch-to-chrome.sh to restore Chrome manifest"
else
    echo "❌ Error: manifest.firefox.json not found"
fi

