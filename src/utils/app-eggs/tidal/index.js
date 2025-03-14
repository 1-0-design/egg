// src/utils/app-eggs/tidal/index.js
// Tidal music player app egg

import TidalPlayerUI from '../../../components/TidalPlayerUI.js';

// Metadata for the app egg
const tidalAppEgg = {
  id: 'tidal-music',
  name: 'Tidal Music',
  description: 'Play and manage your Tidal music library',
  icon: 'volume-2',
  category: 'Media',
  
  // Initialize the app egg
  init(containerId) {
    // Create a new Tidal player UI
    const playerUI = new TidalPlayerUI(containerId);
    return playerUI;
  }
};

export default tidalAppEgg;