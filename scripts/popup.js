// Brand Kit Dashboard - Popup Script

let allResponses = [];

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  loadBrandColors();
  loadResponses();
  initializeSearch();
  initializeAdminButton();
});

// Load brand colors and apply to popup
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

// Load responses from storage
function loadResponses() {
  chrome.storage.sync.get(['quickResponses', 'adminPassword'], (result) => {
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
    // Focus on admin section if possible
    setTimeout(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'focusAdminSection' });
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

