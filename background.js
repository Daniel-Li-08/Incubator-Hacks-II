// Initialize duck health and alarm
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['duckHealth'], (result) => {
    if (result.duckHealth === undefined) {
      chrome.storage.local.set({ duckHealth: 8 });
    }
  });
  // Create a repeating alarm for healing every 10 minutes
  chrome.alarms.create('healDuck', { periodInMinutes: 10 });
});

// Also create the alarm if the background script starts up (not just on install)
chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create('healDuck', { periodInMinutes: 10 });
});

// Heal duck when alarm fires
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'healDuck') {
    const result = await chrome.storage.local.get(['duckHealth']);
    let currentHealth = (typeof result.duckHealth === "undefined") ? 8 : result.duckHealth;

    // Only heal if not at full health
    if (currentHealth < 8) {
      currentHealth++;
      await chrome.storage.local.set({ duckHealth: currentHealth });
      updateBadge(currentHealth);
    }
  }
});

// Update badge with current health
function updateBadge(health) {
  let color = '#4CAF50'; // Green
  if (health <= 2) color = '#f44336'; // Red
  else if (health <= 4) color = '#ff9800'; // Orange

  chrome.action.setBadgeBackgroundColor({ color: color });
  chrome.action.setBadgeText({ text: health.toString() });
}

// Initialize badge
chrome.storage.local.get(['duckHealth'], (result) => {
  const currentHealth = (typeof result.duckHealth === "undefined") ? 8 : result.duckHealth;
  updateBadge(currentHealth);
});

// Listen for health changes from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "healthUpdated") {
    updateBadge(request.health);
  }
});