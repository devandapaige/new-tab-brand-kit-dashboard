// Brand Kit Dashboard - New Tab Script

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  loadBrandSettings();
  initializeDateTime();
  initializeGreeting();
  checkAdminStatus();
  loadCardVisibility();
  loadTrackers();
  loadLinks();
  loadNotes();
  initializeTodoist();
  initializeModals();
  initializeSettings();
  initializeKeyboardShortcuts();
  
  // Listen for admin status changes
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && (changes.adminUnlocked || changes.adminPassword)) {
      checkAdminStatus();
      // Reload items to update delete buttons
      loadLinks();
      loadNotes();
    }
    // Listen for card visibility changes
    if (areaName === 'sync' && (
      changes.cardVisibilityTrackers ||
      changes.cardVisibilityNotes ||
      changes.cardVisibilityLinks ||
      changes.cardVisibilityTodoist
    )) {
      loadCardVisibility();
    }
    // Listen for background image changes (from local storage)
    if (areaName === 'local' && changes.backgroundImage) {
      const backgroundImageEl = document.getElementById('backgroundImage');
      
      if (backgroundImageEl) {
        const newValue = changes.backgroundImage.newValue;
        if (newValue && newValue.trim()) {
          const imageUrl = newValue.trim();
          // Apply the background image
          backgroundImageEl.style.backgroundImage = `url("${imageUrl}")`;
          backgroundImageEl.style.opacity = '1';
        } else {
          backgroundImageEl.style.backgroundImage = 'none';
          backgroundImageEl.style.opacity = '0';
        }
      }
    }
    // Listen for overlay and background color changes
    if (areaName === 'sync' && (
      changes.overlayEnabled ||
      changes.overlayOpacity ||
      changes.backgroundColor ||
      changes.textLight ||
      changes.borderColor ||
      changes.shadowIntensity ||
      changes.borderRadius ||
      changes.customHeaderTitle ||
      changes.customHeaderText ||
      changes.businessInfoLine1 ||
      changes.businessInfoLine2 ||
      changes.businessInfoLine3 ||
      changes.businessInfoLine4 ||
      changes.userName
    )) {
      loadBrandSettings();
    }
    
    // Listen for company logo changes (from local storage)
    if (areaName === 'local' && changes.companyLogo) {
      const companyLogoEl = document.getElementById('companyLogo');
      if (companyLogoEl) {
        if (changes.companyLogo.newValue) {
          companyLogoEl.src = changes.companyLogo.newValue;
          companyLogoEl.style.display = 'block';
        } else {
          companyLogoEl.style.display = 'none';
        }
      }
    }
  });
});

// Load and apply card visibility settings
function loadCardVisibility() {
  chrome.storage.sync.get([
    'cardVisibilityTrackers',
    'cardVisibilityNotes',
    'cardVisibilityLinks',
    'cardVisibilityTodoist'
  ], (result) => {
    // Trackers card
    const trackersCard = document.getElementById('trackersCard');
    if (trackersCard) {
      const isVisible = result.cardVisibilityTrackers !== false; // Default to true if not set
      trackersCard.style.display = isVisible ? 'block' : 'none';
    }
    
    // Notes card
    const notesCard = document.querySelector('.notes-card');
    if (notesCard) {
      const isVisible = result.cardVisibilityNotes !== false; // Default to true if not set
      notesCard.style.display = isVisible ? 'block' : 'none';
    }
    
    // Links card
    const linksCard = document.querySelector('.links-card');
    if (linksCard) {
      const isVisible = result.cardVisibilityLinks !== false; // Default to true if not set
      linksCard.style.display = isVisible ? 'block' : 'none';
    }
    
    // Todoist card
    const todoistCard = document.querySelector('.todoist-card');
    if (todoistCard) {
      const isVisible = result.cardVisibilityTodoist !== false; // Default to true if not set
      todoistCard.style.display = isVisible ? 'block' : 'none';
    }
  });
}

