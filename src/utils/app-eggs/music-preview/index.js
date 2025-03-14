// src/utils/app-eggs/music-preview/index.js
// Music preview player app egg

const musicPreviewEgg = {
  id: "music-preview",
  name: "Music Preview",
  description: "Search and play 30-second music previews",
  icon: "music",
  category: "Media",
  
  // Initialize the app egg
  init(containerId) {
    // Import dynamically to avoid syntax issues
    return import("../../../components/MusicPlayer.js")
      .then(module => {
        const MusicPlayer = module.default;
        // Create a new music player
        return new MusicPlayer(containerId);
      })
      .catch(err => {
        console.error("Error loading Music Player:", err);
        return null;
      });
  }
};

export default musicPreviewEgg;