document.addEventListener('DOMContentLoaded', async function() {
  const duckImage = document.getElementById('duck-image');
  const healthValue = document.getElementById('health-value');
  const healthFill = document.getElementById('health-fill');
  const statusMessage = document.getElementById('status-message');

  // Load current duck health
  const result = await chrome.storage.local.get(['duckHealth']);
  let currentHealth = (typeof result.duckHealth === "undefined") ? 8 : result.duckHealth;
  updateDuckDisplay(currentHealth);

  function updateDuckDisplay(health) {
    console.log(health);
    health = Math.max(0, Math.min(8, health)); // Clamp between 0-8
    healthValue.textContent = health;
    const percentage = (health / 8) * 100;
    healthFill.style.width = percentage + '%';
    
    // Update health fill color
    if (health <= 0) {
      healthFill.style.backgroundColor = '#ff0000ff';
      statusMessage.textContent = 'Chircuit is coming for you!';
      statusMessage.style.color = '#ff0000ff';
    }else if (currentHealth <= 2){
      healthFill.style.backgroundColor = '#f44336';
      statusMessage.textContent = 'Chircuit is dangerously thirsty';
      statusMessage.style.color = '#f44336';
    } else if (health <= 6) {
      healthFill.style.backgroundColor = '#ff9800';
      statusMessage.textContent = 'Chircuit is thirsty';
      statusMessage.style.color = '#ff9800';
    } else {
      healthFill.style.backgroundColor = '#4CAF50';
      statusMessage.textContent = 'Chircuit is healthy';
      statusMessage.style.color = '#4CAF50';
    }
    
    // Update duck image
    duckImage.src = `images/duck${health}.png`;
  }

  // Update display every second to show real-time healing
  setInterval(async () => {
    const result = await chrome.storage.local.get(['duckHealth']);
    const currentHealth = (typeof result.duckHealth === "undefined") ? 8 : result.duckHealth;
    updateDuckDisplay(currentHealth);
    // Change Images to Ducks
    if (currentHealth <= 0){
      document.querySelectorAll('img').forEach(img => {
      img.src = chrome.runtime.getURL('images/duck0.png');
      img.srcset = '';
      });
    }
  }, 1000);
});