// Check admin status and update UI accordingly
function checkAdminStatus() {
  chrome.storage.sync.get(['adminPassword', 'adminUnlocked'], (result) => {
    const hasPassword = !!result.adminPassword;
    // Only show buttons if admin is explicitly unlocked (or no password is set)
    // If password exists but not unlocked, hide buttons
    const isUnlocked = hasPassword ? (result.adminUnlocked === true) : true;
    
    // No add buttons on dashboard - all CRUD is in Settings
    
    // Store admin status for use in other functions
    window.isAdmin = isUnlocked;
  });
}

// Load brand color settings from storage
async function loadBrandSettings() {
  try {
    const result = await chrome.storage.sync.get([
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
      'overlayEnabled',
      'overlayOpacity',
      'customHeaderTitle',
      'customHeaderText',
      'businessInfoLine1',
      'businessInfoLine2',
      'businessInfoLine3',
      'businessInfoLine4'
    ]);
    
    // Load background image and company logo from local storage (they're stored there because they can be large)
    const localResult = await chrome.storage.local.get(['backgroundImage', 'companyLogo']);
    const backgroundImage = localResult.backgroundImage || result.backgroundImage; // Fallback to sync for backwards compatibility
    const companyLogo = localResult.companyLogo;

    const root = document.documentElement;
    
    if (result.primaryColor) {
      root.style.setProperty('--primary-color', result.primaryColor);
      const rgb = hexToRgb(result.primaryColor);
      if (rgb) {
        root.style.setProperty('--primary-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
      }
    }
    
    if (result.secondaryColor) {
      root.style.setProperty('--secondary-color', result.secondaryColor);
      const rgb = hexToRgb(result.secondaryColor);
      if (rgb) {
        root.style.setProperty('--secondary-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
      }
    }
    
    if (result.accentColor) {
      root.style.setProperty('--accent-color', result.accentColor);
      const rgb = hexToRgb(result.accentColor);
      if (rgb) {
        root.style.setProperty('--accent-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
      }
    }
    
    if (result.backgroundColor) {
      root.style.setProperty('--background-color', result.backgroundColor);
    }
    
    if (result.cardBackground) {
      root.style.setProperty('--card-background', result.cardBackground);
    }
    
    if (result.textPrimary) {
      root.style.setProperty('--text-primary', result.textPrimary);
    }
    
    if (result.textSecondary) {
      root.style.setProperty('--text-secondary', result.textSecondary);
    }
    
    if (result.textLight) {
      root.style.setProperty('--text-light', result.textLight);
    }
    
    if (result.borderColor) {
      root.style.setProperty('--border-color', result.borderColor);
    }
    
    // Update shadow values based on intensity
    const shadowIntensity = result.shadowIntensity !== undefined ? result.shadowIntensity : 15;
    const shadowOpacity = shadowIntensity / 100;
    root.style.setProperty('--shadow', `0 4px 6px rgba(0, 0, 0, ${0.1 * shadowOpacity})`);
    root.style.setProperty('--shadow-lg', `0 10px 25px rgba(0, 0, 0, ${0.15 * shadowOpacity})`);
    
    // Update border radius values
    const borderRadius = result.borderRadius !== undefined ? result.borderRadius : 8;
    root.style.setProperty('--border-radius', `${borderRadius}px`);
    root.style.setProperty('--border-radius-sm', `${Math.round(borderRadius * 0.75)}px`);
    root.style.setProperty('--border-radius-lg', `${Math.round(borderRadius * 1.5)}px`);
    
    const backgroundImageEl = document.getElementById('backgroundImage');
    
    if (backgroundImageEl) {
      if (backgroundImage && backgroundImage.trim()) {
        // Handle both data URLs and regular URLs
        const imageUrl = backgroundImage.trim();
        backgroundImageEl.style.backgroundImage = `url("${imageUrl}")`;
        backgroundImageEl.style.opacity = '1';
      } else {
        // Clear background if no image is set
        backgroundImageEl.style.backgroundImage = 'none';
        backgroundImageEl.style.opacity = '0';
      }
    }
    
    if (result.userName) {
      document.getElementById('userName').textContent = result.userName;
    }
    
    // Load and display company logo
    const companyLogoEl = document.getElementById('companyLogo');
    if (companyLogoEl && companyLogo) {
      companyLogoEl.src = companyLogo;
      companyLogoEl.style.display = 'block';
    } else if (companyLogoEl) {
      companyLogoEl.style.display = 'none';
    }
    
    // Load and display business info (with placeholder support)
    const businessInfoEl = document.getElementById('businessInfo');
    const businessInfoLines = [
      result.businessInfoLine1,
      result.businessInfoLine2,
      result.businessInfoLine3,
      result.businessInfoLine4
    ].filter(line => line && line.trim());
    
    if (businessInfoEl && businessInfoLines.length > 0) {
      document.getElementById('businessInfoLine1').innerHTML = replacePlaceholders(result.businessInfoLine1 || '', result.userName);
      document.getElementById('businessInfoLine2').innerHTML = replacePlaceholders(result.businessInfoLine2 || '', result.userName);
      document.getElementById('businessInfoLine3').innerHTML = replacePlaceholders(result.businessInfoLine3 || '', result.userName);
      document.getElementById('businessInfoLine4').innerHTML = replacePlaceholders(result.businessInfoLine4 || '', result.userName);
      businessInfoEl.style.display = 'block';
    } else if (businessInfoEl) {
      businessInfoEl.style.display = 'none';
    }
    
    // Load and display custom header
    const greetingEl = document.getElementById('greeting');
    const dateTimeEl = document.getElementById('dateTime');
    
    if (result.customHeaderTitle || result.customHeaderText) {
      // Use custom header
      if (result.customHeaderTitle) {
        greetingEl.innerHTML = replacePlaceholders(result.customHeaderTitle, result.userName);
      }
      if (result.customHeaderText) {
        dateTimeEl.innerHTML = replacePlaceholders(result.customHeaderText, result.userName);
      }
    } else {
      // Use default header
      if (greetingEl) {
        const greetingText = getGreeting();
        greetingEl.innerHTML = `<span id="greetingText">${greetingText}</span>, <span id="userName">${result.userName || 'Team'}</span>.`;
      }
      // Date/time will be updated by initializeDateTime
    }
    
    // Apply overlay settings
    const overlayEl = document.querySelector('.overlay');
    if (overlayEl) {
      const overlayEnabled = result.overlayEnabled !== false; // Default to true
      
      if (overlayEnabled && result.backgroundColor) {
        overlayEl.style.display = 'block';
        // Use the backgroundColor value directly (it already has the correct opacity from options.js)
        overlayEl.style.backgroundColor = result.backgroundColor;
      } else {
        overlayEl.style.display = 'none';
      }
    }
  } catch (error) {
    console.error('Error loading brand settings:', error);
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

// Initialize date and time
function initializeDateTime() {
  const dateTimeEl = document.getElementById('dateTime');
  
  function updateDateTime() {
    chrome.storage.sync.get(['customHeaderText', 'userName'], (result) => {
      if (result.customHeaderText) {
        // Use custom header text with placeholders
        dateTimeEl.innerHTML = replacePlaceholders(result.customHeaderText, result.userName);
      } else {
        // Use default date/time
        const now = new Date();
        const options = { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        };
        dateTimeEl.textContent = now.toLocaleDateString('en-US', options);
      }
    });
  }
  
  updateDateTime();
  setInterval(updateDateTime, 60000); // Update every minute
  
  // Also update custom header greeting if it contains {{greeting}} (case-insensitive)
  setInterval(() => {
    chrome.storage.sync.get(['customHeaderTitle', 'userName', 'businessInfoLine1', 'businessInfoLine2', 'businessInfoLine3', 'businessInfoLine4'], (result) => {
      // Update header if it contains greeting placeholder
      if (result.customHeaderTitle && /\{\{greeting\}\}/i.test(result.customHeaderTitle)) {
        const greetingEl = document.getElementById('greeting');
        if (greetingEl) {
          greetingEl.innerHTML = replacePlaceholders(result.customHeaderTitle, result.userName);
        }
      }
      
      // Update business info if any line contains placeholders
      const businessInfoEl = document.getElementById('businessInfo');
      if (businessInfoEl && businessInfoEl.style.display !== 'none') {
        document.getElementById('businessInfoLine1').innerHTML = replacePlaceholders(result.businessInfoLine1 || '', result.userName);
        document.getElementById('businessInfoLine2').innerHTML = replacePlaceholders(result.businessInfoLine2 || '', result.userName);
        document.getElementById('businessInfoLine3').innerHTML = replacePlaceholders(result.businessInfoLine3 || '', result.userName);
        document.getElementById('businessInfoLine4').innerHTML = replacePlaceholders(result.businessInfoLine4 || '', result.userName);
      }
    });
  }, 60000); // Check every minute for greeting changes
}

// Get greeting text based on time
function getGreeting() {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

// Initialize greeting (for default header)
function initializeGreeting() {
  chrome.storage.sync.get(['customHeaderTitle', 'userName'], (result) => {
    // Only update if not using custom header
    if (!result.customHeaderTitle) {
      const greetingEl = document.getElementById('greetingText');
      if (greetingEl) {
        greetingEl.textContent = getGreeting();
      }
    }
  });
}

// Replace placeholders in custom header text (case-insensitive)
function replacePlaceholders(text, userName) {
  if (!text) return '';
  
  const greeting = getGreeting();
  const now = new Date();
  const dateOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  const dateStr = now.toLocaleDateString('en-US', dateOptions);
  
  // Case-insensitive replacement using regex with 'i' flag
  return text
    .replace(/\{\{greeting\}\}/gi, greeting)
    .replace(/\{\{date\}\}/gi, dateStr)
    .replace(/\{\{userName\}\}/gi, userName || 'Team')
    .replace(/\{\{username\}\}/gi, userName || 'Team'); // Also support lowercase
}

// Trackers
function loadTrackers() {
  chrome.storage.sync.get(['countdowns'], (result) => {
    const countdowns = result.countdowns || [];
    const pinnedTrackers = countdowns.filter(c => c.pinnedToDashboard !== false);
    
    const trackersList = document.getElementById('trackersList');
    
    if (pinnedTrackers.length === 0) {
      trackersList.innerHTML = '<div class="tracker-placeholder">No trackers pinned to dashboard</div>';
      return;
    }
    
    trackersList.innerHTML = '';
    
    pinnedTrackers.forEach((tracker, index) => {
      const trackerEl = createTrackerElement(tracker, index);
      trackersList.appendChild(trackerEl);
    });
    
    // Start updating all trackers
    updateAllTrackers();
  });
  
  // Listen for tracker changes
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes.countdowns) {
      loadTrackers();
    }
  });
}

function createTrackerElement(tracker, index) {
  const div = document.createElement('div');
  div.className = 'tracker-item';
  div.dataset.trackerId = tracker.id;
  
  // Make clickable if URL is provided
  if (tracker.url) {
    div.style.cursor = 'pointer';
    div.addEventListener('click', () => {
      window.open(tracker.url, '_blank', 'noopener,noreferrer');
    });
  }
  
  const icon = tracker.icon || '⏰';
  const name = tracker.name || 'Tracker';
  const targetDate = new Date(tracker.date);
  const isCountUp = tracker.type === 'countup';
  
  div.innerHTML = `
    <div class="tracker-header">
      <span class="tracker-icon">${icon}</span>
      <span class="tracker-name">${name}</span>
      ${tracker.url ? '<span style="font-size: 0.75rem; opacity: 0.7; margin-left: 0.5rem;">🔗</span>' : ''}
    </div>
    <div class="tracker-display" data-target="${targetDate.getTime()}" data-type="${tracker.type}">
      <div class="tracker-time">
        <span class="tracker-value">--</span>
      </div>
    </div>
  `;
  
  return div;
}

function updateAllTrackers() {
  const trackerDisplays = document.querySelectorAll('.tracker-display');
  const now = new Date().getTime();
  
  trackerDisplays.forEach(display => {
    const targetTime = parseInt(display.dataset.target);
    const isCountUp = display.dataset.type === 'countup';
    const diff = isCountUp ? (now - targetTime) : (targetTime - now);
    
    if (diff < 0 && !isCountUp) {
      // Countdown has passed
      display.querySelector('.tracker-value').textContent = 'Time passed';
      display.parentElement.classList.add('tracker-expired');
      return;
    }
    
    const time = calculateTimeDifference(Math.abs(diff));
    const timeString = formatTimeString(time, isCountUp);
    display.querySelector('.tracker-value').textContent = timeString;
  });
}

function calculateTimeDifference(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  return {
    years,
    months: months % 12,
    weeks: weeks % 4,
    days: days % 7,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
    totalDays: days,
    totalHours: hours,
    totalMinutes: minutes
  };
}

function formatTimeString(time, isCountUp) {
  const parts = [];
  
  if (time.years > 0) {
    parts.push(`${time.years}y`);
  }
  if (time.months > 0) {
    parts.push(`${time.months}mo`);
  }
  if (time.weeks > 0) {
    parts.push(`${time.weeks}w`);
  }
  if (time.days > 0) {
    parts.push(`${time.days}d`);
  }
  if (time.hours > 0 && parts.length < 3) {
    parts.push(`${time.hours}h`);
  }
  if (time.minutes > 0 && parts.length < 3) {
    parts.push(`${time.minutes}m`);
  }
  if (parts.length === 0 || (time.seconds > 0 && parts.length < 3)) {
    parts.push(`${time.seconds}s`);
  }
  
  return parts.slice(0, 3).join(' ');
}

// Update trackers every second
setInterval(() => {
  updateAllTrackers();
}, 1000);

// Todoist Integration
function initializeTodoist() {
  loadTodoistTasks();
  
  // Refresh button
  const refreshBtn = document.getElementById('refreshTodoistBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadTodoistTasks();
    });
  }
}

async function loadTodoistTasks() {
  const todoistContent = document.getElementById('todoistContent');
  
  chrome.storage.sync.get(['todoistApiKey'], async (result) => {
    if (!result.todoistApiKey) {
      todoistContent.innerHTML = '<div class="todoist-loading">Configure Todoist API key in settings</div>';
      return;
    }
    
    try {
      todoistContent.innerHTML = '<div class="todoist-loading">Loading tasks...</div>';
      
      // Get today's tasks from Todoist API
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`https://api.todoist.com/rest/v2/tasks`, {
        headers: {
          'Authorization': `Bearer ${result.todoistApiKey}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API token');
        } else {
          throw new Error(`API error: ${response.status}`);
        }
      }
      
      const allTasks = await response.json();
      
      // Filter for today's tasks (only incomplete tasks with due dates)
      const todayTasks = allTasks.filter(task => {
        if (task.is_completed) return false; // Skip completed tasks
        if (!task.due || !task.due.date) return false;
        
        // Handle different date formats from Todoist
        const taskDate = new Date(task.due.date);
        const taskDateStr = taskDate.toISOString().split('T')[0];
        return taskDateStr === today;
      });
      
      displayTodoistTasks(todayTasks);
    } catch (error) {
      console.error('Todoist error:', error);
      todoistContent.innerHTML = `<div class="todoist-loading">Error: ${error.message}</div>`;
    }
  });
}

function displayTodoistTasks(tasks) {
  const todoistContent = document.getElementById('todoistContent');
  
  if (tasks.length === 0) {
    todoistContent.innerHTML = '<div class="todoist-empty">No tasks for today! 🎉</div>';
    return;
  }
  
  // Sort by priority (4 is highest, 1 is lowest), then by order
  const sortedTasks = tasks.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return a.order - b.order;
  });
  
  const tasksList = document.createElement('div');
  tasksList.className = 'todoist-tasks-list';
  
  sortedTasks.forEach(task => {
    const taskItem = createTodoistTaskElement(task);
    tasksList.appendChild(taskItem);
  });
  
  todoistContent.innerHTML = '';
  todoistContent.appendChild(tasksList);
}

function createTodoistTaskElement(task) {
  const div = document.createElement('div');
  div.className = 'todoist-task-item';
  
  // Priority indicator
  const priorityClass = task.priority >= 3 ? 'high-priority' : task.priority === 2 ? 'medium-priority' : 'low-priority';
  
  // Check if completed
  if (task.is_completed) {
    div.classList.add('completed');
  }
  
  // Use the URL provided by Todoist API (it's already in the correct format)
  // The API returns: https://app.todoist.com/app/task/{id}
  // Also create app URL scheme for desktop app: todoist://task?id={id}
  const todoistWebUrl = task.url || `https://app.todoist.com/app/task/${task.id}`;
  const todoistAppUrl = `todoist://task?id=${task.id}`;
  
  div.innerHTML = `
    <div class="todoist-task-content">
      <div class="todoist-task-checkbox ${task.is_completed ? 'checked' : ''}" data-task-id="${task.id}">
        ${task.is_completed ? '✓' : ''}
      </div>
      <div class="todoist-task-text ${priorityClass}">
        <span class="task-title">${escapeHtml(task.content)}</span>
        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
        ${task.due ? `<div class="task-due">${formatTodoistDate(task.due.date)}</div>` : ''}
      </div>
    </div>
  `;
  
  // Make the task item clickable to open in Todoist (but not the checkbox)
  div.addEventListener('click', (e) => {
    // Don't open if clicking the checkbox
    if (e.target.closest('.todoist-task-checkbox')) {
      return;
    }
    
    // Try to open in Todoist desktop app first (if installed)
    const appLink = document.createElement('a');
    appLink.href = todoistAppUrl;
    appLink.style.display = 'none';
    document.body.appendChild(appLink);
    appLink.click();
    document.body.removeChild(appLink);
    
    // Fallback to web URL (opens in browser, or redirects to app if installed)
    // Small delay to avoid opening both if app URL works
    setTimeout(() => {
      window.open(todoistWebUrl, '_blank');
    }, 300);
  });
  
  // Add click handler to toggle completion (if API key allows)
  const checkbox = div.querySelector('.todoist-task-checkbox');
  checkbox.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent triggering the div click handler
    toggleTodoistTask(task.id, !task.is_completed);
  });
  
  return div;
}

function formatTodoistDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  
  if (date.getTime() === today.getTime()) {
    return 'Today';
  }
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

async function toggleTodoistTask(taskId, completed) {
  chrome.storage.sync.get(['todoistApiKey'], async (result) => {
    if (!result.todoistApiKey) return;
    
    try {
      const method = completed ? 'close' : 'reopen';
      const response = await fetch(`https://api.todoist.com/rest/v2/tasks/${taskId}/${method}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${result.todoistApiKey}`
        }
      });
      
      if (response.ok) {
        // Reload tasks
        loadTodoistTasks();
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  });
}

// Links
function loadLinks() {
  chrome.storage.sync.get(['links'], (result) => {
    const links = result.links || [];
    const linksGrid = document.getElementById('linksGrid');
    linksGrid.innerHTML = '';
    
    if (links.length === 0) {
      const message = window.isAdmin
        ? '<p style="color: var(--text-secondary); text-align: center; padding: 1rem; grid-column: 1 / -1;">No links yet</p>'
        : '<p style="color: var(--text-secondary); text-align: center; padding: 1rem; grid-column: 1 / -1;">No links yet. Admin can add links in settings.</p>';
      linksGrid.innerHTML = message;
      return;
    }
    
    links.forEach((link, index) => {
      const linkEl = createLinkElement(link, index);
      linksGrid.appendChild(linkEl);
    });
  });
}

function createLinkElement(link, index) {
  // Handle both old format (single URL) and new format (array of URLs)
  const urls = link.urls || (link.url ? [link.url] : []);
  
  if (urls.length === 0) {
    // No URLs, return a disabled element
    const div = document.createElement('div');
    div.className = 'link-item';
    div.style.opacity = '0.5';
    div.style.cursor = 'not-allowed';
    
    const icon = link.icon || (link.name ? link.name.charAt(0).toUpperCase() : '🔗');
    div.innerHTML = `
      <div class="link-icon">${icon}</div>
      <div class="link-name">${escapeHtml(link.name)}</div>
    `;
    return div;
  }
  
  const a = document.createElement('a');
  a.className = 'link-item';
  
  // If multiple URLs, handle click to open all
  if (urls.length > 1) {
    a.href = '#';
    a.addEventListener('click', (e) => {
      e.preventDefault();
      // Open all URLs in new tabs
      urls.forEach((url, urlIndex) => {
        chrome.tabs.create({ 
          url: url, 
          active: urlIndex === urls.length - 1 // Activate the last tab
        });
      });
    });
  } else {
    // Single URL - normal link behavior
    a.href = urls[0];
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  
  // Use emoji icon if provided, otherwise use first letter of link name
  const icon = link.icon || (link.name ? link.name.charAt(0).toUpperCase() : '🔗');
  
  a.innerHTML = `
    <div class="link-icon">${icon}</div>
    <div class="link-name">${escapeHtml(link.name)}${urls.length > 1 ? ' <small style="opacity: 0.7; font-size: 0.7em;">(' + urls.length + ' tabs)</small>' : ''}</div>
  `;
  
  return a;
}

// Notes
function loadNotes() {
  chrome.storage.sync.get(['notes'], (result) => {
    const notes = result.notes || [];
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';
    
    if (notes.length === 0) {
      const message = window.isAdmin
        ? '<p style="color: var(--text-secondary); text-align: center; padding: 1rem;">No notes yet</p>'
        : '<p style="color: var(--text-secondary); text-align: center; padding: 1rem;">No notes yet. Admin can add notes in settings.</p>';
      notesList.innerHTML = message;
      return;
    }
    
    notes.forEach((note, index) => {
      const noteEl = createNoteElement(note, index);
      notesList.appendChild(noteEl);
    });
  });
}

function createNoteElement(note, index) {
  const div = document.createElement('div');
  div.className = 'note-item';
  
  // Make clickable if URL is provided
  if (note.url) {
    div.style.cursor = 'pointer';
    div.addEventListener('click', () => {
      window.open(note.url, '_blank', 'noopener,noreferrer');
    });
  }
  
  div.innerHTML = `
    <div class="note-title">
      ${escapeHtml(note.title)}
      ${note.url ? '<span style="font-size: 0.75rem; opacity: 0.7; margin-left: 0.5rem;">🔗</span>' : ''}
    </div>
    <div class="note-content">${escapeHtml(note.content)}</div>
  `;
  
  return div;
}



// Modals
function initializeModals() {
  // All modals removed - CRUD is now in Settings page
  // Close modals when clicking outside (if any remain)
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('active');
    }
  });
}

// Settings
function initializeSettings() {
  document.getElementById('settingsBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
}

// Keyboard shortcuts

function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K: Open settings
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      chrome.runtime.openOptionsPage();
    }
    
    // Escape: Close modals
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal.active');
      if (activeModal) {
        activeModal.classList.remove('active');
      }
    }
    
    // No quick add shortcuts - all CRUD is in Settings page
  });
}

// Utility function
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}



