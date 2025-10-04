// Background script for healing over time

const HEAL_INTERVAL = 300000; // 5 minutes in milliseconds

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
  let currentHealth = result.duckHealth || 8;
  
  if (currentHealth < 8) {
    currentHealth++;
    await chrome.storage.local.set({ duckHealth: currentHealth });
    console.log(`Duck healed! Current health: ${currentHealth}/8`);
  }
}, HEAL_INTERVAL);

// Listen for tab updates to trigger popup on monitored sites
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    chrome.tabs.sendMessage(tabId, {
      action: "checkWebsite"
    });
  }
});