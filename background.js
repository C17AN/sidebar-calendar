import { getItems, addItem, getSettings, STORAGE_KEYS } from './utils/storage.js';

async function updateBadge() {
  const items = await getItems();
  // Local time today
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;
  
  const count = items.filter(item => item.date === todayStr).length;

  if (count > 0) {
    chrome.action.setBadgeText({ text: count.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#1a73e8' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

async function scheduleAlarms() {
  // Clear all existing alarms first to avoid duplicates or old settings
  await chrome.alarms.clearAll();

  const items = await getItems();
  const settings = await getSettings();
  const leadMs = settings.leadHours * 60 * 60 * 1000;

  const now = Date.now();

  items.forEach(item => {
    // We assume notification at 09:00 AM on the day (local time)
    const targetDate = new Date(`${item.date}T09:00:00`);
    const triggerTime = targetDate.getTime() - leadMs;

    if (triggerTime > now) {
      chrome.alarms.create(`dday-${item.id}`, {
        when: triggerTime
      });
    }
  });
}

chrome.runtime.onInstalled.addListener(() => {
  scheduleAlarms();
  updateBadge();
  // Allow clicking the icon to open the side panel
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

// Watch for storage changes to reschedule alarms and update badge
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && (changes[STORAGE_KEYS.ITEMS] || changes[STORAGE_KEYS.SETTINGS])) {
    scheduleAlarms();
    updateBadge();
  }
});

// Handle alarm trigger
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name.startsWith('dday-')) {
    const itemId = alarm.name.replace('dday-', '');
    const items = await getItems();
    const item = items.find(i => i.id === itemId);

    if (item) {
      chrome.notifications.create(alarm.name, {
        type: 'basic',
        iconUrl: 'icon128.png',
        title: item.title || 'D-Day Reminder',
        message: `${item.title || 'D-Day'} for ${item.date} is here!`,
        priority: 2
      });
    }
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ADD_DDAY' && request.date) {
    addItem(request.date, request.title || 'D-Day').then(() => {
      sendResponse({ success: true });
      updateBadge();
      
      chrome.notifications.create(`added-${Date.now()}`, {
        type: 'basic',
        iconUrl: 'icon128.png',
        title: 'D-Day Added',
        message: `Saved "${request.title}" for ${request.date}`,
        priority: 1
      });
    });
    return true; 
  }

  if (request.type === 'OPEN_SIDE_PANEL') {
    // Open the side panel for the current window/tab
    if (sender.tab && sender.tab.id) {
      // Chrome 116+ API
      if (chrome.sidePanel && chrome.sidePanel.open) {
        chrome.sidePanel.open({ tabId: sender.tab.id, windowId: sender.tab.windowId });
      } else {
        console.warn('chrome.sidePanel.open API not supported');
      }
    }
  }
});
