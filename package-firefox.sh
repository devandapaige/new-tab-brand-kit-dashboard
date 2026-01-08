#!/bin/bash
# Script to package Firefox extension as .xpi for permanent installation

cd "$(dirname "$0")"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "📦 Packaging Firefox Extension..."

# Check if Firefox manifest exists
if [ ! -f "manifest.firefox.json" ]; then
    echo -e "${RED}❌ Error: manifest.firefox.json not found${NC}"
    exit 1
fi

# Backup current manifest if it exists and is different
if [ -f "manifest.json" ]; then
    if ! cmp -s "manifest.json" "manifest.firefox.json"; then
        cp manifest.json manifest.chrome.json
        echo -e "${GREEN}✅ Backed up Chrome manifest${NC}"
    fi
fi

# Switch to Firefox manifest
cp manifest.firefox.json manifest.json
echo -e "${GREEN}✅ Switched to Firefox manifest${NC}"

# Create temporary directory for packaging
TEMP_DIR=$(mktemp -d)
EXTENSION_NAME="brand-kit-dashboard-firefox"

echo "📁 Copying extension files..."

# Copy all necessary files
cp -r manifest.json "$TEMP_DIR/"
cp -r *.html "$TEMP_DIR/" 2>/dev/null || true
cp -r *.js "$TEMP_DIR/" 2>/dev/null || true
cp -r styles/ "$TEMP_DIR/" 2>/dev/null || true
cp -r scripts/ "$TEMP_DIR/" 2>/dev/null || true
cp -r icons/ "$TEMP_DIR/" 2>/dev/null || true
cp -r icon*.png "$TEMP_DIR/" 2>/dev/null || true

# Create .xpi file (it's just a zip file)
XPI_FILE="${EXTENSION_NAME}.xpi"
cd "$TEMP_DIR"
zip -r "$OLDPWD/$XPI_FILE" . -q
cd "$OLDPWD"

# Clean up temp directory
rm -rf "$TEMP_DIR"

# Restore Chrome manifest if it was backed up
if [ -f "manifest.chrome.json" ]; then
    cp manifest.chrome.json manifest.json
    echo -e "${GREEN}✅ Restored Chrome manifest${NC}"
fi

echo ""
echo -e "${GREEN}✅ Extension packaged successfully!${NC}"
echo ""
echo -e "${YELLOW}📋 Installation Instructions:${NC}"
echo ""
echo "1. Open Firefox"
echo "2. Navigate to: about:debugging"
echo "3. Click 'This Firefox' in the left sidebar"
echo "4. Click 'Load Temporary Add-on'"
echo "5. Select the file: ${XPI_FILE}"
echo ""
echo -e "${YELLOW}⚠️  Note: Even with .xpi, Firefox may still require reloading after updates.${NC}"
echo -e "${YELLOW}   For truly permanent installation, consider:${NC}"
echo "   - Using Firefox Developer Edition"
echo "   - Submitting to Firefox Add-ons (AMO) for signed distribution"
echo "   - Using Firefox's enterprise policy (for organizations)"
echo ""
