// Brand Kit Dashboard - Options/Settings Script

document.addEventListener('DOMContentLoaded', () => {
  loadBrandColors();
  loadSettings();
  initializeColorPickers();
  initializeFormHandlers();
  initializeAdminSection();
  initializeCountdowns();
  initializeNavigation();
  initializeCardOrder();
  initializeTextCards();
  initializeCollapsibleSections();
});

// Load brand colors and apply to settings page
function loadBrandColors() {
  chrome.storage.sync.get(['primaryColor', 'secondaryColor', 'accentColor', 'borderRadius'], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result) {
      result = {};
    }
    const root = document.documentElement;
    
    if (result.primaryColor) {
      root.style.setProperty('--primary-color', result.primaryColor);
    }
    
    if (result.secondaryColor) {
      root.style.setProperty('--secondary-color', result.secondaryColor);
    }
    
    if (result.accentColor) {
      root.style.setProperty('--accent-color', result.accentColor);
    }
    
    // Apply border radius
    const borderRadius = result.borderRadius !== undefined ? result.borderRadius : 8;
    root.style.setProperty('--border-radius', `${borderRadius}px`);
    root.style.setProperty('--border-radius-sm', `${Math.round(borderRadius * 0.75)}px`);
    root.style.setProperty('--border-radius-lg', `${Math.round(borderRadius * 1.5)}px`);
  });
}

// Load saved settings
function loadSettings() {
  chrome.storage.sync.get([
    'primaryColor',
    'secondaryColor',
    'accentColor',
    'backgroundColor',
    'cardBackground',
    'textPrimary',
    'textSecondary',
    'textLight',
    'borderColor',
    'shadowIntensity',
    'borderRadius',
    'userName',
    'todoistApiKey',
    'countdowns',
    'cardVisibilityTrackers',
    'cardVisibilityNotes',
    'cardVisibilityLinks',
    'cardVisibilityTodoist',
    'overlayEnabled',
    'overlayOpacity',
    'customHeaderTitle',
    'customHeaderText',
      'businessInfoLine1',
      'businessInfoLine2',
      'businessInfoLine3',
      'businessInfoLine4',
      'companyLogoUrl'
    ], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result) {
      result = {};
    }
    if (result.primaryColor) {
      document.getElementById('primaryColor').value = result.primaryColor;
      document.getElementById('primaryColorText').value = result.primaryColor;
      const preview = document.getElementById('primaryColorPreview');
      if (preview) preview.style.backgroundColor = result.primaryColor;
    }
    
    if (result.secondaryColor) {
      document.getElementById('secondaryColor').value = result.secondaryColor;
      document.getElementById('secondaryColorText').value = result.secondaryColor;
      const preview = document.getElementById('secondaryColorPreview');
      if (preview) preview.style.backgroundColor = result.secondaryColor;
    }
    
    if (result.accentColor) {
      document.getElementById('accentColor').value = result.accentColor;
      document.getElementById('accentColorText').value = result.accentColor;
      const preview = document.getElementById('accentColorPreview');
      if (preview) preview.style.backgroundColor = result.accentColor;
    }
    
    if (result.backgroundColor) {
      // Extract hex from rgba if needed
      const hex = rgbaToHex(result.backgroundColor) || result.backgroundColor;
      document.getElementById('backgroundColor').value = hex;
      document.getElementById('backgroundColorText').value = result.backgroundColor;
    }
    
    if (result.cardBackground) {
      const hex = rgbaToHex(result.cardBackground) || result.cardBackground;
      document.getElementById('cardBackground').value = hex;
      document.getElementById('cardBackgroundText').value = result.cardBackground;
      
      // Update preview
      const preview = document.getElementById('cardBackgroundPreview');
      if (preview) preview.style.backgroundColor = result.cardBackground;
      
      // Extract opacity from rgba value
      const opacityMatch = result.cardBackground.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
      if (opacityMatch) {
        const opacity = Math.round(parseFloat(opacityMatch[1]) * 100);
        document.getElementById('cardBackgroundOpacity').value = opacity;
        document.getElementById('cardBackgroundOpacityValue').textContent = opacity;
      }
    } else {
      // Default to 95% if not set
      document.getElementById('cardBackgroundOpacity').value = 95;
      document.getElementById('cardBackgroundOpacityValue').textContent = '95';
      const preview = document.getElementById('cardBackgroundPreview');
      if (preview) preview.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    }
    
    if (result.textPrimary) {
      document.getElementById('textPrimary').value = result.textPrimary;
      document.getElementById('textPrimaryText').value = result.textPrimary;
    }
    
    if (result.textSecondary) {
      document.getElementById('textSecondary').value = result.textSecondary;
      document.getElementById('textSecondaryText').value = result.textSecondary;
    }
    
    if (result.textLight) {
      document.getElementById('textLight').value = result.textLight;
      document.getElementById('textLightText').value = result.textLight;
    }
    
    if (result.borderColor) {
      const hex = rgbaToHex(result.borderColor) || result.borderColor;
      document.getElementById('borderColor').value = hex;
      document.getElementById('borderColorText').value = result.borderColor;
      
      // Extract opacity from rgba value
      const opacityMatch = result.borderColor.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
      if (opacityMatch) {
        const opacity = Math.round(parseFloat(opacityMatch[1]) * 100);
        document.getElementById('borderColorOpacity').value = opacity;
        document.getElementById('borderColorOpacityValue').textContent = opacity;
      }
    } else {
      // Default to 50% if not set
      document.getElementById('borderColorOpacity').value = 50;
      document.getElementById('borderColorOpacityValue').textContent = '50';
    }
    
    if (result.shadowIntensity !== undefined) {
      document.getElementById('shadowIntensity').value = result.shadowIntensity;
      document.getElementById('shadowIntensityValue').textContent = result.shadowIntensity;
    } else {
      // Default to 15% if not set
      document.getElementById('shadowIntensity').value = 15;
      document.getElementById('shadowIntensityValue').textContent = '15';
    }
    
    if (result.borderRadius !== undefined) {
      document.getElementById('borderRadius').value = result.borderRadius;
      document.getElementById('borderRadiusValue').textContent = result.borderRadius;
    } else {
      // Default to 8px if not set
      document.getElementById('borderRadius').value = 8;
      document.getElementById('borderRadiusValue').textContent = '8';
    }
    
    // Load background image from local storage (it's stored there because it can be large)
    chrome.storage.local.get(['backgroundImage'], (localResult) => {
      // Handle Firefox case where localResult might be undefined
      if (localResult && localResult.backgroundImage) {
        document.getElementById('backgroundImage').value = localResult.backgroundImage;
        updateBackgroundImagePreview();
      } else {
        // Fallback: check sync storage for backwards compatibility
        if (result.backgroundImage) {
          document.getElementById('backgroundImage').value = result.backgroundImage;
          updateBackgroundImagePreview();
        }
      }
    });
    
    if (result.userName) {
      document.getElementById('userName').value = result.userName;
    }
    
    if (result.todoistApiKey) {
      document.getElementById('todoistApiKey').value = result.todoistApiKey;
    }
    
    // Load custom header
    if (result.customHeaderTitle) {
      document.getElementById('customHeaderTitle').value = result.customHeaderTitle;
    }
    
    if (result.customHeaderText) {
      document.getElementById('customHeaderText').value = result.customHeaderText;
    }
    
    // Load business info
    if (result.businessInfoLine1) {
      document.getElementById('businessInfoLine1').value = result.businessInfoLine1;
    }
    if (result.businessInfoLine2) {
      document.getElementById('businessInfoLine2').value = result.businessInfoLine2;
    }
    if (result.businessInfoLine3) {
      document.getElementById('businessInfoLine3').value = result.businessInfoLine3;
    }
    if (result.businessInfoLine4) {
      document.getElementById('businessInfoLine4').value = result.businessInfoLine4;
    }
    
    // Load company logo from local storage
    chrome.storage.local.get(['companyLogo'], (localResult) => {
      // Handle Firefox case where localResult might be undefined
      if (localResult && localResult.companyLogo) {
        document.getElementById('companyLogo').value = localResult.companyLogo;
        updateCompanyLogoPreview();
      }
    });
    
    // Load company logo URL
    if (result.companyLogoUrl) {
      document.getElementById('companyLogoUrl').value = result.companyLogoUrl;
    }
    
    // Card visibility is now handled by loadCardOrder() which is called separately
    // No need to load old checkbox elements here
    
    // Load overlay settings
    if (result.overlayEnabled !== undefined) {
      document.getElementById('overlayEnabled').checked = result.overlayEnabled;
    } else {
      document.getElementById('overlayEnabled').checked = true; // Default to enabled
    }
    
    if (result.overlayOpacity !== undefined) {
      document.getElementById('overlayOpacity').value = result.overlayOpacity;
      document.getElementById('overlayOpacityValue').textContent = result.overlayOpacity;
    } else {
      document.getElementById('overlayOpacity').value = 20; // Default to 20%
      document.getElementById('overlayOpacityValue').textContent = '20';
    }
    
    // Update overlay controls visibility and update background color opacity
    updateOverlayControls();
    updateBackgroundColorOpacity();
    // Update card background opacity
    updateCardBackgroundOpacity();
    // Update border color opacity
    updateBorderColorOpacity();
  });
}

// Initialize color picker synchronization
function initializeColorPickers() {
  // Primary Color
  syncColorPicker('primaryColor', 'primaryColorText');
  syncColorText('primaryColorText', 'primaryColor');
  
  // Secondary Color
  syncColorPicker('secondaryColor', 'secondaryColorText');
  syncColorText('secondaryColorText', 'secondaryColor');
  
  // Accent Color
  syncColorPicker('accentColor', 'accentColorText');
  syncColorText('accentColorText', 'accentColor');
  
  // Background Color
  syncColorPicker('backgroundColor', 'backgroundColorText', true);
  syncColorText('backgroundColorText', 'backgroundColor', true);
  
  // Card Background
  syncColorPicker('cardBackground', 'cardBackgroundText', true);
  syncColorText('cardBackgroundText', 'cardBackground', true);
  
  // Text Primary
  syncColorPicker('textPrimary', 'textPrimaryText');
  syncColorText('textPrimaryText', 'textPrimary');
  
  // Text Secondary
  syncColorPicker('textSecondary', 'textSecondaryText');
  syncColorText('textSecondaryText', 'textSecondary');
  
  // Text Light
  syncColorPicker('textLight', 'textLightText');
  syncColorText('textLightText', 'textLight');
  
  // Border Color
  syncColorPicker('borderColor', 'borderColorText', true);
  syncColorText('borderColorText', 'borderColor', true);
}

function syncColorPicker(pickerId, textId, isRgba = false) {
  const picker = document.getElementById(pickerId);
  const text = document.getElementById(textId);
  const previewId = pickerId + 'Preview';
  const preview = document.getElementById(previewId);
  
  if (!picker || !text) return;
  
  const updatePreview = (colorValue) => {
    if (preview) {
      if (isRgba) {
        preview.style.backgroundColor = colorValue;
      } else {
        preview.style.backgroundColor = colorValue;
      }
    }
  };
  
  picker.addEventListener('input', (e) => {
    const value = e.target.value;
    // Only update if it's a valid hex color (color picker always returns valid hex)
    if (isRgba) {
      const rgba = hexToRgba(value, 0.85);
      if (rgba) {
        text.value = rgba;
        updatePreview(rgba);
      }
    } else {
      // Color picker always returns valid hex, so we can safely set it
      if (/^#([A-Fa-f0-9]{6})$/.test(value)) {
        text.value = value;
        updatePreview(value);
      }
    }
  });
  
  // Initialize preview
  if (preview) {
    updatePreview(picker.value);
  }
}

