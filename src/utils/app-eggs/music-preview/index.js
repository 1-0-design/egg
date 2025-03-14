// src/utils/app-eggs/music-preview/index.js
// Music preview player app egg

import MusicPlayer from '../../../components/MusicPlayer.js';

// Metadata for the app egg
const musicPreviewEgg = {
  id: 'music-preview',
  name: 'Music Preview',
  description: 'Search and play 30-second music previews',
  icon: 'music',
  category: 'Media',
  
  // Initialize the app egg
  init(containerId) {
    // Create a new music player
    const player = new MusicPlayer(containerId);
    return player;
  }
};

export default musicPreviewEgg;
EOF 2>&1
