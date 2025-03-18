// script.js - Egg Tray Implementation
document.addEventListener('DOMContentLoaded', function() {
  // Get the egg tray element
  const eggTray = document.getElementById('egg-tray');
  
  // Mock user state - replace with actual auth logic in production
  const userState = {
    isLoggedIn: true,
    username: localStorage.getItem('egg_username') || 'User',
    avatar: localStorage.getItem('egg_avatar') || null
  };
  
  // Mock data - in a real app, this would come from your API
  const activeRequests = [
    {
      type: 'weather',
      data: {
        location: 'KILAUEA, HI',
        condition: 'SUNNY',
        temperature: '72°F'
      }
    },
    {
      type: 'music',
      data: {
        title: 'ALONE',
        artist: 'THE CURE',
        albumArtwork: 'assets/alone-album.svg'
      }
    }
  ];
  
  // Initialize the egg tray with default collapsed state
  function initializeTray() {
    // Add a handle for dragging
    const trayHandle = document.createElement('div');
    trayHandle.className = 'tray-handle';
    
    // Add the handle as the first element
    if (eggTray.firstChild) {
      eggTray.insertBefore(trayHandle, eggTray.firstChild);
    } else {
      eggTray.appendChild(trayHandle);
    }
    
    // Create the content container for scrolling
    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'tray-scroll-container';
    
    // Create HTML structure
    const trayHTML = `
      <div class="frame-7">
        <div class="text-wrapper-6" id="egg-tray-input" contenteditable="true" placeholder="ask for anything"></div>
        
        <div class="more-button-wrapper">
          <div class="icons-mic-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icons-mic">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </div>
        </div>
        
        <button class="div-wrapper">
          <button class="button">
            <div class="text-wrapper-7">send</div>
          </button>
        </button>
      </div>
      
      <div class="frame-8">
        <div class="frame-9">
          ${userState.avatar 
            ? `<img class="image" alt="${userState.username}" src="${userState.avatar}" />` 
            : `<div class="image"></div>`}
          <div class="text-wrapper-8">${userState.username}</div>
        </div>
        
        <div class="rectangle-wrapper">
          <div class="rectangle-6"></div>
        </div>
        
        <div class="frame-9">
          <div class="text-wrapper-9" id="tray-time-display"></div>
          <div class="ellipse" ${!userState.isLoggedIn ? 'style="background-color: #999;"' : ''}></div>
        </div>
      </div>
      
      <div class="frame-10" id="active-eggs-container">
        ${renderActiveEggs(activeRequests)}
      </div>
    `;
    
    // Set the scroll container content
    scrollContainer.innerHTML = trayHTML;
    
    // Append the scroll container to the tray
    eggTray.appendChild(scrollContainer);
    
    // Set the initial state
    setTrayState('collapsed');
    
    // Set proper login state class
    if (!userState.isLoggedIn) {
      eggTray.classList.add('logged-out');
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Update the time display
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 60000);
  }
  
  // Render active eggs (weather, music, etc)
  function renderActiveEggs(requests) {
    if (!requests || requests.length === 0) {
      return `
        <div class="egg-tray-empty-state">
          <div class="empty-state-icon">✨</div>
          <div class="empty-state-title">No active tasks</div>
          <div class="empty-state-text">Ask me anything to get started!</div>
        </div>
      `;
    }
    
    let eggsHTML = '';
    
    requests.forEach(request => {
      if (request.type === 'weather') {
        eggsHTML += `
          <div class="eggs-weather-sunny">
            <div class="frame">
              <div class="frame-2">
                <div class="text-wrapper">${request.data.location}</div>
                <div class="text-wrapper-2">${request.data.condition}</div>
              </div>
              <div class="more-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="6" r="1"></circle>
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="18" r="1"></circle>
                </svg>
              </div>
            </div>
            <div class="frame-3">
              <div class="text-wrapper-3">${request.data.temperature}</div>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icons-sun-instance">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            </div>
          </div>
        `;
      } else if (request.type === 'music') {
        eggsHTML += `
          <div class="eggs-music">
            <div class="overlap-group">
              <div class="frame">
                <div class="frame-2">
                  <div class="text-wrapper">${request.data.title}</div>
                  <div class="text-wrapper-2">${request.data.artist}</div>
                </div>
                <div class="more-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="6" r="1"></circle>
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="18" r="1"></circle>
                  </svg>
                </div>
              </div>
              <div class="frame-3">
                <img class="album-artwork" alt="Album artwork" src="${request.data.albumArtwork}">
                <div class="timeline">
                  <div class="rectangle-5"></div>
                </div>
                <div class="pause-button">
                  <div class="pause-icon">
                    <div class="pause-bar"></div>
                    <div class="pause-bar"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      }
      // Add other types of eggs here as needed
    });
    
    return eggsHTML;
  }
  
  // Set up event listeners
  function setupEventListeners() {
    const trayHandle = document.querySelector('.tray-handle');
    const eggTrayInput = document.getElementById('egg-tray-input');
    const micButton = document.querySelector('.icons-mic-wrapper');
    const sendButton = document.querySelector('.div-wrapper');
    
    // Handle drag interaction
    let initialY, currentState;
    
    trayHandle.addEventListener('mousedown', startDrag);
    trayHandle.addEventListener('touchstart', startDrag, { passive: true });
    
    function startDrag(e) {
      initialY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
      currentState = eggTray.classList.contains('collapsed') ? 'collapsed' : 'expanded';
      
      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag, { passive: false });
      document.addEventListener('mouseup', endDrag);
      document.addEventListener('touchend', endDrag);
      
      trayHandle.style.cursor = 'grabbing';
    }
    
    function drag(e) {
      e.preventDefault();
      const currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
      const deltaY = currentY - initialY;
      
      if (currentState === 'collapsed' && deltaY < -20) {
        setTrayState('expanded');
      } else if (currentState === 'expanded' && deltaY > 20) {
        setTrayState('collapsed');
      }
    }
    
    function endDrag() {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchend', endDrag);
      trayHandle.style.cursor = 'grab';
    }
    
    // Toggle tray on click on handle
    trayHandle.addEventListener('click', () => {
      toggleTrayState();
    });
    
    // Input field focus/blur events
    if (eggTrayInput) {
      // Handle contenteditable placeholder
      eggTrayInput.addEventListener('focus', function() {
        if (this.textContent.trim() === '') {
          this.textContent = '';
          this.classList.add('user-typing');
        }
        // Expand tray when input is focused
        setTrayState('expanded');
      });
      
      eggTrayInput.addEventListener('blur', function() {
        if (this.textContent.trim() === '') {
          this.textContent = '';
          this.classList.remove('user-typing');
        }
      });
      
      eggTrayInput.addEventListener('input', function() {
        if (this.textContent.trim() !== '') {
          this.classList.add('user-typing');
        } else {
          this.classList.remove('user-typing');
        }
      });
      
      // Handle send on Enter (but allow Shift+Enter for new line)
      eggTrayInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
    }
    
    // Mic button
    if (micButton) {
      micButton.addEventListener('click', () => {
        // Handle voice input - in production, would integrate with a voice API
        console.log('Voice input requested');
        setTrayState('expanded');
        alert('Voice input activated! (This is a placeholder)');
      });
    }
    
    // Send button
    if (sendButton) {
      sendButton.addEventListener('click', sendMessage);
    }
  }
  
  // Toggle between collapsed and expanded states
  function toggleTrayState() {
    if (eggTray.classList.contains('collapsed')) {
      setTrayState('expanded');
    } else {
      setTrayState('collapsed');
    }
  }
  
  // Set the tray state explicitly
  function setTrayState(state) {
    if (state === 'collapsed') {
      eggTray.classList.add('collapsed');
      eggTray.classList.remove('expanded');
    } else {
      eggTray.classList.remove('collapsed');
      eggTray.classList.add('expanded');
    }
  }
  
  // Function to send a message
  function sendMessage() {
    const inputElement = document.getElementById('egg-tray-input');
    if (!inputElement) return;
    
    const message = inputElement.textContent.trim();
    if (message) {
      console.log('Sending message:', message);
      
      // Here you would normally process the message and get a response
      // For demo, we'll just clear the input
      inputElement.textContent = '';
      inputElement.classList.remove('user-typing');
      
      // Make sure the tray stays expanded
      setTrayState('expanded');
      
      // In a real app, you'd add the response to active requests
      // and update the eggs container
    }
  }
  
  // Update the time display
  function updateTimeDisplay() {
    const timeDisplay = document.getElementById('tray-time-display');
    if (timeDisplay) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      timeDisplay.textContent = timeString;
    }
  }
  
  // Initialize the tray when the page loads
  initializeTray();
});