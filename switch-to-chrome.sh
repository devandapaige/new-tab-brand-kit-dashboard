#!/bin/bash
# Script to restore Chrome manifest after Firefox testing

cd "$(dirname "$0")"

# Restore Chrome manifest
if [ -f "manifest.chrome.json" ]; then
    cp manifest.chrome.json manifest.json
    echo "✅ Restored Chrome manifest"
    echo ""
    echo "You can now use the extension in Chrome"
else
    echo "❌ Error: manifest.chrome.json not found"
    echo "   The Chrome manifest may have been lost. Check if manifest.firefox.json exists."
fi

