// List of websites with predefined water usage (liters per hour)
const WEBSITE_WATER_USAGE = {
  // High usage (300-800+ L/hr)
  'youtube.com': 780,
  'netflix.com': 750,
  'amazon.com': 720,
  'azure.microsoft.com': 700,
  'tiktok.com': 680,
  'twitch.tv': 650,
  'instagram.com': 620,
  'facebook.com': 600,
  'zoom.us': 580,
  'disneyplus.com': 570,
  'hulu.com': 560,
  'spotify.com': 550,
  'icloud.com': 540,
  'pinterest.com': 520,
  'vimeo.com': 510,
  'dailymotion.com': 500,
  'soundcloud.com': 480,
  'dropbox.com': 470,
  'imgur.com': 460,
  'flickr.com': 450,
  'wetransfer.com': 440,
  'cloudflare.com': 420,
  'discord.com': 410,

  // Medium usage (150-300 L/hr)
  'twitter.com': 380,
  'x.com': 380,
  'reddit.com': 370,
  'linkedin.com': 360,
  'web.whatsapp.com': 350,
  'web.telegram.org': 340,
  'weibo.com': 330,
  'qq.com': 320,
  'baidu.com': 310,
  'yandex.com': 300,
  'bing.com': 290,
  'duckduckgo.com': 280,
  'ebay.com': 270,
  'aliexpress.com': 260,
  'walmart.com': 250,
  'target.com': 240,
  'bestbuy.com': 230,
  'homedepot.com': 220,
  'lowes.com': 210,
  'etsy.com': 200,
  'shopify.com': 190,
  'paypal.com': 180,
  'stripe.com': 170,
  'square.com': 160,
  'coinbase.com': 150,
  'binance.com': 140,

  // Medium-low usage (100-150 L/hr)
  'wikipedia.org': 130,
  'wordpress.com': 125,
  'blogger.com': 120,
  'medium.com': 115,
  'quora.com': 110,
  'stackoverflow.com': 105,
};

// Get monitored websites list
const MONITORED_WEBSITES = Object.keys(WEBSITE_WATER_USAGE);

async function checkWebsiteAndShowPopup() {
  const currentUrl = window.location.hostname;
  
  // Check if current website is in our monitored list
  const isMonitored = MONITORED_WEBSITES.some(site => 
    currentUrl.includes(site.replace('www.', ''))
  );

  
  if (!isMonitored) return;

  // Check if we've shown the popup for this site in this session
  const sessionKey = `popupShown_${currentUrl}`;
  const popupShown = sessionStorage.getItem(sessionKey);
  
  if (popupShown) return;

  // Get current duck health
  const result = await chrome.storage.local.get(['duckHealth']);
  let currentHealth = (typeof result.duckHealth === "undefined") ? 8 : result.duckHealth;
  // Change Images to Ducks
  if (currentHealth <= 0){
    document.querySelectorAll('img').forEach(img => {
    img.src = chrome.runtime.getURL('images/duck0.png');
    img.srcset = '';
    });
  }
  // Create popup
  createPopup(currentHealth, currentUrl);
  sessionStorage.setItem(sessionKey, 'true');
}

