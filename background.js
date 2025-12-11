// Brand Kit Dashboard - Background Service Worker

// Install/Update handler
chrome.runtime.onInstalled.addListener(() => {
  
  // Set default settings if not already set
  chrome.storage.sync.get(['primaryColor'], (result) => {
    // Handle Firefox case where result might be undefined
    if (!result) {
      result = {};
    }
    
    if (!result.primaryColor) {
      chrome.storage.sync.set({
        primaryColor: '#4A90E2',
        secondaryColor: '#50C878',
        accentColor: '#FF6B6B',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        cardBackground: 'rgba(255, 255, 255, 0.95)',
        textPrimary: '#1E293B',
        textSecondary: '#64748B',
        userName: 'Team',
        links: [],
        notes: []
      }, () => {
        // Check for errors in Firefox
        if (chrome.runtime.lastError) {
          console.error('Error setting default settings:', chrome.runtime.lastError);
        } else {
        }
      });
    }
  });
});

