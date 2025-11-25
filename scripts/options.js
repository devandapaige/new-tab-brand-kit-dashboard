// Brand Kit Dashboard - Options/Settings Script

document.addEventListener('DOMContentLoaded', () => {
  loadBrandColors();
  loadSettings();
  initializeColorPickers();
  initializeFormHandlers();
  initializeAdminSection();
  initializeCountdowns();
  populateDateDropdowns();
});

// Load brand colors and apply to settings page
function loadBrandColors() {
  chrome.storage.sync.get(['primaryColor', 'secondaryColor', 'accentColor'], (result) => {
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
    'backgroundImage',
    'userName',
    'todoistApiKey',
    'countdowns'
  ], (result) => {
    if (result.primaryColor) {
      document.getElementById('primaryColor').value = result.primaryColor;
      document.getElementById('primaryColorText').value = result.primaryColor;
    }
    
    if (result.secondaryColor) {
      document.getElementById('secondaryColor').value = result.secondaryColor;
      document.getElementById('secondaryColorText').value = result.secondaryColor;
    }
    
    if (result.accentColor) {
      document.getElementById('accentColor').value = result.accentColor;
      document.getElementById('accentColorText').value = result.accentColor;
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
    }
    
    if (result.textPrimary) {
      document.getElementById('textPrimary').value = result.textPrimary;
      document.getElementById('textPrimaryText').value = result.textPrimary;
    }
    
    if (result.textSecondary) {
      document.getElementById('textSecondary').value = result.textSecondary;
      document.getElementById('textSecondaryText').value = result.textSecondary;
    }
    
    if (result.backgroundImage) {
      document.getElementById('backgroundImage').value = result.backgroundImage;
    }
    
    if (result.userName) {
      document.getElementById('userName').value = result.userName;
    }
    
    if (result.todoistApiKey) {
      document.getElementById('todoistApiKey').value = result.todoistApiKey;
    }
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
}

function syncColorPicker(pickerId, textId, isRgba = false) {
  const picker = document.getElementById(pickerId);
  const text = document.getElementById(textId);
  
  if (!picker || !text) return;
  
  picker.addEventListener('input', (e) => {
    const value = e.target.value;
    // Only update if it's a valid hex color (color picker always returns valid hex)
    if (isRgba) {
      const rgba = hexToRgba(value, 0.85);
      if (rgba) {
        text.value = rgba;
      }
    } else {
      // Color picker always returns valid hex, so we can safely set it
      if (/^#([A-Fa-f0-9]{6})$/.test(value)) {
        text.value = value;
      }
    }
  });
}

function syncColorText(textId, pickerId, isRgba = false) {
  const text = document.getElementById(textId);
  const picker = document.getElementById(pickerId);
  
  text.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    
    if (isRgba) {
      const hex = rgbaToHex(value);
      if (hex) {
        picker.value = hex;
      }
    } else {
      // Validate hex color - only update if it's a valid complete hex color
      // This prevents errors when user is still typing
      if (value === '' || /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
        if (value !== '') {
          picker.value = value;
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
      }
    }
  });
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
      if (result.adminUnlocked) {
        lockAdmin();
      } else {
        // Show unlock form if password is set
        chrome.storage.sync.get(['adminPassword'], (pwdResult) => {
          if (pwdResult.adminPassword) {
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
  document.getElementById('addResponseBtn').addEventListener('click', () => {
    openResponseModal();
  });
}

// Load admin state
function loadAdminState() {
  chrome.storage.sync.get(['adminPassword', 'adminUnlocked'], (result) => {
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
      chrome.storage.sync.set({ adminUnlocked: true });
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
    
    // Load responses if unlocked
    if (isUnlocked) {
      loadAdminResponses();
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
    if (password) {
      showStatus('Admin password set successfully! Settings are now locked.', 'success');
      chrome.storage.sync.set({ adminUnlocked: false }, () => {
        document.getElementById('adminPasswordInput').value = '';
        loadAdminState();
      });
    } else {
      showStatus('Password protection disabled. Settings are now unlocked.', 'success');
      chrome.storage.sync.set({ adminUnlocked: true }, () => {
        loadAdminState();
      });
    }
  });
}

// Unlock admin section
function unlockAdmin() {
  chrome.storage.sync.get(['adminPassword'], (result) => {
    if (!result.adminPassword) {
      // No password set, unlock directly
      chrome.storage.sync.set({ adminUnlocked: true }, () => {
        loadAdminState();
        showStatus('Settings unlocked!', 'success');
      });
      return;
    }
    
    const enteredPassword = document.getElementById('adminUnlockPassword').value;
    
    if (enteredPassword === result.adminPassword) {
      chrome.storage.sync.set({ adminUnlocked: true }, () => {
        loadAdminState();
        document.getElementById('adminUnlockPassword').value = '';
        showStatus('Settings unlocked! You can now make changes.', 'success');
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
    loadAdminState();
    showStatus('Settings locked! Staff can view but not change settings.', 'success');
  });
}

// Load admin responses
function loadAdminResponses() {
  chrome.storage.sync.get(['quickResponses', 'adminUnlocked'], (result) => {
    if (!result.adminUnlocked) {
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
  const title = document.getElementById('responseTitle').value.trim();
  const category = document.getElementById('responseCategory').value.trim();
  const text = document.getElementById('responseText').value.trim();
  
  if (!title || !text) {
    showStatus('Title and text are required!', 'error');
    return;
  }
  
  chrome.storage.sync.get(['quickResponses'], (result) => {
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
      loadAdminResponses();
      document.getElementById('responseModal').classList.remove('active');
      showStatus(`Response ${index !== null ? 'updated' : 'added'} successfully!`, 'success');
    });
  });
}

// Delete response
function deleteResponse(index) {
  chrome.storage.sync.get(['quickResponses'], (result) => {
    const responses = result.quickResponses || [];
    responses.splice(index, 1);
    
    chrome.storage.sync.set({ quickResponses: responses }, () => {
      loadAdminResponses();
      showStatus('Response deleted!', 'success');
    });
  });
}

// Save settings
function saveSettings(callback) {
  // Check if settings are locked
  chrome.storage.sync.get(['adminPassword', 'adminUnlocked'], (result) => {
    if (result.adminPassword && !result.adminUnlocked) {
      showStatus('Settings are locked! Unlock settings to make changes.', 'error');
      return;
    }
    
    const settings = {
      primaryColor: document.getElementById('primaryColor').value,
      secondaryColor: document.getElementById('secondaryColor').value,
      accentColor: document.getElementById('accentColor').value,
      backgroundColor: document.getElementById('backgroundColorText').value,
      cardBackground: document.getElementById('cardBackgroundText').value,
      textPrimary: document.getElementById('textPrimary').value,
      textSecondary: document.getElementById('textSecondary').value,
    backgroundImage: document.getElementById('backgroundImage').value,
    userName: document.getElementById('userName').value,
    todoistApiKey: document.getElementById('todoistApiKey').value
    };
    
    chrome.storage.sync.set(settings, () => {
      showStatus('Settings saved successfully!', 'success');
      
      if (callback) {
        setTimeout(callback, 500);
      }
    });
  });
}

// Reset to defaults
function resetSettings() {
  // Check if settings are locked
  chrome.storage.sync.get(['adminPassword', 'adminUnlocked'], (result) => {
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
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        cardBackground: 'rgba(255, 255, 255, 0.95)',
        textPrimary: '#1E293B',
        textSecondary: '#64748B',
      backgroundImage: '',
      userName: 'Team',
      todoistApiKey: ''
      };
      
      chrome.storage.sync.set(defaults, () => {
        loadSettings();
        showStatus('Settings reset to defaults!', 'success');
      });
    }
  });
}

// Export settings
function exportSettings() {
  chrome.storage.sync.get(null, (allData) => {
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
  `;
  
  // Edit button
  div.querySelector('[data-action="edit"]').addEventListener('click', () => {
    chrome.storage.sync.get(['countdowns'], (result) => {
      openCountdownModal(result.countdowns[index], index);
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
  const name = document.getElementById('countdownName').value.trim();
  const type = document.getElementById('countdownType').value;
  const month = parseInt(document.getElementById('countdownMonth').value);
  const day = parseInt(document.getElementById('countdownDay').value);
  const year = parseInt(document.getElementById('countdownYear').value);
  const time = document.getElementById('countdownTime').value;
  const icon = document.getElementById('selectedIcon').textContent;
  const pinned = document.getElementById('countdownPinned').checked;
  const id = document.getElementById('countdownId').value;
  
  if (!name || isNaN(month) || isNaN(day) || isNaN(year)) {
    showStatus('Please fill in all required fields', 'error');
    return;
  }
  
  // Create date from inputs
  const [hours, minutes] = time.split(':').map(Number);
  const targetDate = new Date(year, month, day, hours || 0, minutes || 0);
  
  chrome.storage.sync.get(['countdowns'], (result) => {
    const countdowns = result.countdowns || [];
    
    const countdownData = {
      id: id !== '' ? countdowns[parseInt(id)].id : Date.now().toString(),
      name,
      type,
      date: targetDate.toISOString(),
      icon,
      pinnedToDashboard: pinned
    };
    
    if (id !== '') {
      // Edit existing
      countdowns[parseInt(id)] = countdownData;
    } else {
      // Add new
      countdowns.push(countdownData);
    }
    
    chrome.storage.sync.set({ countdowns }, () => {
      showStatus(`Countdown ${id !== '' ? 'updated' : 'added'} successfully!`, 'success');
      loadCountdowns();
      document.getElementById('countdownModal').classList.remove('active');
    });
  });
}

function deleteCountdown(index) {
  if (!confirm('Are you sure you want to delete this countdown?')) {
    return;
  }
  
  chrome.storage.sync.get(['countdowns'], (result) => {
    const countdowns = result.countdowns || [];
    countdowns.splice(index, 1);
    
    chrome.storage.sync.set({ countdowns }, () => {
      showStatus('Countdown deleted', 'success');
      loadCountdowns();
    });
  });
}


