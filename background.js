// Background script for healing over time

const HEAL_INTERVAL = 600000; // 5 minutes in milliseconds

// Initialize duck health
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['duckHealth'], (result) => {
    if (result.duckHealth === undefined) {
      chrome.storage.local.set({ duckHealth: 8 });
    }
  });
});

// Heal duck over time
setInterval(async () => {
  const result = await chrome.storage.local.get(['duckHealth']);
  let currentHealth = (typeof result.duckHealth === "undefined") ? 8 : result.duckHealth;
  
  // Only heal if not at full health
  if (currentHealth < 8) {
    currentHealth++;
    await chrome.storage.local.set({ duckHealth: currentHealth });
    
    // Update badge to show health
    updateBadge(currentHealth);
  }
}, HEAL_INTERVAL);

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

// Listen for health changes from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "healthUpdated") {
    updateBadge(request.health);
  }
});