function syncColorText(textId, pickerId, isRgba = false) {
  const text = document.getElementById(textId);
  const picker = document.getElementById(pickerId);
  const previewId = pickerId + 'Preview';
  const preview = document.getElementById(previewId);
  
  const updatePreview = (colorValue) => {
    if (preview) {
      preview.style.backgroundColor = colorValue;
    }
  };
  
  text.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    
    if (isRgba) {
      const hex = rgbaToHex(value);
      if (hex) {
        picker.value = hex;
        updatePreview(value);
      }
    } else {
      // Validate hex color - only update if it's a valid complete hex color
      // This prevents errors when user is still typing
      if (value === '' || /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
        if (value !== '') {
          picker.value = value;
          updatePreview(value);
        }
      }
    }
  });
  
  // Also validate on blur to ensure final value is correct
  text.addEventListener('blur', (e) => {
    const value = e.target.value.trim();
    if (!isRgba && value !== '') {
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
        // Reset to picker value if invalid
        e.target.value = picker.value;
        updatePreview(picker.value);
      }
    }
  });
  
  // Initialize preview
  if (preview && text.value) {
    updatePreview(text.value);
  }
}

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Convert hex to rgba
function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Convert rgba to hex (approximate)
function rgbaToHex(rgba) {
  if (rgba.startsWith('#')) return rgba;
  
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return null;
}

// Initialize form handlers
function initializeFormHandlers() {
  // Save button
  document.getElementById('saveBtn').addEventListener('click', saveSettings);
  
  // Reset button
  document.getElementById('resetBtn').addEventListener('click', resetSettings);
  
  // Preview button
  document.getElementById('previewBtn').addEventListener('click', () => {
    saveSettings(() => {
      chrome.tabs.create({ url: chrome.runtime.getURL('newtab.html') });
    });
  });
  
  // Open Dashboard button (for locked state)
  document.getElementById('openDashboardBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('newtab.html') });
  });
  
  // Export button
  document.getElementById('exportBtn').addEventListener('click', exportSettings);
  
  // Import button
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  
  // Import file handler
  document.getElementById('importFile').addEventListener('change', importSettings);
  
  // Background image upload handler
  const backgroundImageUpload = document.getElementById('backgroundImageUpload');
  if (backgroundImageUpload) {
    backgroundImageUpload.addEventListener('change', handleBackgroundImageUpload);
  }
  
  // Clear background image button
  const clearBackgroundImage = document.getElementById('clearBackgroundImage');
  if (clearBackgroundImage) {
    clearBackgroundImage.addEventListener('click', () => {
      document.getElementById('backgroundImage').value = '';
      document.getElementById('backgroundImageUpload').value = '';
      document.getElementById('backgroundImagePreview').style.display = 'none';
      document.getElementById('backgroundImagePreviewImg').src = '';
      // Clear from local storage
      chrome.storage.local.remove('backgroundImage');
    });
  }
  
  // Update preview when URL changes
  const backgroundImageInput = document.getElementById('backgroundImage');
  if (backgroundImageInput) {
    backgroundImageInput.addEventListener('input', updateBackgroundImagePreview);
  }
  
  // Company logo upload handler
  const companyLogoUpload = document.getElementById('companyLogoUpload');
  if (companyLogoUpload) {
    companyLogoUpload.addEventListener('change', handleCompanyLogoUpload);
  }
  
  // Clear company logo button
  const clearCompanyLogo = document.getElementById('clearCompanyLogo');
  if (clearCompanyLogo) {
    clearCompanyLogo.addEventListener('click', () => {
      document.getElementById('companyLogo').value = '';
      document.getElementById('companyLogoUpload').value = '';
      document.getElementById('companyLogoPreview').style.display = 'none';
      document.getElementById('companyLogoPreviewImg').src = '';
      // Clear from local storage
      chrome.storage.local.remove('companyLogo');
    });
  }
  
  // Overlay enabled toggle
  const overlayEnabled = document.getElementById('overlayEnabled');
  if (overlayEnabled) {
    overlayEnabled.addEventListener('change', () => {
      updateOverlayControls();
      updateBackgroundColorOpacity();
    });
  }
  
  // Overlay opacity slider
  const overlayOpacity = document.getElementById('overlayOpacity');
  if (overlayOpacity) {
    overlayOpacity.addEventListener('input', (e) => {
      document.getElementById('overlayOpacityValue').textContent = e.target.value;
      updateBackgroundColorOpacity();
    });
  }
  
  // Update background color when color picker changes (to update opacity)
  const backgroundColorPicker = document.getElementById('backgroundColor');
  if (backgroundColorPicker) {
    backgroundColorPicker.addEventListener('input', updateBackgroundColorOpacity);
  }
  
  const backgroundColorText = document.getElementById('backgroundColorText');
  if (backgroundColorText) {
    backgroundColorText.addEventListener('input', updateBackgroundColorOpacity);
  }
  
  // Card background opacity slider
  const cardBackgroundOpacity = document.getElementById('cardBackgroundOpacity');
  if (cardBackgroundOpacity) {
    cardBackgroundOpacity.addEventListener('input', (e) => {
      document.getElementById('cardBackgroundOpacityValue').textContent = e.target.value;
      updateCardBackgroundOpacity();
      // Update preview
      const preview = document.getElementById('cardBackgroundPreview');
      if (preview) {
        const opacity = parseInt(e.target.value) / 100;
        const hexColor = document.getElementById('cardBackground').value;
        const rgb = hexToRgb(hexColor);
        if (rgb) {
          preview.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
        }
      }
    });
  }
  
  // Update card background color when color picker changes (to update opacity)
  const cardBackgroundPicker = document.getElementById('cardBackground');
  if (cardBackgroundPicker) {
    cardBackgroundPicker.addEventListener('input', () => {
      updateCardBackgroundOpacity();
      // Also update preview directly
      const preview = document.getElementById('cardBackgroundPreview');
      const opacity = parseInt(document.getElementById('cardBackgroundOpacity').value) / 100;
      const hexColor = cardBackgroundPicker.value;
      const rgb = hexToRgb(hexColor);
      if (preview && rgb) {
        preview.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
      }
    });
  }
  
  const cardBackgroundText = document.getElementById('cardBackgroundText');
  if (cardBackgroundText) {
    cardBackgroundText.addEventListener('input', () => {
      updateCardBackgroundOpacity();
      // Update preview from text value
      const preview = document.getElementById('cardBackgroundPreview');
      if (preview) {
        preview.style.backgroundColor = cardBackgroundText.value;
      }
    });
  }
  
  // Shadow intensity slider
  const shadowIntensity = document.getElementById('shadowIntensity');
  if (shadowIntensity) {
    shadowIntensity.addEventListener('input', (e) => {
      document.getElementById('shadowIntensityValue').textContent = e.target.value;
    });
  }
  
  // Border radius slider
  const borderRadius = document.getElementById('borderRadius');
  if (borderRadius) {
    borderRadius.addEventListener('input', (e) => {
      document.getElementById('borderRadiusValue').textContent = e.target.value;
    });
  }
  
  // Border color opacity slider
  const borderColorOpacity = document.getElementById('borderColorOpacity');
  if (borderColorOpacity) {
    borderColorOpacity.addEventListener('input', (e) => {
      document.getElementById('borderColorOpacityValue').textContent = e.target.value;
      updateBorderColorOpacity();
    });
  }
  
  // Update border color when color picker changes (to update opacity)
  const borderColorPicker = document.getElementById('borderColor');
  if (borderColorPicker) {
    borderColorPicker.addEventListener('input', updateBorderColorOpacity);
  }
  
  const borderColorText = document.getElementById('borderColorText');
  if (borderColorText) {
    borderColorText.addEventListener('input', updateBorderColorOpacity);
  }
}

// Update border color opacity based on opacity slider
function updateBorderColorOpacity() {
  const borderColorOpacity = document.getElementById('borderColorOpacity');
  const borderColorPicker = document.getElementById('borderColor');
  const borderColorText = document.getElementById('borderColorText');
  
  if (!borderColorOpacity || !borderColorPicker || !borderColorText) return;
  
  // Get the opacity value (0-100, convert to 0-1)
  const opacity = parseInt(borderColorOpacity.value) / 100;
  
  // Get the base color from the color picker
  const hexColor = borderColorPicker.value;
  const rgb = hexToRgb(hexColor);
  
  if (rgb) {
    // Update the text input with the new rgba value
    const rgbaValue = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    borderColorText.value = rgbaValue;
  }
}

// Update card background color opacity based on opacity slider
function updateCardBackgroundOpacity() {
  const cardBackgroundOpacity = document.getElementById('cardBackgroundOpacity');
  const cardBackgroundPicker = document.getElementById('cardBackground');
  const cardBackgroundText = document.getElementById('cardBackgroundText');
  const preview = document.getElementById('cardBackgroundPreview');
  
  if (!cardBackgroundOpacity || !cardBackgroundPicker || !cardBackgroundText) return;
  
  // Get the opacity value (0-100, convert to 0-1)
  const opacity = parseInt(cardBackgroundOpacity.value) / 100;
  
  // Get the base color from the color picker
  const hexColor = cardBackgroundPicker.value;
  const rgb = hexToRgb(hexColor);
  
  if (rgb) {
    // Update the text input with the new rgba value
    const rgbaValue = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    cardBackgroundText.value = rgbaValue;
    
    // Update preview
    if (preview) {
      preview.style.backgroundColor = rgbaValue;
    }
  }
}

// Update overlay controls visibility based on enabled state
function updateOverlayControls() {
  const overlayEnabled = document.getElementById('overlayEnabled');
  const overlayControls = document.getElementById('overlayControls');
  
  if (overlayEnabled && overlayControls) {
    if (overlayEnabled.checked) {
      overlayControls.style.opacity = '1';
      overlayControls.style.pointerEvents = 'auto';
    } else {
      overlayControls.style.opacity = '0.5';
      overlayControls.style.pointerEvents = 'none';
    }
  }
}

// Update background color opacity based on overlay opacity slider
function updateBackgroundColorOpacity() {
  const overlayEnabled = document.getElementById('overlayEnabled');
  const overlayOpacity = document.getElementById('overlayOpacity');
  const backgroundColorPicker = document.getElementById('backgroundColor');
  const backgroundColorText = document.getElementById('backgroundColorText');
  
  if (!overlayEnabled || !overlayOpacity || !backgroundColorPicker || !backgroundColorText) return;
  
  // Get the opacity value (0-100, convert to 0-1)
  const opacity = overlayEnabled.checked ? (parseInt(overlayOpacity.value) / 100) : 0;
  
  // Get the base color from the color picker
  const hexColor = backgroundColorPicker.value;
  const rgb = hexToRgb(hexColor);
  
  if (rgb) {
    // Update the text input with the new rgba value
    const rgbaValue = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    backgroundColorText.value = rgbaValue;
  }
}

// Initialize admin section
function initializeAdminSection() {
  loadAdminState();
  
  // Set password button
  document.getElementById('setPasswordBtn').addEventListener('click', setAdminPassword);
  
  // Unlock admin button
  document.getElementById('unlockAdminBtn').addEventListener('click', unlockAdmin);
  
  // Lock admin button
  document.getElementById('lockAdminBtn').addEventListener('click', lockAdmin);
  
  // Lock/unlock toggle button
  document.getElementById('lockUnlockBtn').addEventListener('click', () => {
    chrome.storage.sync.get(['adminUnlocked'], (result) => {
      // Handle Firefox case where result might be undefined
      if (result && result.adminUnlocked) {
        lockAdmin();
      } else {
        // Show unlock form if password is set
        chrome.storage.sync.get(['adminPassword'], (pwdResult) => {
          if (pwdResult && pwdResult.adminPassword) {
            document.getElementById('adminUnlockForm').style.display = 'block';
            document.getElementById('adminUnlockPassword').focus();
          } else {
            // No password, unlock directly
            unlockAdmin();
          }
        });
      }
    });
  });
  
  // Add response button
  const addResponseBtn = document.getElementById('addResponseBtn');
  if (addResponseBtn) {
    addResponseBtn.addEventListener('click', () => {
      openResponseModal();
    });
  }
  
  // Add link button
  const addLinkBtn = document.getElementById('addLinkBtn');
  if (addLinkBtn) {
    addLinkBtn.addEventListener('click', () => {
      openLinkModal();
    });
  }
  
  // Batch add link button
  const batchAddLinkBtn = document.getElementById('batchAddLinkBtn');
  if (batchAddLinkBtn) {
    batchAddLinkBtn.addEventListener('click', () => {
      openBatchLinkModal();
    });
  }
  
  // Add note button
  const addNoteBtn = document.getElementById('addNoteBtn');
  if (addNoteBtn) {
    addNoteBtn.addEventListener('click', () => {
      openNoteModal();
    });
  }
}

