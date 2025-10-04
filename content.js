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
const currentWebsite = window.location.href;
message.textContent = currentWebsite;
message.style.cssText = `
  margin: 0 0 1rem 0;
  color: #333;
`;

async function askGeminiWaterUsage(websiteUrl) {
    const apiKey = "AIzaSyB68HjgeGD9suByT4ujxzLo5r3qUqtfrKg"; // I did replace with my actual API key
    const endpoint = "https://api.gemini.com/v1/ask"; // example endpoint; replace with actual

    const prompt = `Estimate the amount of water used to run the website: ${websiteUrl}. Provide in liters per visit. Provide only an amount nothing else. Provide only 1 sigle number between 1-10. No letters at all. No words at all. Where 1 is next to zero and 10 is chat gpt levels. Please only a number. NO LETTERS OR WORDS.`;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        console.log("Gemini answer:", answer);
        return answer;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Error";
    }
}
// Run automatically
askGeminiWaterUsage(window.location.href);
// Example usage:
const websiteUrl = window.location.href;
askGeminiWaterUsage(websiteUrl).then(answer => {
    console.log("Gemini says:", answer);
});





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

