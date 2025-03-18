// Updated app.js to use the new EggTray component
import UpdatedEggTray from './components/UpdatedEggTray.js';

class App {
  constructor() {
    // Initialize the egg tray
    this.initializeEggTray();
    this.setupEventListeners();
  }

  initializeEggTray() {
    // Get or create egg tray container
    let trayContainer = document.getElementById('egg-tray');
    if (!trayContainer) {
      trayContainer = document.createElement('div');
      trayContainer.id = 'egg-tray';
      document.body.appendChild(trayContainer);
    }

    // Initialize egg tray
    this.eggTray = new UpdatedEggTray('egg-tray');
    
    // Add a placeholder avatar for user
    this.eggTray.setUserInfo('Guest User', 'placeholder-favicon.svg');
  }
  
  setupEventListeners() {
    // Listen for message events from the egg tray
    document.addEventListener('egg-tray:message', (e) => {
      this.handleMessage(e.detail.text);
    });
    
    // Listen for voice input events
    document.addEventListener('egg-tray:voice-input', () => {
      this.handleVoiceInput();
    });
    
    // Listen for music playback events
    document.addEventListener('egg-tray:music-playback', (e) => {
      this.handleMusicPlayback(e.detail);
    });
  }
  
  handleMessage(text) {
    console.log('Message received:', text);
    
    // Example: Check for weather or music requests
    if (text.toLowerCase().includes('weather')) {
      this.addWeatherEgg();
    } else if (
      text.toLowerCase().includes('play') || 
      text.toLowerCase().includes('music') || 
      text.toLowerCase().includes('song')
    ) {
      this.addMusicEgg();
    }
    
    // This would normally trigger the chat AI functionality
    // For demo purposes, just log it
  }
  
  handleVoiceInput() {
    console.log('Voice input requested');
    // Implement voice input functionality here
    // For demo purposes, just add a message
    alert('Voice input requested. This feature would activate the microphone.');
  }
  
  handleMusicPlayback(detail) {
    console.log('Music playback changed:', detail);
    // Implement actual music playback functionality here
    // For demo purposes, just log the event
  }
  
  addWeatherEgg() {
    // Add a sample weather egg
    const weatherData = {
      location: 'Kilauea, HI',
      condition: 'Partly Cloudy',
      temperature: 30
    };
    
    return this.eggTray.addWeatherEgg(weatherData);
  }
  
  addMusicEgg() {
    // Add a sample music egg
    const musicData = {
      id: 'music-' + Date.now(),
      title: 'Alone',
      artist: 'The Cure',
      albumArt: 'placeholder-favicon.svg', // Use a placeholder image
      isPlaying: false
    };
    
    return this.eggTray.addMusicEgg(musicData);
  }
  
  // Method to set user information
  setUser(name, avatarUrl) {
    if (this.eggTray) {
      this.eggTray.setUserInfo(name, avatarUrl);
    }
  }
}

// Create and export the app instance
const app = new App();
export default app;