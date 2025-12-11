// Brand Kit Dashboard - Popup Script

let allResponses = [];

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  loadBrandColors();
  loadResponses();
  initializeSearch();
  initializeAdminButton();
  initializeLogoClick();
});

// Initialize logo click handler
function initializeLogoClick() {
  const companyLogoLink = document.getElementById('popupCompanyLogoLink');
  if (companyLogoLink) {
    companyLogoLink.addEventListener('click', (e) => {
      // Only prevent default if there's no valid URL
      if (!companyLogoLink.href || companyLogoLink.href === '#' || companyLogoLink.style.pointerEvents === 'none') {
        e.preventDefault();
      }
    });
  }
}

// Load brand colors and apply to popup
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
  
  // Load company logo from local storage and URL from sync storage
  chrome.storage.local.get(['companyLogo'], (localResult) => {
    // Handle Firefox case where localResult might be undefined
    if (!localResult) {
      localResult = {};
    }
    const companyLogoEl = document.getElementById('popupCompanyLogo');
    const companyLogoLink = document.getElementById('popupCompanyLogoLink');
    
    if (companyLogoEl && companyLogoLink && localResult.companyLogo) {
      companyLogoEl.src = localResult.companyLogo;
      companyLogoLink.style.display = 'block';
      
      // Load logo URL
      chrome.storage.sync.get(['companyLogoUrl'], (syncResult) => {
        if (!syncResult) {
          syncResult = {};
        }
        if (syncResult.companyLogoUrl && syncResult.companyLogoUrl.trim()) {
          companyLogoLink.href = syncResult.companyLogoUrl.trim();
          companyLogoLink.style.cursor = 'pointer';
          companyLogoEl.style.cursor = 'pointer';
        } else {
          companyLogoLink.href = '#';
          companyLogoLink.style.pointerEvents = 'none';
          companyLogoEl.style.cursor = 'default';
        }
      });
    } else if (companyLogoLink) {
      companyLogoLink.style.display = 'none';
    }
  });
  
  // Listen for logo changes
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.companyLogo) {
      const companyLogoEl = document.getElementById('popupCompanyLogo');
      const companyLogoLink = document.getElementById('popupCompanyLogoLink');
      if (companyLogoEl && companyLogoLink) {
        if (changes.companyLogo.newValue) {
          companyLogoEl.src = changes.companyLogo.newValue;
          companyLogoLink.style.display = 'block';
          // Reload logo URL
          chrome.storage.sync.get(['companyLogoUrl'], (result) => {
            if (result && result.companyLogoUrl && result.companyLogoUrl.trim()) {
              companyLogoLink.href = result.companyLogoUrl.trim();
              companyLogoLink.style.cursor = 'pointer';
              companyLogoEl.style.cursor = 'pointer';
              companyLogoLink.style.pointerEvents = 'auto';
            } else {
              companyLogoLink.href = '#';
              companyLogoLink.style.pointerEvents = 'none';
              companyLogoEl.style.cursor = 'default';
            }
          });
        } else {
          companyLogoLink.style.display = 'none';
        }
      }
    }
    
    // Listen for logo URL changes
    if (areaName === 'sync' && changes.companyLogoUrl) {
      const companyLogoLink = document.getElementById('popupCompanyLogoLink');
      const companyLogoEl = document.getElementById('popupCompanyLogo');
      if (companyLogoLink && companyLogoEl && companyLogoLink.style.display !== 'none') {
        if (changes.companyLogoUrl.newValue && changes.companyLogoUrl.newValue.trim()) {
          companyLogoLink.href = changes.companyLogoUrl.newValue.trim();
          companyLogoLink.style.cursor = 'pointer';
          companyLogoEl.style.cursor = 'pointer';
          companyLogoLink.style.pointerEvents = 'auto';
        } else {
          companyLogoLink.href = '#';
          companyLogoLink.style.pointerEvents = 'none';
          companyLogoEl.style.cursor = 'default';
        }
      }
    }
  });
}

// Load responses from storage
function loadResponses() {
  chrome.storage.sync.get(['quickResponses', 'adminPassword'], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result) {
      result = {};
    }
    allResponses = result.quickResponses || [];
    displayResponses(allResponses);
    
    // Show admin button if password is set (admin mode enabled)
    if (result.adminPassword) {
      document.getElementById('adminBtn').style.display = 'flex';
    } else {
      document.getElementById('adminBtn').style.display = 'none';
    }
  });
}

// Display responses
function displayResponses(responses) {
  const list = document.getElementById('responsesList');
  const emptyState = document.getElementById('emptyState');
  
  if (responses.length === 0) {
    list.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }
  
  list.style.display = 'block';
  emptyState.style.display = 'none';
  list.innerHTML = '';
  
  responses.forEach((response, index) => {
    const item = createResponseItem(response, index);
    list.appendChild(item);
  });
}

// Create response item element
function createResponseItem(response, index) {
  const div = document.createElement('div');
  div.className = 'response-item';
  div.setAttribute('data-index', index);
  
  const category = response.category ? `<span class="response-category">${escapeHtml(response.category)}</span>` : '';
  
  div.innerHTML = `
    <div class="response-title">${escapeHtml(response.title)}</div>
    <div class="response-text">${escapeHtml(response.text)}</div>
    ${category}
    <span class="copy-icon">📋</span>
  `;
  
  div.addEventListener('click', (e) => {
    copyToClipboard(response.text, response.title, e.currentTarget);
  });
  
  return div;
}

// Copy text to clipboard
async function copyToClipboard(text, title, clickedElement) {
  try {
    await navigator.clipboard.writeText(text);
    showCopyFeedback(title || 'Text');
    
    // Visual feedback on the clicked item
    if (clickedElement) {
      clickedElement.style.background = '#d1fae5';
      setTimeout(() => {
        clickedElement.style.background = '';
      }, 300);
    }
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showCopyFeedback(title || 'Text');
      if (clickedElement) {
        clickedElement.style.background = '#d1fae5';
        setTimeout(() => {
          clickedElement.style.background = '';
        }, 300);
      }
    } catch (fallbackErr) {
      alert('Failed to copy. Please try again.');
    }
    document.body.removeChild(textArea);
  }
}

// Show copy feedback
function showCopyFeedback(title) {
  const feedback = document.getElementById('copyFeedback');
  feedback.textContent = `Copied: ${title}`;
  feedback.classList.add('show');
  
  setTimeout(() => {
    feedback.classList.remove('show');
  }, 2000);
}

// Initialize search
function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    if (query === '') {
      displayResponses(allResponses);
      return;
    }
    
    const filtered = allResponses.filter(response => {
      const titleMatch = response.title.toLowerCase().includes(query);
      const textMatch = response.text.toLowerCase().includes(query);
      const categoryMatch = response.category?.toLowerCase().includes(query);
      return titleMatch || textMatch || categoryMatch;
    });
    
    displayResponses(filtered);
  });
}

// Initialize admin button
function initializeAdminButton() {
  document.getElementById('adminBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
    // Focus on admin section if possible (may fail silently in Firefox if no content script)
    setTimeout(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'focusAdminSection' }).catch(() => {
            // Silently fail if message can't be sent (e.g., options page doesn't have content script)
          });
        }
      });
    }, 500);
  });
}

// Utility function
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

