// Updated EggTray.js based on Figma design
class EggTray {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.isExpanded = false;
    this.eggs = [];
    this.userName = 'Guest User';
    this.userAvatar = '';
    
    if (!this.container) {
      console.error(`Container with ID ${containerId} not found`);
      return;
    }
    
    this.init();
  }
  
  async init() {
    try {
      // Load the template
      const templateResponse = await fetch('/src/templates/egg-tray.html');
      if (!templateResponse.ok) {
        throw new Error(`Failed to load template: ${templateResponse.status}`);
      }
      
      const templateHtml = await templateResponse.text();
      this.container.innerHTML = templateHtml;
      
      // Set up elements and event handlers
      this.setupElements();
      this.setupEventHandlers();
      this.updateClock();
      
      // Start the clock update interval
      this.clockInterval = setInterval(() => this.updateClock(), 60000);
      
      // Set initial state
      this.setUserInfo(this.userName, this.userAvatar);
    } catch (error) {
      console.error('Error initializing EggTray:', error);
    }
  }
  
  setupElements() {
    // Get references to important elements
    this.trayContainer = this.container.querySelector('.egg-tray-container');
    this.textInput = this.container.querySelector('#egg-tray-text-input');
    this.sendButton = this.container.querySelector('.send-button');
    this.micButton = this.container.querySelector('.mic-button');
    this.dragHandle = this.container.querySelector('#drag-handle');
    this.userNameElement = this.container.querySelector('#user-name');
    this.userAvatarElement = this.container.querySelector('#user-avatar');
    this.timeElement = this.container.querySelector('#current-time');
    this.eggItemsContainer = this.container.querySelector('#egg-tray-items');
  }
  
  setupEventHandlers() {
    // Send button
    this.sendButton.addEventListener('click', () => {
      this.handleSend();
    });
    
    // Mic button
    this.micButton.addEventListener('click', () => {
      this.handleMic();
    });
    
    // Text input - handle Enter key
    this.textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });
    
    // Drag handle for expand/collapse
    this.dragHandle.addEventListener('click', () => {
      this.toggleExpand();
    });
    
    // Make drag handle draggable
    this.dragHandle.addEventListener('mousedown', (e) => {
      this.handleDragStart(e);
    });
  }
  
  handleDragStart(e) {
    const startY = e.clientY;
    const initialState = this.isExpanded;
    
    const handleDragMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startY;
      
      // Threshold for expand/collapse
      if (Math.abs(deltaY) > 50) {
        if (deltaY < 0 && !this.isExpanded) {
          this.expand();
        } else if (deltaY > 0 && this.isExpanded) {
          this.collapse();
        }
      }
    };
    
    const handleDragEnd = () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
    
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  }
  
  toggleExpand() {
    if (this.isExpanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }
  
  expand() {
    this.trayContainer.classList.add('expanded');
    this.isExpanded = true;
  }
  
  collapse() {
    this.trayContainer.classList.remove('expanded');
    this.isExpanded = false;
  }
  
  handleSend() {
    const text = this.textInput.value.trim();
    if (!text) return;
    
    // Emit a custom event that can be listened to from outside
    const event = new CustomEvent('egg-tray:message', {
      detail: { text, source: 'text' }
    });
    document.dispatchEvent(event);
    
    // Clear the input
    this.textInput.value = '';
  }
  
  handleMic() {
    // Emit a custom event for voice input
    const event = new CustomEvent('egg-tray:voice-input');
    document.dispatchEvent(event);
  }
  
  updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const displayHours = hours % 12 || 12; // Convert to 12-hour format
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    this.timeElement.textContent = `${displayHours}:${displayMinutes} ${ampm}`;
  }
  
  setUserInfo(name, avatarUrl) {
    this.userName = name || 'Guest User';
    this.userAvatar = avatarUrl || '';
    
    if (this.userNameElement) {
      this.userNameElement.textContent = this.userName;
    }
    
    if (this.userAvatarElement) {
      if (this.userAvatar) {
        this.userAvatarElement.src = this.userAvatar;
        this.userAvatarElement.style.display = 'block';
      } else {
        this.userAvatarElement.style.display = 'none';
      }
    }
  }
  
  // Add a weather egg widget
  addWeatherEgg(data) {
    const { location, condition, temperature } = data;
    
    const weatherEgg = document.createElement('div');
    weatherEgg.className = 'eggs-weather-sunny';
    weatherEgg.innerHTML = `
      <div class="weather-header">
        <div class="weather-info">
          <div class="location">${location.toUpperCase()}</div>
          <div class="condition">${condition.toUpperCase()}</div>
        </div>
        <div class="more-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        </div>
      </div>
      <div class="weather-details">
        <div class="temperature">${temperature}° F</div>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
    `;
    
    if (this.eggItemsContainer) {
      this.eggItemsContainer.appendChild(weatherEgg);
      this.eggs.push({ type: 'weather', element: weatherEgg, data });
    }
    
    return weatherEgg;
  }
  
  // Add a music egg widget
  addMusicEgg(data) {
    const { title, artist, albumArt, isPlaying } = data;
    
    const musicEgg = document.createElement('div');
    musicEgg.className = 'eggs-music';
    musicEgg.innerHTML = `
      <div class="music-content">
        <div class="music-header">
          <div class="track-info">
            <div class="track-title">${title.toUpperCase()}</div>
            <div class="artist-name">${artist.toUpperCase()}</div>
          </div>
          <div class="more-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </div>
        </div>
        <div class="music-controls">
          <img class="album-artwork" src="${albumArt}" alt="${title} by ${artist}">
          <div class="timeline">
            <div class="progress"></div>
          </div>
          <div class="play-button">
            ${isPlaying ? 
              `<div class="pause-icon"><span class="pause-bar"></span><span class="pause-bar"></span></div>` : 
              `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`
            }
          </div>
        </div>
      </div>
    `;
    
    if (this.eggItemsContainer) {
      this.eggItemsContainer.appendChild(musicEgg);
      this.eggs.push({ type: 'music', element: musicEgg, data });
      
      // Add play/pause functionality
      const playButton = musicEgg.querySelector('.play-button');
      playButton.addEventListener('click', () => {
        this.togglePlayState(musicEgg, data);
      });
    }
    
    return musicEgg;
  }
  
  togglePlayState(musicEgg, data) {
    data.isPlaying = !data.isPlaying;
    
    const playButton = musicEgg.querySelector('.play-button');
    playButton.innerHTML = data.isPlaying ? 
      `<div class="pause-icon"><span class="pause-bar"></span><span class="pause-bar"></span></div>` : 
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
    
    // Emit custom event for play/pause
    const event = new CustomEvent('egg-tray:music-playback', {
      detail: { 
        id: data.id, 
        isPlaying: data.isPlaying,
        title: data.title,
        artist: data.artist
      }
    });
    document.dispatchEvent(event);
  }
  
  // Clear all eggs
  clearEggs() {
    if (this.eggItemsContainer) {
      this.eggItemsContainer.innerHTML = '';
      this.eggs = [];
    }
  }
  
  // Remove a specific egg by reference or index
  removeEgg(eggOrIndex) {
    if (!this.eggItemsContainer) return;
    
    let index;
    if (typeof eggOrIndex === 'number') {
      index = eggOrIndex;
    } else {
      index = this.eggs.findIndex(egg => egg.element === eggOrIndex);
    }
    
    if (index >= 0 && index < this.eggs.length) {
      const egg = this.eggs[index];
      egg.element.remove();
      this.eggs.splice(index, 1);
    }
  }
}

export default EggTray;