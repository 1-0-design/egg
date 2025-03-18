// Link to the updated egg tray CSS in index.html
function addUpdatedEggTrayStyles() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/src/styles/updated-egg-tray.css';
  document.head.appendChild(link);
}

// Update script.js to use the new egg tray component
document.addEventListener('DOMContentLoaded', () => {
  // Add the updated egg tray styles
  addUpdatedEggTrayStyles();
  
  // Initialize the App with updated egg tray
  import('./src/updated-app.js').then(module => {
    window.app = module.default;
    
    // Add test eggs right away for demo purposes
    setTimeout(() => {
      window.app.addWeatherEgg();
      window.app.addMusicEgg();
    }, 1000);
  }).catch(err => {
    console.error('Failed to load updated-app.js:', err);
  });

  // DOM Elements for chat interface
  const textarea = document.querySelector('.input-area textarea');
  const sendButton = document.querySelector('.send-button');
  const chatMessages = document.querySelector('.chat-messages');
  
  // Example of adding a message when sending
  if (sendButton && textarea) {
    sendButton.addEventListener('click', () => {
      const message = textarea.value.trim();
      if (!message) return;
      
      // Add user message to chat
      addMessage(message, 'user');
      
      // Check for special commands
      if (message.toLowerCase().includes('weather')) {
        addMessage("Here's the weather for your location.", 'assistant');
        
        // If app is loaded, add a weather egg
        if (window.app) {
          window.app.addWeatherEgg();
        }
      } else if (
        message.toLowerCase().includes('play') || 
        message.toLowerCase().includes('music') || 
        message.toLowerCase().includes('song')
      ) {
        addMessage("I'll play some music for you.", 'assistant');
        
        // If app is loaded, add a music egg
        if (window.app) {
          window.app.addMusicEgg();
        }
      } else {
        // Add generic assistant response
        setTimeout(() => {
          addMessage("I've processed your request: " + message, 'assistant');
        }, 500);
      }
      
      // Clear input
      textarea.value = '';
    });
  }
  
  // Function to add message to chat
  function addMessage(content, sender) {
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = content;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});