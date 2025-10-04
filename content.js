// Create overlay element
const overlay = document.createElement('div');
overlay.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
  font-family: Arial, sans-serif;
`;

// Create popup container
const popup = document.createElement('div');
popup.style.cssText = `
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
`;

// Create message
const message = document.createElement('h2');
message.textContent = 'Are you sure?';
message.style.cssText = `
  margin: 0 0 1rem 0;
  color: #333;
`;

// Create confirmation button
const button = document.createElement('button');
button.textContent = 'Yes, Continue';
button.style.cssText = `
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
`;

// Add click event to remove overlay
button.addEventListener('click', () => {
  document.body.removeChild(overlay);
});

// Assemble elements
popup.appendChild(message);
popup.appendChild(button);
overlay.appendChild(popup);

// Prevent keyboard events
overlay.addEventListener('keydown', (e) => {
  e.stopPropagation();
  e.preventDefault();
});

// Add to page
document.body.appendChild(overlay);

// Focus the button for accessibility
button.focus();