// Load admin state
function loadAdminState() {
  chrome.storage.sync.get(['adminPassword', 'adminUnlocked'], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result) {
      result = {};
    }
    const hasPassword = !!result.adminPassword;
    // If no password is set, default to unlocked
    const isUnlocked = hasPassword ? (result.adminUnlocked === true) : true;
    
    // Update status text and button
    const statusText = document.getElementById('adminStatusText');
    const lockBtn = document.getElementById('lockUnlockBtn');
    
    if (isUnlocked) {
      statusText.textContent = 'Settings are unlocked';
      lockBtn.textContent = 'Lock Settings';
      lockBtn.className = 'lock-unlock-btn unlocked';
    } else {
      statusText.textContent = 'Settings are locked';
      lockBtn.textContent = 'Unlock Settings';
      lockBtn.className = 'lock-unlock-btn';
    }
    
    // Show/hide password setup or unlock form
    if (!hasPassword) {
      document.getElementById('adminPasswordSetup').style.display = 'block';
      document.getElementById('adminUnlockForm').style.display = 'none';
      // Ensure unlocked state is saved
      chrome.storage.sync.set({ adminUnlocked: true }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error setting default unlocked state:', chrome.runtime.lastError);
        }
      });
    } else {
      document.getElementById('adminPasswordSetup').style.display = 'none';
      if (!isUnlocked) {
        document.getElementById('adminUnlockForm').style.display = 'block';
        document.getElementById('lockAdminBtn').style.display = 'none';
      } else {
        document.getElementById('adminUnlockForm').style.display = 'none';
        document.getElementById('lockAdminBtn').style.display = 'inline-block';
      }
    }
    
    // Lock/unlock all settings
    toggleSettingsLock(!isUnlocked);
    
    // Load admin data if unlocked
    if (isUnlocked) {
      loadAdminResponses();
      loadLinks();
      loadNotes();
    }
  });
}

// Toggle lock state for all settings
function toggleSettingsLock(locked) {
  const sections = document.querySelectorAll('.settings-section:not(.admin-lock-section)');
  
  sections.forEach(section => {
    if (locked) {
      section.classList.add('locked');
    } else {
      section.classList.remove('locked');
    }
  });
  
  // Show/hide quick responses management
  if (locked) {
    document.getElementById('quickResponsesLocked').style.display = 'block';
    document.getElementById('responsesManagement').style.display = 'none';
  } else {
    document.getElementById('quickResponsesLocked').style.display = 'none';
    document.getElementById('responsesManagement').style.display = 'block';
  }
  
  // Show/hide trackers management
  if (locked) {
    document.getElementById('trackersLocked').style.display = 'block';
    document.getElementById('trackersManagement').style.display = 'none';
  } else {
    document.getElementById('trackersLocked').style.display = 'none';
    document.getElementById('trackersManagement').style.display = 'block';
  }
  
  // Show/hide links management
  const linksLocked = document.getElementById('linksLocked');
  const linksManagement = document.getElementById('linksManagement');
  if (linksLocked && linksManagement) {
    if (locked) {
      linksLocked.style.display = 'block';
      linksManagement.style.display = 'none';
    } else {
      linksLocked.style.display = 'none';
      linksManagement.style.display = 'block';
    }
  }
  
  // Show/hide notes management
  const notesLocked = document.getElementById('notesLocked');
  const notesManagement = document.getElementById('notesManagement');
  if (notesLocked && notesManagement) {
    if (locked) {
      notesLocked.style.display = 'block';
      notesManagement.style.display = 'none';
    } else {
      notesLocked.style.display = 'none';
      notesManagement.style.display = 'block';
    }
  }
  
  // Disable/enable all action buttons
  const actionButtons = ['saveBtn', 'resetBtn', 'previewBtn', 'exportBtn', 'importBtn'];
  const openDashboardBtn = document.getElementById('openDashboardBtn');
  
  actionButtons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      if (locked) {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
        btn.style.pointerEvents = 'none';
      } else {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.style.pointerEvents = 'auto';
      }
    }
  });
  
  // Show/hide Open Dashboard button
  if (openDashboardBtn) {
    if (locked) {
      openDashboardBtn.style.display = 'inline-block';
    } else {
      openDashboardBtn.style.display = 'none';
    }
  }
}

// Set admin password
function setAdminPassword() {
  const password = document.getElementById('adminPasswordInput').value;
  
  chrome.storage.sync.set({ adminPassword: password }, () => {
    // Check for errors in Firefox
    if (chrome.runtime.lastError) {
      console.error('Error setting admin password:', chrome.runtime.lastError);
      showStatus('Error setting password: ' + chrome.runtime.lastError.message, 'error');
      return;
    }
    
    if (password) {
      showStatus('Admin password set successfully! Settings are now locked.', 'success');
      chrome.storage.sync.set({ adminUnlocked: false }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error locking settings:', chrome.runtime.lastError);
          showStatus('Password set, but error locking settings: ' + chrome.runtime.lastError.message, 'error');
        } else {
          document.getElementById('adminPasswordInput').value = '';
          loadAdminState();
        }
      });
    } else {
      showStatus('Password protection disabled. Settings are now unlocked.', 'success');
      chrome.storage.sync.set({ adminUnlocked: true }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error unlocking settings:', chrome.runtime.lastError);
          showStatus('Error unlocking settings: ' + chrome.runtime.lastError.message, 'error');
        } else {
          loadAdminState();
        }
      });
    }
  });
}

// Unlock admin section
function unlockAdmin() {
  chrome.storage.sync.get(['adminPassword'], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result || !result.adminPassword) {
      // No password set, unlock directly
      chrome.storage.sync.set({ adminUnlocked: true }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error unlocking settings:', chrome.runtime.lastError);
          showStatus('Error unlocking settings: ' + chrome.runtime.lastError.message, 'error');
        } else {
          loadAdminState();
          showStatus('Settings unlocked!', 'success');
        }
      });
      return;
    }
    
    const enteredPassword = document.getElementById('adminUnlockPassword').value;
    
    if (enteredPassword === result.adminPassword) {
      chrome.storage.sync.set({ adminUnlocked: true }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error unlocking settings:', chrome.runtime.lastError);
          showStatus('Error unlocking settings: ' + chrome.runtime.lastError.message, 'error');
        } else {
          loadAdminState();
          document.getElementById('adminUnlockPassword').value = '';
          showStatus('Settings unlocked! You can now make changes.', 'success');
        }
      });
    } else {
      showStatus('Incorrect password!', 'error');
      document.getElementById('adminUnlockPassword').value = '';
      document.getElementById('adminUnlockPassword').focus();
    }
  });
}

// Lock admin section
function lockAdmin() {
  chrome.storage.sync.set({ adminUnlocked: false }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error locking settings:', chrome.runtime.lastError);
      showStatus('Error locking settings: ' + chrome.runtime.lastError.message, 'error');
    } else {
      loadAdminState();
      showStatus('Settings locked! Staff can view but not change settings.', 'success');
    }
  });
}

// Load admin responses
function loadAdminResponses() {
  chrome.storage.sync.get(['quickResponses', 'adminUnlocked'], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result || !result.adminUnlocked) {
      return;
    }
    
    const responses = result.quickResponses || [];
    const list = document.getElementById('responsesList');
    if (!list) return;
    
    list.innerHTML = '';
    
    if (responses.length === 0) {
      list.innerHTML = '<p style="color: #64748b; text-align: center; padding: 2rem;">No responses yet. Click "Add Response" to create one.</p>';
      return;
    }
    
    responses.forEach((response, index) => {
      const item = createAdminResponseItem(response, index);
      list.appendChild(item);
    });
  });
}

// Create admin response item
function createAdminResponseItem(response, index) {
  const div = document.createElement('div');
  div.className = 'admin-response-item';
  div.setAttribute('data-index', index);
  
  div.innerHTML = `
    <div class="response-item-header">
      <div class="response-item-title">${escapeHtml(response.title)}</div>
      <div class="response-item-actions">
        <button class="response-item-btn edit-btn" data-action="edit" data-index="${index}">Edit</button>
        <button class="response-item-btn delete-btn-admin" data-action="delete" data-index="${index}">Delete</button>
      </div>
    </div>
    <div class="response-item-field">
      <label>Category:</label>
      <div>${response.category ? escapeHtml(response.category) : '<em>No category</em>'}</div>
    </div>
    <div class="response-item-field">
      <label>Text:</label>
      <div style="color: #64748b; max-height: 100px; overflow: auto;">${escapeHtml(response.text)}</div>
    </div>
  `;
  
  // Edit button
  div.querySelector('[data-action="edit"]').addEventListener('click', () => {
    openResponseModal(response, index);
  });
  
  // Delete button
  div.querySelector('[data-action="delete"]').addEventListener('click', () => {
    if (confirm(`Delete "${response.title}"?`)) {
      deleteResponse(index);
    }
  });
  
  return div;
}

