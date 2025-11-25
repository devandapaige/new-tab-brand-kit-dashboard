// Brand Kit Dashboard - New Tab Script

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  loadBrandSettings();
  initializeDateTime();
  initializeGreeting();
  checkAdminStatus();
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
  });
});

// Check admin status and update UI accordingly
function checkAdminStatus() {
  chrome.storage.sync.get(['adminPassword', 'adminUnlocked'], (result) => {
    const hasPassword = !!result.adminPassword;
    const isUnlocked = hasPassword ? (result.adminUnlocked === true) : true;
    
    // Show/hide add buttons
    const addButtons = ['addLinkBtn', 'addNoteBtn', 'addTrackerBtn'];
    addButtons.forEach(btnId => {
      const btn = document.getElementById(btnId);
      if (btn) {
        if (isUnlocked) {
          btn.style.display = 'inline-block';
        } else {
          btn.style.display = 'none';
        }
      }
    });
    
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
      'backgroundImage',
      'userName'
    ]);

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
    
    if (result.backgroundImage) {
      document.getElementById('backgroundImage').style.backgroundImage = `url(${result.backgroundImage})`;
    }
    
    if (result.userName) {
      document.getElementById('userName').textContent = result.userName;
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
  
  updateDateTime();
  setInterval(updateDateTime, 60000); // Update every minute
}

// Initialize greeting
function initializeGreeting() {
  const greetingEl = document.getElementById('greetingText');
  const hour = new Date().getHours();
  
  if (hour < 12) {
    greetingEl.textContent = 'Good morning';
  } else if (hour < 18) {
    greetingEl.textContent = 'Good afternoon';
  } else {
    greetingEl.textContent = 'Good evening';
  }
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
  
  const icon = tracker.icon || '⏰';
  const name = tracker.name || 'Tracker';
  const targetDate = new Date(tracker.date);
  const isCountUp = tracker.type === 'countup';
  
  div.innerHTML = `
    <div class="tracker-header">
      <span class="tracker-icon">${icon}</span>
      <span class="tracker-name">${name}</span>
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
  const a = document.createElement('a');
  a.className = 'link-item';
  a.href = link.url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  
  // Use emoji icon if provided, otherwise use first letter of link name
  const icon = link.icon || (link.name ? link.name.charAt(0).toUpperCase() : '🔗');
  
  a.innerHTML = `
    <div class="link-icon">${icon}</div>
    <div class="link-name">${escapeHtml(link.name)}</div>
  `;
  
  if (window.isAdmin) {
    a.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (confirm('Delete this link?')) {
        deleteLink(index);
      }
    });
  }
  
  return a;
}

function deleteLink(index) {
  chrome.storage.sync.get(['links'], (result) => {
    const links = result.links || [];
    links.splice(index, 1);
    chrome.storage.sync.set({ links }, () => {
      loadLinks();
    });
  });
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
  
  div.innerHTML = `
    <div class="note-title">${escapeHtml(note.title)}</div>
    <div class="note-content">${escapeHtml(note.content)}</div>
  `;
  
  if (window.isAdmin) {
    div.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (confirm('Delete this note?')) {
        deleteNote(index);
      }
    });
  }
  
  return div;
}

function deleteNote(index) {
  chrome.storage.sync.get(['notes'], (result) => {
    const notes = result.notes || [];
    notes.splice(index, 1);
    chrome.storage.sync.set({ notes }, () => {
      loadNotes();
    });
  });
}



// Modals
function initializeModals() {
  // Link Modal
  const linkModal = document.getElementById('linkModal');
  const addLinkBtn = document.getElementById('addLinkBtn');
  const closeLinkModal = document.getElementById('closeLinkModal');
  const linkForm = document.getElementById('linkForm');
  
  addLinkBtn.addEventListener('click', () => {
    if (!window.isAdmin) {
      alert('Only administrators can add links. Please unlock settings to add links.');
      return;
    }
    linkModal.classList.add('active');
  });
  
  closeLinkModal.addEventListener('click', () => {
    linkModal.classList.remove('active');
  });
  
  linkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!window.isAdmin) {
      alert('Only administrators can add links.');
      return;
    }
    
    const name = document.getElementById('linkName').value;
    let url = document.getElementById('linkUrl').value;
    const icon = document.getElementById('linkIcon').value.trim();
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    chrome.storage.sync.get(['links'], (result) => {
      const links = result.links || [];
      // Store icon only if provided, otherwise it will default to first letter of name
      const linkData = { name, url };
      if (icon) {
        linkData.icon = icon;
      }
      links.push(linkData);
      chrome.storage.sync.set({ links }, () => {
        loadLinks();
        linkModal.classList.remove('active');
        linkForm.reset();
      });
    });
  });
  
  // Note Modal
  const noteModal = document.getElementById('noteModal');
  const addNoteBtn = document.getElementById('addNoteBtn');
  const closeNoteModal = document.getElementById('closeNoteModal');
  const noteForm = document.getElementById('noteForm');
  
  addNoteBtn.addEventListener('click', () => {
    if (!window.isAdmin) {
      alert('Only administrators can add notes. Please unlock settings to add notes.');
      return;
    }
    noteModal.classList.add('active');
  });
  
  closeNoteModal.addEventListener('click', () => {
    noteModal.classList.remove('active');
  });
  
  noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!window.isAdmin) {
      alert('Only administrators can add notes.');
      return;
    }
    
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
    
    chrome.storage.sync.get(['notes'], (result) => {
      const notes = result.notes || [];
      notes.push({ title, content });
      chrome.storage.sync.set({ notes }, () => {
        loadNotes();
        noteModal.classList.remove('active');
        noteForm.reset();
      });
    });
  });
  
  // Tracker Modal
  const trackerModal = document.getElementById('trackerModal');
  const addTrackerBtn = document.getElementById('addTrackerBtn');
  const closeTrackerModal = document.getElementById('closeTrackerModal');
  const trackerForm = document.getElementById('trackerForm');
  
  if (addTrackerBtn) {
    addTrackerBtn.addEventListener('click', () => {
      if (!window.isAdmin) {
        alert('Only administrators can add trackers. Please unlock settings to add trackers.');
        return;
      }
      openTrackerModal();
    });
  }
  
  if (closeTrackerModal) {
    closeTrackerModal.addEventListener('click', () => {
      trackerModal.classList.remove('active');
    });
  }
  
  if (trackerForm) {
    trackerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!window.isAdmin) {
        alert('Only administrators can add trackers.');
        return;
      }
      saveTracker();
    });
  }
  
  // Populate date dropdowns for tracker modal
  populateTrackerDateDropdowns();
  
  // Update day dropdown when month/year changes
  const trackerMonth = document.getElementById('trackerMonth');
  const trackerYear = document.getElementById('trackerYear');
  if (trackerMonth) {
    trackerMonth.addEventListener('change', updateTrackerDayDropdown);
  }
  if (trackerYear) {
    trackerYear.addEventListener('change', updateTrackerDayDropdown);
  }
  
  // Icon picker for tracker modal
  const trackerIconPickerBtn = document.getElementById('trackerIconPickerBtn');
  const trackerIconGrid = document.getElementById('trackerIconGrid');
  if (trackerIconPickerBtn && trackerIconGrid) {
    trackerIconPickerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      trackerIconGrid.style.display = trackerIconGrid.style.display === 'none' ? 'grid' : 'none';
    });
    
    trackerIconGrid.querySelectorAll('.icon-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const icon = btn.dataset.icon;
        document.getElementById('trackerSelectedIcon').textContent = icon;
        trackerIconGrid.style.display = 'none';
      });
    });
  }
  
  // Close modals when clicking outside
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
// Tracker Modal Functions
function openTrackerModal() {
  const trackerModal = document.getElementById('trackerModal');
  if (!trackerModal) return;
  
  // Reset form
  const form = document.getElementById('trackerForm');
  if (form) form.reset();
  
  // Set default values
  document.getElementById('trackerType').value = 'countdown';
  document.getElementById('trackerSelectedIcon').textContent = '⏰';
  document.getElementById('trackerPinned').checked = true;
  
  // Set default date to today
  const today = new Date();
  document.getElementById('trackerMonth').value = today.getMonth();
  document.getElementById('trackerYear').value = today.getFullYear();
  updateTrackerDayDropdown();
  document.getElementById('trackerDay').value = today.getDate();
  
  trackerModal.classList.add('active');
  document.getElementById('trackerName').focus();
}

function populateTrackerDateDropdowns() {
  const daySelect = document.getElementById('trackerDay');
  const yearSelect = document.getElementById('trackerYear');
  
  if (!daySelect || !yearSelect) return;
  
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

function updateTrackerDayDropdown() {
  const month = parseInt(document.getElementById('trackerMonth').value);
  const year = parseInt(document.getElementById('trackerYear').value);
  const daySelect = document.getElementById('trackerDay');
  
  if (isNaN(month) || isNaN(year) || !daySelect) {
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

function saveTracker() {
  const name = document.getElementById('trackerName').value.trim();
  const type = document.getElementById('trackerType').value;
  const month = parseInt(document.getElementById('trackerMonth').value);
  const day = parseInt(document.getElementById('trackerDay').value);
  const year = parseInt(document.getElementById('trackerYear').value);
  const time = document.getElementById('trackerTime').value;
  const icon = document.getElementById('trackerSelectedIcon').textContent;
  const pinned = document.getElementById('trackerPinned').checked;
  
  if (!name || isNaN(month) || isNaN(day) || isNaN(year)) {
    alert('Please fill in all required fields');
    return;
  }
  
  // Create date from inputs
  const [hours, minutes] = time.split(':').map(Number);
  const targetDate = new Date(year, month, day, hours || 0, minutes || 0);
  
  chrome.storage.sync.get(['countdowns'], (result) => {
    const countdowns = result.countdowns || [];
    
    const trackerData = {
      id: Date.now().toString(),
      name,
      type,
      date: targetDate.toISOString(),
      icon,
      pinnedToDashboard: pinned
    };
    
    countdowns.push(trackerData);
    
    chrome.storage.sync.set({ countdowns }, () => {
      loadTrackers();
      document.getElementById('trackerModal').classList.remove('active');
      document.getElementById('trackerForm').reset();
    });
  });
}

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
    
    // Quick add shortcuts (when not in input fields and user is admin)
    if (!e.target.matches('input, textarea') && window.isAdmin) {
      // 'l' key: Add link
      if (e.key === 'l' && !e.ctrlKey && !e.metaKey) {
        document.getElementById('addLinkBtn').click();
      }
      // 'n' key: Add note
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey) {
        document.getElementById('addNoteBtn').click();
      }
      // 't' key: Add tracker
      if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
        const addTrackerBtn = document.getElementById('addTrackerBtn');
        if (addTrackerBtn) addTrackerBtn.click();
      }
    }
  });
}

// Utility function
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

