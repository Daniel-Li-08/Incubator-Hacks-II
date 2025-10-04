document.addEventListener('DOMContentLoaded', function() {
  const actionSelect = document.getElementById('actionSelect');
  const blockBtn = document.getElementById('blockBtn');
  const quickBlock = document.getElementById('quickBlock');
  const autoClose = document.getElementById('autoClose');

  // Load saved settings
  chrome.storage.local.get(['autoClosePopup'], function(result) {
    autoClose.checked = result.autoClosePopup || false;
  });

  // Action dropdown handler
  actionSelect.addEventListener('change', function() {
    const action = this.value;
    
    switch(action) {
      case 'block':
        blockCurrentPage();
        break;
      case 'unblock':
        removeBlock();
        break;
      case 'settings':
        showSettings();
        break;
    }
    
    // Reset dropdown
    this.value = '';
  });

  // Block button handler
  blockBtn.addEventListener('click', blockCurrentPage);

  // Quick block button handler
  quickBlock.addEventListener('click', function() {
    blockCurrentPage();
    window.close(); // Close the popup immediately
  });

  // Auto-close setting
  autoClose.addEventListener('change', function() {
    chrome.storage.local.set({autoClosePopup: this.checked});
  });

  function blockCurrentPage() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: injectBlocker
      });
      
      if (autoClose.checked) {
        setTimeout(() => window.close(), 100);
      }
    });
  }

  function removeBlock() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: removeBlocker
      });
    });
  }

  function showSettings() {
    // You can expand this to show more settings
    alert('Settings: Auto-close popup is ' + (autoClose.checked ? 'enabled' : 'disabled'));
  }
});

// These functions will be injected into the page
function injectBlocker() {
  // Remove any existing blocker first
  removeBlocker();
  
  const overlay = document.createElement('div');
  overlay.id = 'website-blocker-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999999;
    font-family: Arial, sans-serif;
  `;

  const popup = document.createElement('div');
  popup.style.cssText = `
    background: white;
    padding: 2rem;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 0 30px rgba(0,0,0,0.5);
    max-width: 400px;
    width: 90%;
  `;

  const message = document.createElement('h2');
  message.textContent = 'Are you sure you want to continue?';
  message.style.cssText = `
    margin: 0 0 1.5rem 0;
    color: #333;
    font-size: 1.5rem;
  `;

  const button = document.createElement('button');
  button.textContent = 'Yes, Continue to Website';
  button.style.cssText = `
    background: #4CAF50;
    color: white;
    border: none;
    padding: 12px 24px;
    font-size: 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s;
  `;

  button.addEventListener('mouseenter', () => {
    button.style.background = '#45a049';
  });

  button.addEventListener('mouseleave', () => {
    button.style.background = '#4CAF50';
  });

  button.addEventListener('click', () => {
    document.body.removeChild(overlay);
  });

  popup.appendChild(message);
  popup.appendChild(button);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // Focus the button for accessibility
  button.focus();
}

function removeBlocker() {
  const existingOverlay = document.getElementById('website-blocker-overlay');
  if (existingOverlay) {
    document.body.removeChild(existingOverlay);
  }
}