// Open response modal
function openResponseModal(response = null, index = null) {
  // Create modal if it doesn't exist
  let modal = document.getElementById('responseModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'responseModal';
    modal.className = 'response-modal';
    modal.innerHTML = `
      <div class="response-modal-content">
        <span class="response-modal-close" id="closeResponseModal">&times;</span>
        <h3>${response ? 'Edit Response' : 'Add Response'}</h3>
        <form id="responseForm">
          <div class="input-group">
            <label for="responseTitle">Title *</label>
            <input type="text" id="responseTitle" required placeholder="Response title">
          </div>
          <div class="input-group">
            <label for="responseCategory">Category</label>
            <input type="text" id="responseCategory" placeholder="e.g., Customer Service, Sales">
          </div>
          <div class="input-group">
            <label for="responseText">Text *</label>
            <textarea id="responseText" required placeholder="Text that will be copied to clipboard"></textarea>
          </div>
          <div class="button-group-inline" style="margin-top: 1rem;">
            <button type="submit" class="save-settings-btn" style="flex: 1;">${response ? 'Update' : 'Add'} Response</button>
            <button type="button" class="reset-btn" id="cancelResponseBtn">Cancel</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Close handlers
    document.getElementById('closeResponseModal').addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    document.getElementById('cancelResponseBtn').addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
    
    // Form submit
    document.getElementById('responseForm').addEventListener('submit', (e) => {
      e.preventDefault();
      saveResponse(index);
    });
  }
  
  // Populate form if editing
  if (response) {
    document.getElementById('responseTitle').value = response.title;
    document.getElementById('responseCategory').value = response.category || '';
    document.getElementById('responseText').value = response.text;
  } else {
    document.getElementById('responseForm').reset();
  }
  
  modal.classList.add('active');
  document.getElementById('responseTitle').focus();
}

// Save response
function saveResponse(index) {
  // Prevent multiple submissions
  const submitBtn = document.querySelector('#responseForm button[type="submit"]');
  if (submitBtn && submitBtn.disabled) {
    return; // Already processing
  }
  
  // Disable submit button to prevent duplicate submissions
  let originalText = '';
  if (submitBtn) {
    submitBtn.disabled = true;
    originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
  }
  
  const title = document.getElementById('responseTitle').value.trim();
  const category = document.getElementById('responseCategory').value.trim();
  const text = document.getElementById('responseText').value.trim();
  
  if (!title || !text) {
    showStatus('Title and text are required!', 'error');
    // Re-enable submit button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
    return;
  }
  
  chrome.storage.sync.get(['quickResponses'], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result) {
      result = {};
    }
    const responses = result.quickResponses || [];
    
    const responseData = {
      title,
      text,
      category: category || null
    };
    
    if (index !== null) {
      // Update existing
      responses[index] = responseData;
    } else {
      // Add new
      responses.push(responseData);
    }
    
    chrome.storage.sync.set({ quickResponses: responses }, () => {
      // Check for errors (especially in Firefox)
      if (chrome.runtime.lastError) {
        console.error('Error saving response:', chrome.runtime.lastError);
        showStatus('Error saving response. Please try again.', 'error');
        // Re-enable submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        return;
      }
      
      // Success - close modal and refresh list
      const modal = document.getElementById('responseModal');
      if (modal) {
        modal.classList.remove('active');
      }
      showStatus(`Response ${index !== null ? 'updated' : 'added'} successfully!`, 'success');
      loadAdminResponses();
      
      // Re-enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  });
}

// Delete response
function deleteResponse(index) {
  chrome.storage.sync.get(['quickResponses'], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result) {
      result = {};
    }
    const responses = result.quickResponses || [];
    responses.splice(index, 1);
    
    chrome.storage.sync.set({ quickResponses: responses }, () => {
      // Check for errors (especially in Firefox)
      if (chrome.runtime.lastError) {
        console.error('Error deleting response:', chrome.runtime.lastError);
        showStatus('Error deleting response. Please try again.', 'error');
        return;
      }
      
      // Success - refresh list
      showStatus('Response deleted!', 'success');
      loadAdminResponses();
    });
  });
}

// Save settings
function saveSettings(callback) {
  // Check if settings are locked
  chrome.storage.sync.get(['adminPassword', 'adminUnlocked'], (result) => {
    // Handle Firefox case where result might be undefined
    if (result && result.adminPassword && !result.adminUnlocked) {
      showStatus('Settings are locked! Unlock settings to make changes.', 'error');
      return;
    }
    
    const backgroundImageValue = document.getElementById('backgroundImage').value;
    const overlayOpacityEl = document.getElementById('overlayOpacity');
    const overlayEnabledEl = document.getElementById('overlayEnabled');
    
    // Update background color opacity before saving
    updateBackgroundColorOpacity();
    // Update card background color opacity before saving
    updateCardBackgroundOpacity();
    // Update border color opacity before saving
    updateBorderColorOpacity();
    
    const companyLogoValue = document.getElementById('companyLogo').value;
    
    const shadowIntensityEl = document.getElementById('shadowIntensity');
    
    // Get all form values
    const primaryColorEl = document.getElementById('primaryColor');
    const secondaryColorEl = document.getElementById('secondaryColor');
    const accentColorEl = document.getElementById('accentColor');
    const backgroundColorTextEl = document.getElementById('backgroundColorText');
    const cardBackgroundTextEl = document.getElementById('cardBackgroundText');
    const textPrimaryEl = document.getElementById('textPrimary');
    const textSecondaryEl = document.getElementById('textSecondary');
    const textLightTextEl = document.getElementById('textLightText');
    const borderColorTextEl = document.getElementById('borderColorText');
    
    const settings = {
      primaryColor: primaryColorEl?.value || '',
      secondaryColor: secondaryColorEl?.value || '',
      accentColor: accentColorEl?.value || '',
      backgroundColor: backgroundColorTextEl?.value || '',
      cardBackground: cardBackgroundTextEl?.value || '',
      textPrimary: textPrimaryEl?.value || '',
      textSecondary: textSecondaryEl?.value || '',
      textLight: textLightTextEl?.value || '',
      borderColor: borderColorTextEl?.value || '',
      shadowIntensity: shadowIntensityEl ? parseInt(shadowIntensityEl.value) : 15,
      borderRadius: document.getElementById('borderRadius') ? parseInt(document.getElementById('borderRadius').value) : 8,
      backgroundImage: backgroundImageValue,
      userName: document.getElementById('userName').value || 'Team',
      todoistApiKey: document.getElementById('todoistApiKey').value || '',
      // Card visibility is now handled by updateCardVisibility() in card order system
      // cardOrder and textCards are saved separately when changed
      overlayEnabled: overlayEnabledEl ? overlayEnabledEl.checked : true,
      overlayOpacity: overlayOpacityEl ? parseInt(overlayOpacityEl.value) : 20,
      customHeaderTitle: document.getElementById('customHeaderTitle').value.trim(),
      customHeaderText: document.getElementById('customHeaderText').value.trim(),
      businessInfoLine1: document.getElementById('businessInfoLine1').value.trim(),
      businessInfoLine2: document.getElementById('businessInfoLine2').value.trim(),
      businessInfoLine3: document.getElementById('businessInfoLine3').value.trim(),
      businessInfoLine4: document.getElementById('businessInfoLine4').value.trim(),
      companyLogoUrl: document.getElementById('companyLogoUrl').value.trim()
    };
    
    // Remove backgroundImage from sync settings (it's too large for sync storage)
    const { backgroundImage, ...syncSettings } = settings;
    
    // Filter out empty strings and invalid values - Firefox may reject saves with empty strings
    const cleanedSyncSettings = {};
    for (const [key, value] of Object.entries(syncSettings)) {
      // Only include non-empty values (except for booleans, numbers, and arrays)
      if (value !== '' && value !== null && value !== undefined) {
        cleanedSyncSettings[key] = value;
      } else if (typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value)) {
        // Always include booleans, numbers, and arrays (even if falsy)
        cleanedSyncSettings[key] = value;
      }
    }
    
    // Validate that we have at least some settings to save
    if (Object.keys(cleanedSyncSettings).length === 0) {
      showStatus('Error: No valid settings to save. Please check your form values.', 'error');
      if (callback && typeof callback === 'function') {
        callback();
      }
      return;
    }
    
    // Save background image to local storage (supports up to 10MB per item)
    const backgroundImagePromise = backgroundImageValue && backgroundImageValue.trim()
      ? chrome.storage.local.set({ backgroundImage: backgroundImageValue })
      : chrome.storage.local.remove('backgroundImage');
    
    // Save company logo to local storage
    const companyLogoPromise = companyLogoValue && companyLogoValue.trim()
      ? chrome.storage.local.set({ companyLogo: companyLogoValue })
      : chrome.storage.local.remove('companyLogo');
    
    // Save other settings to sync storage
    chrome.storage.sync.set(cleanedSyncSettings, () => {
      // Check for errors in Firefox
      if (chrome.runtime.lastError) {
        console.error('Error saving settings:', chrome.runtime.lastError);
        showStatus('Error saving settings: ' + chrome.runtime.lastError.message, 'error');
        if (callback && typeof callback === 'function') {
          callback();
        }
        return;
      }
      
      // Save background image and logo to local storage
      Promise.all([backgroundImagePromise, companyLogoPromise]).then(() => {
        // Reload brand colors to apply border-radius and other changes immediately
        loadBrandColors();
        showStatus('Settings saved successfully!', 'success');
        
        // Call callback directly if provided (avoid setTimeout to prevent CSP issues)
        if (callback && typeof callback === 'function') {
          callback();
        }
      }).catch((error) => {
        console.error('Error saving images to local storage:', error);
        showStatus('Settings saved, but some images failed to save. Images may be too large.', 'error');
        
        if (callback && typeof callback === 'function') {
          callback();
        }
      });
    });
  });
}

// Reset to defaults
function resetSettings() {
  // Check if settings are locked
  chrome.storage.sync.get(['adminPassword', 'adminUnlocked'], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result) {
      result = {};
    }
    const hasPassword = !!result.adminPassword;
    const isUnlocked = hasPassword ? (result.adminUnlocked === true) : true;
    
    if (!isUnlocked) {
      showStatus('Settings are locked! Unlock settings to reset to defaults.', 'error');
      return;
    }
    
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      const defaults = {
        primaryColor: '#4A90E2',
        secondaryColor: '#50C878',
        accentColor: '#FF6B6B',
        backgroundColor: 'rgba(15, 23, 42, 0.2)',
        cardBackground: 'rgba(255, 255, 255, 0.95)',
        textPrimary: '#1E293B',
        textSecondary: '#64748B',
        textLight: '#FFFFFF',
        borderColor: 'rgba(226, 232, 240, 0.5)',
        shadowIntensity: 15,
        borderRadius: 8,
        backgroundImage: '',
        userName: 'Team',
        todoistApiKey: '',
        cardVisibilityTrackers: true,
        cardVisibilityNotes: true,
        cardVisibilityLinks: true,
        cardVisibilityTodoist: true,
        overlayEnabled: true,
        overlayOpacity: 20
      };
      
      chrome.storage.sync.set(defaults, () => {
        // Clear background image from local storage
        chrome.storage.local.remove('backgroundImage', () => {
          loadSettings();
          showStatus('Settings reset to defaults!', 'success');
        });
      });
    }
  });
}

// Export settings
function exportSettings() {
  chrome.storage.sync.get(null, (allData) => {
    // Handle Firefox case where allData might be undefined
    if (!allData) {
      allData = {};
    }
    // Filter out sensitive data if needed
    const exportData = {
      ...allData,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brand-kit-dashboard-settings-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showStatus('Settings exported successfully!', 'success');
  });
}

// Import settings
function importSettings(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      
      // Validate and clean imported data
      const validKeys = [
        'primaryColor', 'secondaryColor', 'accentColor',
        'backgroundColor', 'cardBackground', 'textPrimary', 'textSecondary',
        'backgroundImage', 'userName', 'todoistApiKey',
        'reminders', 'links', 'notes', 'dailyFocus', 'focusDate'
      ];
      
      const cleanedData = {};
      validKeys.forEach(key => {
        if (importedData.hasOwnProperty(key)) {
          cleanedData[key] = importedData[key];
        }
      });
      
      chrome.storage.sync.set(cleanedData, () => {
        loadSettings();
        showStatus('Settings imported successfully! Refresh the dashboard to see changes.', 'success');
        
        // Reset file input
        event.target.value = '';
      });
    } catch (error) {
      showStatus('Error importing settings: Invalid file format', 'error');
      event.target.value = '';
    }
  };
  
  reader.readAsText(file);
}

// Show status message
function showStatus(message, type) {
  const statusEl = document.getElementById('statusMessage');
  statusEl.textContent = message;
  statusEl.className = `status-message ${type}`;
  
  setTimeout(() => {
    statusEl.className = 'status-message';
  }, 5000);
}

// Utility function for escaping HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Trackers Management
function initializeCountdowns() {
  loadTrackers();
  
  // Add tracker button
  document.getElementById('addTrackerBtn').addEventListener('click', () => {
    openCountdownModal();
  });
  
  // Listen for admin unlock to show/hide trackers section
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes.adminUnlocked !== undefined) {
      loadTrackers();
    }
  });
}

function populateDateDropdowns() {
  const daySelect = document.getElementById('countdownDay');
  const yearSelect = document.getElementById('countdownYear');
  
  if (!daySelect || !yearSelect) return; // Exit if elements don't exist yet
  
  // Populate days (will be updated based on month/year)
  for (let i = 1; i <= 31; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    daySelect.appendChild(option);
  }
  
  // Populate years (current year ± 50)
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 50; i <= currentYear + 50; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    yearSelect.appendChild(option);
  }
}

function updateDayDropdown() {
  const month = parseInt(document.getElementById('countdownMonth').value);
  const year = parseInt(document.getElementById('countdownYear').value);
  const daySelect = document.getElementById('countdownDay');
  
  if (isNaN(month) || isNaN(year)) {
    return;
  }
  
  // Get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const currentValue = parseInt(daySelect.value) || 1;
  
  // Clear and repopulate
  daySelect.innerHTML = '<option value="">Day</option>';
  for (let i = 1; i <= daysInMonth; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    if (i === currentValue && i <= daysInMonth) {
      option.selected = true;
    }
    daySelect.appendChild(option);
  }
}

function loadTrackers() {
  chrome.storage.sync.get(['countdowns', 'adminUnlocked'], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result) {
      result = {};
    }
    const countdowns = result.countdowns || [];
    const isUnlocked = result.adminUnlocked !== false; // Default to unlocked if no password
    
    const trackersSection = document.getElementById('trackersSection');
    const trackersLocked = document.getElementById('trackersLocked');
    const trackersManagement = document.getElementById('trackersManagement');
    
    if (isUnlocked) {
      trackersLocked.style.display = 'none';
      trackersManagement.style.display = 'block';
      trackersSection.classList.remove('locked');
    } else {
      trackersLocked.style.display = 'block';
      trackersManagement.style.display = 'none';
      trackersSection.classList.add('locked');
      return;
    }
    
    displayTrackers(countdowns);
  });
}

function displayTrackers(countdowns) {
  const list = document.getElementById('trackersList');
  list.innerHTML = '';
  
  if (countdowns.length === 0) {
    list.innerHTML = '<p class="empty-state">No trackers yet. Click "Add Tracker" to create one.</p>';
    return;
  }
  
  countdowns.forEach((countdown, index) => {
    const item = createCountdownItem(countdown, index);
    list.appendChild(item);
  });
}

function createCountdownItem(countdown, index) {
  const div = document.createElement('div');
  div.className = 'admin-response-item';
  div.setAttribute('data-index', index);
  
  const targetDate = new Date(countdown.date);
  const dateStr = targetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
  
  div.innerHTML = `
    <div class="response-item-header">
      <div class="response-item-title">
        <span style="font-size: 1.25rem; margin-right: 0.5rem;">${countdown.icon || '⏰'}</span>
        ${escapeHtml(countdown.name)}
      </div>
      <div class="response-item-actions">
        <button class="response-item-btn edit-btn" data-action="edit" data-index="${index}">Edit</button>
        <button class="response-item-btn delete-btn-admin" data-action="delete" data-index="${index}">Delete</button>
      </div>
    </div>
    <div class="response-item-field">
      <label>Type:</label>
      <div>${countdown.type === 'countup' ? 'Count Up' : 'Countdown'}</div>
    </div>
    <div class="response-item-field">
      <label>Date & Time:</label>
      <div>${dateStr}</div>
    </div>
    <div class="response-item-field">
      <label>Pin to Dashboard:</label>
      <div>${countdown.pinnedToDashboard !== false ? '✅ Yes' : '❌ No'}</div>
    </div>
    ${countdown.url ? `
    <div class="response-item-field">
      <label>Link URL:</label>
      <div style="color: #64748b; word-break: break-all;">${escapeHtml(countdown.url)}</div>
    </div>
    ` : ''}
  `;
  
  // Edit button
  div.querySelector('[data-action="edit"]').addEventListener('click', () => {
    chrome.storage.sync.get(['countdowns'], (result) => {
      // Handle Firefox case where result might be undefined
      if (result && result.countdowns && result.countdowns[index]) {
        openCountdownModal(result.countdowns[index], index);
      }
    });
  });
  
  // Delete button
  div.querySelector('[data-action="delete"]').addEventListener('click', () => {
    if (confirm(`Delete "${countdown.name}"?`)) {
      deleteCountdown(index);
    }
  });
  
  return div;
}

function openCountdownModal(countdown = null, index = null) {
  // Create modal if it doesn't exist
  let modal = document.getElementById('countdownModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'countdownModal';
    modal.className = 'response-modal';
    modal.innerHTML = `
      <div class="response-modal-content">
        <span class="response-modal-close" id="closeCountdownModal">&times;</span>
        <h3>${countdown ? 'Edit Countdown' : 'Add Countdown'}</h3>
        <form id="countdownForm">
          <div class="input-group">
            <label for="countdownName">Name *</label>
            <input type="text" id="countdownName" required placeholder="Event name">
          </div>
          
          <div class="input-group">
            <label for="countdownType">Type *</label>
            <select id="countdownType" required>
              <option value="countdown">Countdown</option>
              <option value="countup">Count Up</option>
            </select>
          </div>
          
          <div class="input-group">
            <label for="countdownDate">Date *</label>
            <div class="date-inputs">
              <select id="countdownMonth" required>
                <option value="">Month</option>
                <option value="0">Jan</option>
                <option value="1">Feb</option>
                <option value="2">Mar</option>
                <option value="3">Apr</option>
                <option value="4">May</option>
                <option value="5">Jun</option>
                <option value="6">Jul</option>
                <option value="7">Aug</option>
                <option value="8">Sep</option>
                <option value="9">Oct</option>
                <option value="10">Nov</option>
                <option value="11">Dec</option>
              </select>
              <select id="countdownDay" required>
                <option value="">Day</option>
              </select>
              <select id="countdownYear" required>
                <option value="">Year</option>
              </select>
            </div>
          </div>
          
          <div class="input-group">
            <label for="countdownTime">Time</label>
            <input type="time" id="countdownTime" value="00:00">
          </div>
          
          <div class="input-group">
            <label for="countdownIcon">Icon</label>
            <div class="icon-selector">
              <button type="button" class="icon-picker-btn" id="iconPickerBtn">
                <span id="selectedIcon">⏰</span>
                <span class="icon-arrow">▼</span>
              </button>
              <div class="icon-grid" id="iconGrid" style="display: none;">
                <button type="button" class="icon-option" data-icon="⏰">⏰</button>
                <button type="button" class="icon-option" data-icon="🎉">🎉</button>
                <button type="button" class="icon-option" data-icon="🎂">🎂</button>
                <button type="button" class="icon-option" data-icon="🎄">🎄</button>
                <button type="button" class="icon-option" data-icon="🎁">🎁</button>
                <button type="button" class="icon-option" data-icon="📅">📅</button>
                <button type="button" class="icon-option" data-icon="🚀">🚀</button>
                <button type="button" class="icon-option" data-icon="⭐">⭐</button>
                <button type="button" class="icon-option" data-icon="💼">💼</button>
                <button type="button" class="icon-option" data-icon="🏆">🏆</button>
                <button type="button" class="icon-option" data-icon="🎯">🎯</button>
                <button type="button" class="icon-option" data-icon="📌">📌</button>
              </div>
            </div>
          </div>
          
          <div class="input-group">
            <label class="toggle-label">
              <span>Pin to Dashboard</span>
              <input type="checkbox" id="countdownPinned" checked>
              <span class="toggle-switch"></span>
            </label>
          </div>
          
          <div class="input-group">
            <label for="countdownUrl">Link URL (Optional)</label>
            <input type="url" id="countdownUrl" placeholder="https://example.com">
            <small>If provided, clicking the tracker on the dashboard will open this URL</small>
          </div>
          
          <input type="hidden" id="countdownId">
          <div class="button-group-inline" style="margin-top: 1rem;">
            <button type="submit" class="save-settings-btn" style="flex: 1;">${countdown ? 'Update' : 'Add'} Countdown</button>
            <button type="button" class="reset-btn" id="cancelCountdownBtn">Cancel</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Populate date dropdowns
    populateDateDropdowns();
    
    // Close handlers
    document.getElementById('closeCountdownModal').addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    document.getElementById('cancelCountdownBtn').addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
    
    // Form submit
    document.getElementById('countdownForm').addEventListener('submit', (e) => {
      e.preventDefault();
      saveCountdown(index);
    });
    
    // Icon picker
    document.getElementById('iconPickerBtn').addEventListener('click', (e) => {
      e.preventDefault();
      const iconGrid = document.getElementById('iconGrid');
      iconGrid.style.display = iconGrid.style.display === 'none' ? 'grid' : 'none';
    });
    
    // Icon selection
    modal.querySelectorAll('.icon-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const icon = btn.dataset.icon;
        document.getElementById('selectedIcon').textContent = icon;
        document.getElementById('iconGrid').style.display = 'none';
      });
    });
    
    // Update day dropdown when month/year changes
    document.getElementById('countdownMonth').addEventListener('change', updateDayDropdown);
    document.getElementById('countdownYear').addEventListener('change', updateDayDropdown);
  }
  
  // Populate form if editing
  if (countdown) {
    document.getElementById('countdownId').value = index;
    document.getElementById('countdownName').value = countdown.name;
    document.getElementById('countdownType').value = countdown.type || 'countdown';
    
    const targetDate = new Date(countdown.date);
    document.getElementById('countdownMonth').value = targetDate.getMonth();
    document.getElementById('countdownYear').value = targetDate.getFullYear();
    updateDayDropdown();
    document.getElementById('countdownDay').value = targetDate.getDate();
    
    const hours = targetDate.getHours().toString().padStart(2, '0');
    const minutes = targetDate.getMinutes().toString().padStart(2, '0');
    document.getElementById('countdownTime').value = `${hours}:${minutes}`;
    
    document.getElementById('selectedIcon').textContent = countdown.icon || '⏰';
    document.getElementById('countdownPinned').checked = countdown.pinnedToDashboard !== false;
    document.getElementById('countdownUrl').value = countdown.url || '';
    
    // Update modal title
    modal.querySelector('h3').textContent = 'Edit Countdown';
    modal.querySelector('button[type="submit"]').textContent = 'Update Countdown';
  } else {
    document.getElementById('countdownForm').reset();
    document.getElementById('countdownId').value = '';
    document.getElementById('countdownType').value = 'countdown';
    document.getElementById('selectedIcon').textContent = '⏰';
    document.getElementById('countdownPinned').checked = true;
    
    // Set default date to today
    const today = new Date();
    document.getElementById('countdownMonth').value = today.getMonth();
    document.getElementById('countdownYear').value = today.getFullYear();
    updateDayDropdown();
    document.getElementById('countdownDay').value = today.getDate();
    
    // Update modal title
    modal.querySelector('h3').textContent = 'Add Countdown';
    modal.querySelector('button[type="submit"]').textContent = 'Add Countdown';
  }
  
  modal.classList.add('active');
  document.getElementById('countdownName').focus();
}

