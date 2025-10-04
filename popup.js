document.addEventListener('DOMContentLoaded', async function() {
  const duckImage = document.getElementById('duck-image');
  const healthValue = document.getElementById('health-value');
  const healthFill = document.getElementById('health-fill');
  const healBtn = document.getElementById('heal-btn');
  const resetBtn = document.getElementById('reset-btn');

  // Load current duck health
  const result = await chrome.storage.local.get(['duckHealth']);
  let currentHealth = result.duckHealth || 8;
  updateDuckDisplay(currentHealth);

  // Heal button
  healBtn.addEventListener('click', async function() {
    if (currentHealth < 8) {
      currentHealth++;
      await chrome.storage.local.set({ duckHealth: currentHealth });
      updateDuckDisplay(currentHealth);
    }
  });

  // Reset button
  resetBtn.addEventListener('click', async function() {
    currentHealth = 8;
    await chrome.storage.local.set({ duckHealth: currentHealth });
    updateDuckDisplay(currentHealth);
  });

  function updateDuckDisplay(health) {
    health = Math.max(0, Math.min(8, health)); // Clamp between 0-8
    healthValue.textContent = health;
    const percentage = (health / 8) * 100;
    healthFill.style.width = percentage + '%';
    
    // Update health fill color
    if (health <= 2) {
      healthFill.style.backgroundColor = '#f44336';
    } else if (health <= 4) {
      healthFill.style.backgroundColor = '#ff9800';
    } else {
      healthFill.style.backgroundColor = '#4CAF50';
    }
    
    // Update duck image
    duckImage.src = `images/duck${health}.png`;
  }
});