function createPopup(currentHealth, website) {
  const popup = document.createElement('div');
  popup.id = 'eco-duck-popup';
  popup.innerHTML = `
    <div class="popup-overlay">
      <div class="popup-content">
        <h3>Chircuit Alert! </h3>
        <div class="duck-status">
          <img src="${chrome.runtime.getURL(`images/duck${currentHealth}.png`)}" 
               alt="Duck Health: ${currentHealth}/8" width="300">
          <p>Current Health: ${currentHealth}/8</p>
        </div>
        <p>This website (<strong>${website}</strong>) may use significant water resources for data processing.</p>
        <p>Your choice will affect your Chircuit's health!</p>
        <div class="popup-buttons">
          <button id="leave-site" class="btn-safe">Leave Site (Save Chircuit)</button>
          <button id="stay-site" class="btn-risk">Stay (Risk Damage)</button>
        </div>
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #eco-duck-popup {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;
      font-family: Arial, sans-serif;
    }
    .popup-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .popup-content {
      background: white;
      padding: 30px;
      border-radius: 15px;
      text-align: center;
      max-width: 400px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    .duck-status {
      margin: 20px 0;
    }
    .popup-buttons {
      margin-top: 20px;
    }
    .btn-safe, .btn-risk {
      padding: 12px 20px;
      margin: 5px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    .btn-safe {
      background: #4CAF50;
      color: white;
    }
    .btn-safe:hover {
      background: #45a049;
    }
    .btn-risk {
      background: #f44336;
      color: white;
    }
    .btn-risk:hover {
      background: #da190b;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(popup);

  // Add event listeners
  document.getElementById('leave-site').addEventListener('click', () => {
    document.body.removeChild(popup);
    window.history.back(); // Go back to previous page
  });

  document.getElementById('stay-site').addEventListener('click', async () => {
    document.body.removeChild(popup);
    await calculateAndApplyDamage(website);
  });
}

async function calculateAndApplyDamage(website) {
  try {
    // Get water usage from predefined list
    let waterUsage = 100; // default
    
    // Find the matching website in our list
    for (const [site, usage] of Object.entries(WEBSITE_WATER_USAGE)) {
      if (website.includes(site.replace('www.', ''))) {
        waterUsage = usage;
        break;
      }
    }

    // Calculate damage based on water usage
    let damage = 0;
    if (waterUsage > 500) damage = 3;
    else if (waterUsage > 300) damage = 2;
    else if (waterUsage > 100) damage = 1;
    else damage = 0;

    // Apply damage to duck
    const result = await chrome.storage.local.get(['duckHealth']);
    let currentHealth = (typeof result.duckHealth === "undefined") ? 8 : result.duckHealth;
    currentHealth = Math.max(0, currentHealth - damage);
    // Change Images to Ducks
    if (currentHealth <= 0){
      document.querySelectorAll('img').forEach(img => {
      img.src = chrome.runtime.getURL('images/duck0.png');
      img.srcset = '';
      });
    }
    await chrome.storage.local.set({ duckHealth: currentHealth });

    // Notify background script to update badge
    chrome.runtime.sendMessage({
      action: "healthUpdated",
      health: currentHealth
    });

    // Show damage notification
    showDamageNotification(damage, waterUsage, currentHealth);

  } catch (error) {
    console.error('Error calculating damage:', error);
    // Apply minimal damage if anything fails
    const result = await chrome.storage.local.get(['duckHealth']);
    let currentHealth = (typeof result.duckHealth === "undefined") ? 8 : result.duckHealth;
    currentHealth = Math.max(0, currentHealth - 1);
    await chrome.storage.local.set({ duckHealth: currentHealth });
  }
}

function showDamageNotification(damage, waterUsage, currentHealth) {
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 15px;
      border-radius: 8px;
      z-index: 10001;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    ">
      <strong>Chircuit took damage!</strong><br>
      Water usage: ${waterUsage}L/hr<br>
      Damage: -${damage} health<br>
      Current health: ${currentHealth}/8
    </div>
  `;
  
  document.body.appendChild(notification);
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 5000);
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkWebsiteAndShowPopup);
} else {
  checkWebsiteAndShowPopup();
}
setInterval(async () => {
    const result = await chrome.storage.local.get(['duckHealth']);
    const currentHealth = (typeof result.duckHealth === "undefined") ? 8 : result.duckHealth;
    // Change Images to Ducks
    if (currentHealth <= 0){
      document.querySelectorAll('img').forEach(img => {
      img.src = chrome.runtime.getURL('images/duck0.png');
      img.srcset = '';
      });
    }
}, 100);