function saveCountdown() {
  // Prevent multiple submissions
  const submitBtn = document.querySelector('#countdownForm button[type="submit"]');
  if (submitBtn && submitBtn.disabled) {
    return; // Already processing
  }
  
  // Disable submit button to prevent duplicate submissions
  let originalText = '';
  if (submitBtn) {
    submitBtn.disabled = true;
    originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
  }
  
  const name = document.getElementById('countdownName').value.trim();
  const type = document.getElementById('countdownType').value;
  const month = parseInt(document.getElementById('countdownMonth').value);
  const day = parseInt(document.getElementById('countdownDay').value);
  const year = parseInt(document.getElementById('countdownYear').value);
  const time = document.getElementById('countdownTime').value;
  const icon = document.getElementById('selectedIcon').textContent;
  const pinned = document.getElementById('countdownPinned').checked;
  const id = document.getElementById('countdownId').value;
  let url = document.getElementById('countdownUrl').value.trim();
  
  if (!name || isNaN(month) || isNaN(day) || isNaN(year)) {
    showStatus('Please fill in all required fields', 'error');
    // Re-enable submit button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
    return;
  }
  
  // Add https:// if URL doesn't start with http:// or https://
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  // Create date from inputs
  const [hours, minutes] = time.split(':').map(Number);
  const targetDate = new Date(year, month, day, hours || 0, minutes || 0);
  
  chrome.storage.sync.get(['countdowns'], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result) {
      result = {};
    }
    const countdowns = result.countdowns || [];
    
    const countdownData = {
      id: id !== '' ? countdowns[parseInt(id)].id : Date.now().toString(),
      name,
      type,
      date: targetDate.toISOString(),
      icon,
      pinnedToDashboard: pinned
    };
    
    if (url) {
      countdownData.url = url;
    }
    
    if (id !== '') {
      // Edit existing
      countdowns[parseInt(id)] = countdownData;
    } else {
      // Add new
      countdowns.push(countdownData);
    }
    
    chrome.storage.sync.set({ countdowns }, () => {
      // Check for errors (especially in Firefox)
      if (chrome.runtime.lastError) {
        console.error('Error saving countdown:', chrome.runtime.lastError);
        showStatus('Error saving countdown. Please try again.', 'error');
        // Re-enable submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        return;
      }
      
      // Success - close modal and refresh list
      const modal = document.getElementById('countdownModal');
      if (modal) {
        modal.classList.remove('active');
      }
      showStatus(`Countdown ${id !== '' ? 'updated' : 'added'} successfully!`, 'success');
      loadCountdowns();
      
      // Re-enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  });
}

function deleteCountdown(index) {
  if (!confirm('Are you sure you want to delete this countdown?')) {
    return;
  }
  
  chrome.storage.sync.get(['countdowns'], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result) {
      result = {};
    }
    const countdowns = result.countdowns || [];
    countdowns.splice(index, 1);
    
    chrome.storage.sync.set({ countdowns }, () => {
      // Check for errors (especially in Firefox)
      if (chrome.runtime.lastError) {
        console.error('Error deleting countdown:', chrome.runtime.lastError);
        showStatus('Error deleting countdown. Please try again.', 'error');
        return;
      }
      
      // Success - refresh list
      showStatus('Countdown deleted', 'success');
      loadCountdowns();
    });
  });
}

