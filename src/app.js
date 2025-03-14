// src/app.js
// Main application entry point

import StatusBar from './components/StatusBar.js';
import EggTray from './components/EggTray.js';

class App {
  constructor() {
    // Initialize components
    this.initializeStatusBar();
    this.initializeEggTray();
    this.loadStyles();
  }

  initializeStatusBar() {
    // Create status bar container
    const statusBarContainer = document.createElement('div');
    statusBarContainer.id = 'status-bar';
    document.body.insertBefore(statusBarContainer, document.body.firstChild);

    // Initialize status bar
    this.statusBar = new StatusBar('status-bar');
  }

  initializeEggTray() {
    // Create egg tray container if it doesn't exist
    let trayContainer = document.getElementById('egg-tray');
    if (!trayContainer) {
      trayContainer = document.createElement('div');
      trayContainer.id = 'egg-tray';
      trayContainer.className = 'egg-tray';
      document.body.appendChild(trayContainer);
    }

    // Initialize egg tray
    this.eggTray = new EggTray('egg-tray');
  }

  loadStyles() {
    // Load status bar styles
    const statusBarStyles = document.createElement('link');
    statusBarStyles.rel = 'stylesheet';
    statusBarStyles.href = '/src/styles/status-bar.css';
    document.head.appendChild(statusBarStyles);

    // Load egg tray styles
    const eggTrayStyles = document.createElement('link');
    eggTrayStyles.rel = 'stylesheet';
    eggTrayStyles.href = '/src/styles/egg-tray.css';
    document.head.appendChild(eggTrayStyles);
  }

  // Method to update account name
  setAccount(name) {
    if (this.statusBar) {
      this.statusBar.setAccount(name);
    }
  }

  // Method to add an egg to the tray
  addEgg(egg) {
    if (this.eggTray) {
      this.eggTray.addEgg(egg);
    }
  }
}

// Create and export app instance
const app = new App();
export default app;