// Links Management
function loadLinks() {
  chrome.storage.sync.get(['links', 'adminUnlocked'], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result || !result.adminUnlocked) {
      return;
    }
    
    const links = result.links || [];
    const list = document.getElementById('linksList');
    if (!list) return;
    
    list.innerHTML = '';
    
    if (links.length === 0) {
      list.innerHTML = '<p style="color: #64748b; text-align: center; padding: 2rem;">No links yet. Click "Add Link" to create one.</p>';
      return;
    }
    
    links.forEach((link, index) => {
      const item = createLinkItem(link, index);
      list.appendChild(item);
    });
  });
}

function createLinkItem(link, index) {
  const div = document.createElement('div');
  div.className = 'admin-link-item';
  div.setAttribute('data-index', index);
  
  const icon = link.icon || (link.name ? link.name.charAt(0).toUpperCase() : '🔗');
  
  // Handle both old format (single URL) and new format (array of URLs)
  const urls = link.urls || (link.url ? [link.url] : []);
  const urlDisplay = urls.length > 1 
    ? `${urls.length} URLs (${urls.slice(0, 2).map(u => new URL(u).hostname).join(', ')}${urls.length > 2 ? '...' : ''})`
    : (urls[0] || 'No URL');
  
  div.innerHTML = `
    <div class="link-item-header">
      <div class="link-item-icon">${icon}</div>
      <div class="link-item-info">
        <div class="link-item-name">${escapeHtml(link.name)}</div>
        <div class="link-item-url">${escapeHtml(urlDisplay)}</div>
      </div>
      <div class="link-item-actions">
        <button class="link-item-btn edit-btn" data-action="edit" data-index="${index}">Edit</button>
        <button class="link-item-btn delete-btn-admin" data-action="delete" data-index="${index}">Delete</button>
      </div>
    </div>
  `;
  
  // Edit button
  div.querySelector('[data-action="edit"]').addEventListener('click', () => {
    openLinkModal(link, index);
  });
  
  // Delete button
  div.querySelector('[data-action="delete"]').addEventListener('click', () => {
    if (confirm(`Delete "${link.name}"?`)) {
      deleteLink(index);
    }
  });
  
  return div;
}

function openLinkModal(link = null, index = null) {
  // Create modal if it doesn't exist
  let modal = document.getElementById('linkModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'linkModal';
    modal.className = 'response-modal';
    modal.innerHTML = `
      <div class="response-modal-content">
        <span class="response-modal-close" id="closeLinkModal">&times;</span>
        <h3>${link ? 'Edit Link' : 'Add Link'}</h3>
        <form id="linkForm">
          <div class="input-group">
            <label for="linkName">Name *</label>
            <input type="text" id="linkName" required placeholder="e.g., Newsletter">
          </div>
          <div class="input-group">
            <label>URLs * <small style="font-weight: normal; color: #64748b;">(Clicking this link will open all URLs in new tabs)</small></label>
            <div id="linkUrlsContainer">
              <!-- URL inputs will be added here -->
            </div>
            <button type="button" id="addUrlBtn" class="reset-btn" style="margin-top: 0.5rem; padding: 0.5rem 1rem;">+ Add Another URL</button>
            <small>Add multiple URLs to open them all when clicking this link (e.g., beehiiv, Canva template, Notion doc)</small>
          </div>
          <div class="input-group">
            <label for="linkIcon">Icon (Optional)</label>
            <input type="text" id="linkIcon" placeholder="🔗 or leave empty for first letter" maxlength="2">
            <small>Enter an emoji or leave empty to use the first letter of the link name</small>
          </div>
          <div class="button-group-inline" style="margin-top: 1rem;">
            <button type="submit" class="save-settings-btn" style="flex: 1;">${link ? 'Update' : 'Add'} Link</button>
            <button type="button" class="reset-btn" id="cancelLinkBtn">Cancel</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Close handlers
    document.getElementById('closeLinkModal').addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    document.getElementById('cancelLinkBtn').addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
    
    // Form submit
    document.getElementById('linkForm').addEventListener('submit', (e) => {
      e.preventDefault();
      saveLink(index);
    });
    
    // Add URL button handler
    document.getElementById('addUrlBtn').addEventListener('click', () => {
      addUrlInput();
    });
  }
  
  // Initialize URL inputs container
  const urlsContainer = document.getElementById('linkUrlsContainer');
  urlsContainer.innerHTML = '';
  
  // Populate form if editing
  if (link) {
    document.getElementById('linkName').value = link.name;
    document.getElementById('linkIcon').value = link.icon || '';
    
    // Handle both old format (single URL) and new format (array of URLs)
    const urls = link.urls || (link.url ? [link.url] : ['']);
    urls.forEach((url, urlIndex) => {
      addUrlInput(url, urlIndex === urls.length - 1);
    });
  } else {
    document.getElementById('linkForm').reset();
    // Add one empty URL input by default
    addUrlInput();
  }
  
  modal.classList.add('active');
  document.getElementById('linkName').focus();
}

// Add a URL input field
function addUrlInput(value = '', isLast = true) {
  const container = document.getElementById('linkUrlsContainer');
  const urlIndex = container.children.length;
  const urlDiv = document.createElement('div');
  urlDiv.className = 'url-input-wrapper';
  urlDiv.style.display = 'flex';
  urlDiv.style.gap = '0.5rem';
  urlDiv.style.marginBottom = '0.5rem';
  urlDiv.style.alignItems = 'center';
  
  // Escape value for HTML attribute (escape quotes)
  const escapedValue = value.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  
  urlDiv.innerHTML = `
    <input type="url" class="link-url-input" placeholder="https://example.com" value="${escapedValue}" style="flex: 1; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: var(--border-radius-sm);">
    ${urlIndex > 0 ? '<button type="button" class="remove-url-btn" style="padding: 0.5rem 1rem; background: #ef4444; color: white; border: none; border-radius: var(--border-radius-sm); cursor: pointer;">Remove</button>' : ''}
  `;
  
  container.appendChild(urlDiv);
  
  // Remove button handler
  const removeBtn = urlDiv.querySelector('.remove-url-btn');
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      urlDiv.remove();
    });
  }
}

function saveLink(index) {
  // Prevent multiple submissions
  const submitBtn = document.querySelector('#linkForm button[type="submit"]');
  if (submitBtn && submitBtn.disabled) {
    return; // Already processing
  }
  
  // Disable submit button to prevent duplicate submissions
  let originalText = '';
  if (submitBtn) {
    submitBtn.disabled = true;
    originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
  }
  
  const name = document.getElementById('linkName').value.trim();
  const icon = document.getElementById('linkIcon').value.trim();
  
  // Get all URL inputs
  const urlInputs = document.querySelectorAll('.link-url-input');
  const urls = Array.from(urlInputs)
    .map(input => input.value.trim())
    .filter(url => url.length > 0);
  
  if (!name) {
    showStatus('Name is required!', 'error');
    // Re-enable submit button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
    return;
  }
  
  if (urls.length === 0) {
    showStatus('At least one URL is required!', 'error');
    // Re-enable submit button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
    return;
  }
  
  // Normalize URLs (add https:// if missing)
  const normalizedUrls = urls.map(url => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  });
  
  chrome.storage.sync.get(['links'], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result) {
      result = {};
    }
    const links = result.links || [];
    
    const linkData = { name, urls: normalizedUrls };
    if (icon) {
      linkData.icon = icon;
    }
    
    if (index !== null) {
      links[index] = linkData;
    } else {
      links.push(linkData);
    }
    
    chrome.storage.sync.set({ links }, () => {
      // Check for errors (especially in Firefox)
      if (chrome.runtime.lastError) {
        console.error('Error saving link:', chrome.runtime.lastError);
        showStatus('Error saving link. Please try again.', 'error');
        // Re-enable submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        return;
      }
      
      // Success - close modal and refresh list
      const modal = document.getElementById('linkModal');
      if (modal) {
        modal.classList.remove('active');
      }
      showStatus(`Link ${index !== null ? 'updated' : 'added'} successfully!`, 'success');
      loadLinks();
      
      // Re-enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  });
}

function deleteLink(index) {
  chrome.storage.sync.get(['links'], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result) {
      result = {};
    }
    const links = result.links || [];
    links.splice(index, 1);
    chrome.storage.sync.set({ links }, () => {
      // Check for errors (especially in Firefox)
      if (chrome.runtime.lastError) {
        console.error('Error deleting link:', chrome.runtime.lastError);
        showStatus('Error deleting link. Please try again.', 'error');
        return;
      }
      
      // Success - refresh list
      showStatus('Link deleted successfully!', 'success');
      loadLinks();
    });
  });
}

function openBatchLinkModal() {
  // Create modal if it doesn't exist
  let modal = document.getElementById('batchLinkModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'batchLinkModal';
    modal.className = 'response-modal';
    modal.innerHTML = `
      <div class="response-modal-content" style="max-width: 600px;">
        <span class="response-modal-close" id="closeBatchLinkModal">&times;</span>
        <h3>Batch Add Links</h3>
        <form id="batchLinkForm">
          <div class="input-group">
            <label>Instructions</label>
            <div style="background: rgba(0,0,0,0.05); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid var(--primary-color);">
              <p style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.5rem;">
                Add multiple links at once. Enter one link per line in the format:
              </p>
              <p style="font-weight: 600; margin-bottom: 0.5rem;">Name | URL(s) | Icon (optional)</p>
              <p style="color: #64748b; font-size: 0.875rem; margin-top: 0.5rem;">
                For multiple URLs per link, separate them with commas. All URLs will open when clicking the link.
              </p>
              <p style="color: #64748b; font-size: 0.875rem; margin-top: 0.5rem;">Examples:</p>
              <code style="background: rgba(0,0,0,0.1); padding: 0.5rem; border-radius: 4px; display: block; font-family: monospace; font-size: 0.8rem; white-space: pre-wrap; margin-top: 0.5rem;">
Google | https://google.com | 🔍
Newsletter | https://beehiiv.com,https://canva.com/template,https://notion.so/doc | 📧
GitHub | https://github.com
Twitter | https://twitter.com | 🐦</code>
            </div>
          </div>
          <div class="input-group">
            <label for="batchLinksInput">Links *</label>
            <textarea id="batchLinksInput" required rows="10" placeholder="Link One | https://example.com | 🔗&#10;Newsletter | https://beehiiv.com,https://canva.com/template,https://notion.so/doc | 📧&#10;Link Three | https://example3.com | ⭐" style="font-family: monospace; font-size: 0.9rem;"></textarea>
          </div>
          <div class="button-group-inline" style="margin-top: 1rem;">
            <button type="submit" class="save-settings-btn" style="flex: 1;">Add All Links</button>
            <button type="button" class="reset-btn" id="cancelBatchLinkBtn">Cancel</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Close handlers
    document.getElementById('closeBatchLinkModal').addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    document.getElementById('cancelBatchLinkBtn').addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
    
    // Form submit
    document.getElementById('batchLinkForm').addEventListener('submit', (e) => {
      e.preventDefault();
      saveBatchLinks();
    });
  }
  
  document.getElementById('batchLinksInput').value = '';
  modal.classList.add('active');
  document.getElementById('batchLinksInput').focus();
}

function saveBatchLinks() {
  const batchInput = document.getElementById('batchLinksInput').value.trim();
  if (!batchInput) {
    showStatus('Please enter at least one link.', 'error');
    return;
  }
  
  const lines = batchInput.split('\n').filter(line => line.trim());
  const newLinks = [];
  
  lines.forEach((line, index) => {
    const parts = line.split('|').map(part => part.trim());
    
    if (parts.length < 2) {
      console.warn(`Skipping invalid line ${index + 1}: ${line}`);
      return;
    }
    
    const name = parts[0];
    const urlsString = parts[1];
    const icon = parts[2] || '';
    
    if (!name || !urlsString) {
      console.warn(`Skipping line ${index + 1} - missing name or URL: ${line}`);
      return;
    }
    
    // Split URLs by comma and normalize
    const urls = urlsString.split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0)
      .map(url => {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          return 'https://' + url;
        }
        return url;
      });
    
    if (urls.length === 0) {
      console.warn(`Skipping line ${index + 1} - no valid URLs: ${line}`);
      return;
    }
    
    const linkData = { name, urls };
    if (icon) {
      linkData.icon = icon;
    }
    newLinks.push(linkData);
  });
  
  if (newLinks.length === 0) {
    showStatus('No valid links found. Please check your format.', 'error');
    return;
  }
  
  chrome.storage.sync.get(['links'], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result) {
      result = {};
    }
    const links = result.links || [];
    links.push(...newLinks);
    chrome.storage.sync.set({ links }, () => {
      loadLinks();
      document.getElementById('batchLinkModal').classList.remove('active');
      showStatus(`Successfully added ${newLinks.length} link(s)!`, 'success');
    });
  });
}

// Notes Management
function loadNotes() {
  chrome.storage.sync.get(['notes', 'adminUnlocked'], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result || !result.adminUnlocked) {
      return;
    }
    
    const notes = result.notes || [];
    const list = document.getElementById('notesList');
    if (!list) return;
    
    list.innerHTML = '';
    
    if (notes.length === 0) {
      list.innerHTML = '<p style="color: #64748b; text-align: center; padding: 2rem;">No notes yet. Click "Add Note" to create one.</p>';
      return;
    }
    
    notes.forEach((note, index) => {
      const item = createNoteItem(note, index);
      list.appendChild(item);
    });
  });
}

function createNoteItem(note, index) {
  const div = document.createElement('div');
  div.className = 'admin-note-item';
  div.setAttribute('data-index', index);
  
  div.innerHTML = `
    <div class="note-item-header">
      <div class="note-item-info">
        <div class="note-item-title">${escapeHtml(note.title)}</div>
        <div class="note-item-content">${escapeHtml(note.content)}</div>
        ${note.url ? `<div style="color: #64748b; font-size: 0.875rem; margin-top: 0.5rem; word-break: break-all;">🔗 ${escapeHtml(note.url)}</div>` : ''}
      </div>
      <div class="note-item-actions">
        <button class="note-item-btn edit-btn" data-action="edit" data-index="${index}">Edit</button>
        <button class="note-item-btn delete-btn-admin" data-action="delete" data-index="${index}">Delete</button>
      </div>
    </div>
  `;
  
  // Edit button
  div.querySelector('[data-action="edit"]').addEventListener('click', () => {
    openNoteModal(note, index);
  });
  
  // Delete button
  div.querySelector('[data-action="delete"]').addEventListener('click', () => {
    if (confirm(`Delete "${note.title}"?`)) {
      deleteNote(index);
    }
  });
  
  return div;
}

function openNoteModal(note = null, index = null) {
  // Create modal if it doesn't exist
  let modal = document.getElementById('noteModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'noteModal';
    modal.className = 'response-modal';
    modal.innerHTML = `
      <div class="response-modal-content">
        <span class="response-modal-close" id="closeNoteModal">&times;</span>
        <h3>${note ? 'Edit Note' : 'Add Note'}</h3>
        <form id="noteForm">
          <div class="input-group">
            <label for="noteTitle">Title *</label>
            <input type="text" id="noteTitle" required placeholder="Note title">
          </div>
          <div class="input-group">
            <label for="noteContent">Content *</label>
            <textarea id="noteContent" required placeholder="Note content" rows="6"></textarea>
          </div>
          <div class="input-group">
            <label for="noteUrl">Link URL (Optional)</label>
            <input type="url" id="noteUrl" placeholder="https://example.com">
            <small>If provided, clicking the note on the dashboard will open this URL</small>
          </div>
          <div class="button-group-inline" style="margin-top: 1rem;">
            <button type="submit" class="save-settings-btn" style="flex: 1;">${note ? 'Update' : 'Add'} Note</button>
            <button type="button" class="reset-btn" id="cancelNoteBtn">Cancel</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Close handlers
    document.getElementById('closeNoteModal').addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    document.getElementById('cancelNoteBtn').addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
    
    // Form submit
    document.getElementById('noteForm').addEventListener('submit', (e) => {
      e.preventDefault();
      saveNote(index);
    });
  }
  
  // Populate form if editing
  if (note) {
    document.getElementById('noteTitle').value = note.title;
    document.getElementById('noteContent').value = note.content;
    document.getElementById('noteUrl').value = note.url || '';
  } else {
    document.getElementById('noteForm').reset();
  }
  
  modal.classList.add('active');
  document.getElementById('noteTitle').focus();
}

function saveNote(index) {
  // Prevent multiple submissions
  const submitBtn = document.querySelector('#noteForm button[type="submit"]');
  if (submitBtn && submitBtn.disabled) {
    return; // Already processing
  }
  
  // Disable submit button to prevent duplicate submissions
  let originalText = '';
  if (submitBtn) {
    submitBtn.disabled = true;
    originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
  }
  
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();
  let url = document.getElementById('noteUrl').value.trim();
  
  if (!title || !content) {
    showStatus('Title and content are required!', 'error');
    // Re-enable submit button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
    return;
  }
  
  // Add https:// if URL doesn't start with http:// or https://
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  chrome.storage.sync.get(['notes'], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result) {
      result = {};
    }
    const notes = result.notes || [];
    
    const noteData = { title, content };
    
    if (url) {
      noteData.url = url;
    }
    
    if (index !== null) {
      notes[index] = noteData;
    } else {
      notes.push(noteData);
    }
    
    chrome.storage.sync.set({ notes }, () => {
      // Check for errors (especially in Firefox)
      if (chrome.runtime.lastError) {
        console.error('Error saving note:', chrome.runtime.lastError);
        showStatus('Error saving note. Please try again.', 'error');
        // Re-enable submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        return;
      }
      
      // Success - close modal and refresh list
      const modal = document.getElementById('noteModal');
      if (modal) {
        modal.classList.remove('active');
      }
      showStatus(`Note ${index !== null ? 'updated' : 'added'} successfully!`, 'success');
      loadNotes();
      
      // Re-enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  });
}

function deleteNote(index) {
  chrome.storage.sync.get(['notes'], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result) {
      result = {};
    }
    const notes = result.notes || [];
    notes.splice(index, 1);
    chrome.storage.sync.set({ notes }, () => {
      // Check for errors (especially in Firefox)
      if (chrome.runtime.lastError) {
        console.error('Error deleting note:', chrome.runtime.lastError);
        showStatus('Error deleting note. Please try again.', 'error');
        return;
      }
      
      // Success - refresh list
      showStatus('Note deleted successfully!', 'success');
      loadNotes();
    });
  });
}

// Handle company logo upload
function handleCompanyLogoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Check file type (PNG only)
  if (file.type !== 'image/png') {
    showStatus('Please select a PNG image file.', 'error');
    event.target.value = '';
    return;
  }
  
  // Check file size (max 2MB for logo)
  if (file.size > 2 * 1024 * 1024) {
    showStatus('Logo file is too large. Maximum size is 2MB.', 'error');
    event.target.value = '';
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    // Set the data URL as the company logo value
    document.getElementById('companyLogo').value = dataUrl;
    updateCompanyLogoPreview();
    showStatus('Logo uploaded successfully! Don\'t forget to save settings.', 'success');
  };
  
  reader.onerror = () => {
    showStatus('Error reading logo file.', 'error');
    event.target.value = '';
  };
  
  reader.readAsDataURL(file);
}

// Update company logo preview
function updateCompanyLogoPreview() {
  const logoUrl = document.getElementById('companyLogo').value.trim();
  const preview = document.getElementById('companyLogoPreview');
  const previewImg = document.getElementById('companyLogoPreviewImg');
  
  if (logoUrl) {
    previewImg.src = logoUrl;
    preview.style.display = 'block';
    
    // Handle image load errors
    previewImg.onerror = () => {
      preview.style.display = 'none';
      if (logoUrl && !logoUrl.startsWith('data:')) {
        showStatus('Could not load logo. Please check the file.', 'error');
      }
    };
    
    previewImg.onload = () => {
      // Logo loaded successfully
    };
  } else {
    preview.style.display = 'none';
  }
}

// Handle background image upload
function handleBackgroundImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    showStatus('Please select a valid image file.', 'error');
    event.target.value = '';
    return;
  }
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showStatus('Image file is too large. Maximum size is 5MB.', 'error');
    event.target.value = '';
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    // Set the data URL as the background image value
    document.getElementById('backgroundImage').value = dataUrl;
    updateBackgroundImagePreview();
    showStatus('Image uploaded successfully! Don\'t forget to save settings.', 'success');
  };
  
  reader.onerror = () => {
    showStatus('Error reading image file.', 'error');
    event.target.value = '';
  };
  
  reader.readAsDataURL(file);
}

// Update background image preview
function updateBackgroundImagePreview() {
  const imageUrl = document.getElementById('backgroundImage').value.trim();
  const preview = document.getElementById('backgroundImagePreview');
  const previewImg = document.getElementById('backgroundImagePreviewImg');
  
  if (imageUrl) {
    previewImg.src = imageUrl;
    preview.style.display = 'block';
    
    // Handle image load errors
    previewImg.onerror = () => {
      preview.style.display = 'none';
      if (imageUrl && !imageUrl.startsWith('data:')) {
        showStatus('Could not load image. Please check the URL.', 'error');
      }
    };
    
    previewImg.onload = () => {
      // Image loaded successfully
    };
  } else {
    preview.style.display = 'none';
  }
}

// Initialize navigation menu
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.settings-section[id]');
  
  // Update active link on scroll
  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
  
  // Smooth scroll on click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 100;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Update on scroll
  window.addEventListener('scroll', () => {
    updateActiveLink();
    updateScrollToTopButton();
  });
  updateActiveLink(); // Initial update
  updateScrollToTopButton(); // Initial update
  
  // Initialize scroll to top button
  const scrollButton = document.getElementById('scrollToTop');
  if (scrollButton) {
    scrollButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Scroll to top button visibility
function updateScrollToTopButton() {
  const scrollButton = document.getElementById('scrollToTop');
  if (!scrollButton) return;
  
  if (window.pageYOffset > 300) {
    scrollButton.classList.add('show');
  } else {
    scrollButton.classList.remove('show');
  }
}

// Card Order Management
const defaultCardOrder = [
  { id: 'trackers', name: 'Trackers', type: 'system' },
  { id: 'notes', name: 'Notes', type: 'system' },
  { id: 'links', name: 'Quick Links', type: 'system' },
  { id: 'todoist', name: 'Todoist', type: 'system' }
];

function initializeCardOrder() {
  loadCardOrder();
  setupCardOrderDragDrop();
  
  // Add button handler for adding text cards
  const addTextCardBtn = document.getElementById('addTextCardBtn');
  if (addTextCardBtn) {
    addTextCardBtn.addEventListener('click', () => {
      addTextCard();
    });
  }
}

function loadCardOrder() {
  chrome.storage.sync.get(['cardOrder', 'cardVisibilityTrackers', 'cardVisibilityNotes', 'cardVisibilityLinks', 'cardVisibilityTodoist', 'textCards'], (result) => {
    if (!result) {
      result = {};
    }
    
    // Get card order or use default
    let cardOrder = result.cardOrder || defaultCardOrder.map(c => c.id);
    
    // Get text cards
    const textCards = result.textCards || [];
    
    // Build full card list including text cards
    const allCards = [];
    const systemCards = {
      'trackers': { id: 'trackers', name: 'Trackers', type: 'system' },
      'notes': { id: 'notes', name: 'Notes', type: 'system' },
      'links': { id: 'links', name: 'Quick Links', type: 'system' },
      'todoist': { id: 'todoist', name: 'Todoist', type: 'system' }
    };
    
    // Add system cards in order
    cardOrder.forEach(cardId => {
      if (systemCards[cardId]) {
        allCards.push(systemCards[cardId]);
      }
    });
    
    // Add text cards
    textCards.forEach((textCard, index) => {
      allCards.push({
        id: `text-${textCard.id}`,
        name: textCard.title || 'Text Card',
        type: 'text',
        textCardId: textCard.id
      });
    });
    
    // Render the list
    renderCardOrderList(allCards, result);
  });
}

function renderCardOrderList(cards, settings) {
  const listContainer = document.getElementById('cardOrderList');
  if (!listContainer) return;
  
  listContainer.innerHTML = '';
  
  cards.forEach((card) => {
    const item = document.createElement('div');
    item.className = 'card-order-item';
    item.dataset.cardId = card.id;
    item.draggable = true;
    
    // Get visibility state
    let isVisible = true;
    if (card.type === 'system') {
      const visibilityKey = `cardVisibility${card.id.charAt(0).toUpperCase() + card.id.slice(1)}`;
      isVisible = settings[visibilityKey] !== false;
    } else if (card.type === 'text') {
      const textCard = (settings.textCards || []).find(tc => tc.id === card.textCardId);
      isVisible = textCard ? (textCard.visible !== false) : true;
    }
    
    item.innerHTML = `
      <div class="card-order-handle" title="Drag to reorder"></div>
      <div class="card-order-info">
        <span class="card-order-name">${card.name}</span>
        <span class="card-order-type">${card.type === 'system' ? 'System' : 'Text Card'}</span>
      </div>
      <label class="toggle-label card-order-toggle" style="margin: 0; justify-content: flex-end;">
        <input type="checkbox" ${isVisible ? 'checked' : ''} data-card-id="${card.id}" data-card-type="${card.type}" ${card.type === 'text' ? `data-text-card-id="${card.textCardId}"` : ''}>
        <span class="toggle-switch"></span>
      </label>
    `;
    
    // Add toggle handler
    const checkbox = item.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', (e) => {
      updateCardVisibility(card.id, card.type, e.target.checked, card.textCardId);
    });
    
    listContainer.appendChild(item);
  });
  
  // Re-setup drag and drop after rendering
  setupCardOrderDragDrop();
}

function setupCardOrderDragDrop() {
  const listContainer = document.getElementById('cardOrderList');
  if (!listContainer) return;
  
  const items = listContainer.querySelectorAll('.card-order-item');
  let draggedElement = null;
  
  items.forEach(item => {
    item.addEventListener('dragstart', (e) => {
      draggedElement = item;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', item.innerHTML);
    });
    
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      items.forEach(i => i.classList.remove('drag-over'));
    });
    
    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      
      const afterElement = getDragAfterElement(listContainer, e.clientY);
      const dragging = document.querySelector('.dragging');
      
      if (dragging) {
        if (afterElement == null) {
          listContainer.appendChild(dragging);
        } else {
          listContainer.insertBefore(dragging, afterElement);
        }
      }
      
      item.classList.add('drag-over');
    });
    
    item.addEventListener('dragleave', () => {
      item.classList.remove('drag-over');
    });
    
    item.addEventListener('drop', (e) => {
      e.preventDefault();
      item.classList.remove('drag-over');
      
      if (draggedElement && draggedElement !== item) {
        const afterElement = getDragAfterElement(listContainer, e.clientY);
        
        if (afterElement == null) {
          listContainer.appendChild(draggedElement);
        } else {
          listContainer.insertBefore(draggedElement, afterElement);
        }
        
        saveCardOrder();
      }
    });
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.card-order-item:not(.dragging)')];
  
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function saveCardOrder() {
  const listContainer = document.getElementById('cardOrderList');
  if (!listContainer) return;
  
  const items = listContainer.querySelectorAll('.card-order-item');
  const cardOrder = [];
  
  items.forEach(item => {
    const cardId = item.dataset.cardId;
    if (cardId && !cardId.startsWith('text-')) {
      cardOrder.push(cardId);
    }
  });
  
  chrome.storage.sync.set({ cardOrder }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error saving card order:', chrome.runtime.lastError);
    }
  });
}

function updateCardVisibility(cardId, cardType, isVisible, textCardId) {
  if (cardType === 'system') {
    const visibilityKey = `cardVisibility${cardId.charAt(0).toUpperCase() + cardId.slice(1)}`;
    chrome.storage.sync.set({ [visibilityKey]: isVisible }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error updating card visibility:', chrome.runtime.lastError);
      }
    });
  } else if (cardType === 'text' && textCardId) {
    chrome.storage.sync.get(['textCards'], (result) => {
      if (!result) {
        result = {};
      }
      const textCards = result.textCards || [];
      const cardIndex = textCards.findIndex(tc => tc.id === textCardId);
      
      if (cardIndex !== -1) {
        textCards[cardIndex].visible = isVisible;
        chrome.storage.sync.set({ textCards }, () => {
          if (chrome.runtime.lastError) {
            console.error('Error updating text card visibility:', chrome.runtime.lastError);
          }
        });
      }
    });
  }
}

// Text Cards Management
let textCardIdCounter = 0;

function initializeTextCards() {
  loadTextCards();
}

function loadTextCards() {
  chrome.storage.sync.get(['textCards'], (result) => {
    if (!result) {
      result = {};
    }
    const textCards = result.textCards || [];
    
    // Find max ID to set counter
    if (textCards.length > 0) {
      const maxId = Math.max(...textCards.map(tc => parseInt(tc.id) || 0));
      textCardIdCounter = maxId + 1;
    }
    
    renderTextCardsList(textCards);
  });
}

function renderTextCardsList(textCards) {
  const listContainer = document.getElementById('textCardsList');
  if (!listContainer) return;
  
  listContainer.innerHTML = '';
  
  textCards.forEach((textCard) => {
    const item = createTextCardItem(textCard);
    listContainer.appendChild(item);
  });
}

function createTextCardItem(textCard) {
  const item = document.createElement('div');
  item.className = 'text-card-item';
  item.dataset.textCardId = textCard.id;
  
  item.innerHTML = `
    <div class="text-card-header">
      <input type="text" class="text-card-title-input" value="${escapeHtml(textCard.title || '')}" placeholder="Card Title" data-text-card-id="${textCard.id}">
      <button class="delete-text-card-btn" data-text-card-id="${textCard.id}" title="Delete text card">🗑️</button>
    </div>
    <div class="text-card-content">
      <textarea class="text-card-content-input" placeholder="Enter card content (supports HTML)" data-text-card-id="${textCard.id}">${escapeHtml(textCard.content || '')}</textarea>
    </div>
  `;
  
  // Add event handlers
  const titleInput = item.querySelector('.text-card-title-input');
  const contentInput = item.querySelector('.text-card-content-input');
  const deleteBtn = item.querySelector('.delete-text-card-btn');
  
  titleInput.addEventListener('input', debounce(() => {
    saveTextCard(textCard.id, titleInput.value, contentInput.value);
  }, 500));
  
  contentInput.addEventListener('input', debounce(() => {
    saveTextCard(textCard.id, titleInput.value, contentInput.value);
  }, 500));
  
  deleteBtn.addEventListener('click', () => {
    deleteTextCard(textCard.id);
  });
  
  return item;
}

function addTextCard() {
  const newId = textCardIdCounter++;
  const newCard = {
    id: newId.toString(),
    title: '',
    content: '',
    visible: true
  };
  
  chrome.storage.sync.get(['textCards'], (result) => {
    if (!result) {
      result = {};
    }
    const textCards = result.textCards || [];
    textCards.push(newCard);
    
    chrome.storage.sync.set({ textCards }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error adding text card:', chrome.runtime.lastError);
      } else {
        // Add to card order
        chrome.storage.sync.get(['cardOrder'], (result) => {
          if (!result) {
            result = {};
          }
          const cardOrder = result.cardOrder || defaultCardOrder.map(c => c.id);
          cardOrder.push(`text-${newId}`);
          chrome.storage.sync.set({ cardOrder }, () => {
            loadCardOrder();
            loadTextCards();
          });
        });
      }
    });
  });
}

function saveTextCard(id, title, content) {
  chrome.storage.sync.get(['textCards'], (result) => {
    if (!result) {
      result = {};
    }
    const textCards = result.textCards || [];
    const cardIndex = textCards.findIndex(tc => tc.id === id);
    
    if (cardIndex !== -1) {
      textCards[cardIndex].title = title;
      textCards[cardIndex].content = content;
    } else {
      textCards.push({ id, title, content, visible: true });
    }
    
    chrome.storage.sync.set({ textCards }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving text card:', chrome.runtime.lastError);
      } else {
        // Update card order list to reflect title change
        loadCardOrder();
      }
    });
  });
}

function deleteTextCard(id) {
  if (!confirm('Are you sure you want to delete this text card?')) {
    return;
  }
  
  chrome.storage.sync.get(['textCards', 'cardOrder'], (result) => {
    if (!result) {
      result = {};
    }
    const textCards = (result.textCards || []).filter(tc => tc.id !== id);
    const cardOrder = (result.cardOrder || []).filter(cardId => cardId !== `text-${id}`);
    
    chrome.storage.sync.set({ textCards, cardOrder }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error deleting text card:', chrome.runtime.lastError);
      } else {
        loadCardOrder();
        loadTextCards();
      }
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize collapsible sections with auto-collapse
function initializeCollapsibleSections() {
  const sections = document.querySelectorAll('.settings-section:not(.admin-lock-section)');
  
  // Wrap content in section-content div if not already wrapped
  sections.forEach(section => {
    const h2 = section.querySelector('h2');
    if (!h2) return;
    
    // Check if content is already wrapped
    if (section.querySelector('.section-content')) {
      // Content already wrapped, just add click handler
      h2.addEventListener('click', () => {
        toggleSection(section);
      });
      return;
    }
    
    // Get all content after h2
    const fragment = document.createDocumentFragment();
    let node = h2.nextSibling;
    while (node) {
      const nextSibling = node.nextSibling;
      fragment.appendChild(node);
      node = nextSibling;
    }
    
    if (fragment.childNodes.length === 0) {
      // No content to wrap, just add click handler
      h2.addEventListener('click', () => {
        toggleSection(section);
      });
      return;
    }
    
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'section-content';
    wrapper.appendChild(fragment);
    
    // Insert wrapper after h2
    h2.parentNode.insertBefore(wrapper, h2.nextSibling);
    
    // Add click handler to h2
    h2.addEventListener('click', () => {
      toggleSection(section);
    });
  });
  
  // Load saved expanded state or default to first section
  chrome.storage.local.get(['expandedSection'], (result) => {
    let sectionToExpand = null;
    
    if (result && result.expandedSection) {
      sectionToExpand = document.getElementById(result.expandedSection);
    }
    
    // If no saved section or saved section not found, use first section
    if (!sectionToExpand && sections.length > 0) {
      sectionToExpand = sections[0];
    }
    
    // Expand the selected section and collapse others
    if (sectionToExpand) {
      expandSection(sectionToExpand);
      collapseOtherSections(sectionToExpand);
    } else {
      // Collapse all by default
      sections.forEach(section => {
        collapseSection(section);
      });
    }
  });
}

function toggleSection(section) {
  if (section.classList.contains('collapsed')) {
    // Expand this section and collapse others
    expandSection(section);
    collapseOtherSections(section);
  } else {
    // Collapse this section
    collapseSection(section);
  }
}

function expandSection(section) {
  section.classList.remove('collapsed');
  const sectionId = section.id;
  if (sectionId) {
    chrome.storage.local.set({ expandedSection: sectionId });
  }
}

function collapseSection(section) {
  section.classList.add('collapsed');
}

function collapseOtherSections(currentSection) {
  const sections = document.querySelectorAll('.settings-section:not(.admin-lock-section)');
  sections.forEach(section => {
    if (section !== currentSection) {
      collapseSection(section);
    }
  });
}

