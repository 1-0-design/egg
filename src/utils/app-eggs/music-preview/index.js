// src/utils/app-eggs/music-preview/index.js
// Music preview player app egg

const musicPreviewEgg = {
  id: "music-preview",
  name: "Music Preview",
  description: "Listen to music previews",
  icon: "music",
  category: "Media",
  width: 300,  // Increased width for better UI
  height: 180, // Increased height for better UI
  hideAddedState: true, // Don't show checkmark when added
  hideFromLibrary: true, // Hide from library after spawning player
  hideResponseState: true, // Don't show completed state in chat
  showByDefault: false, // Don't show by default
  
  // Initialize the app egg
  init(containerId) {
    // Import dynamically to avoid syntax issues
    return import("../../../components/MusicPlayer.js")
      .then(module => {
        const MusicPlayer = module.default;
        // Create a new music player
        const player = new MusicPlayer(containerId);
        
        // Check if the player was properly initialized
        if (!player.container) {
          console.error("Music player initialization failed - container not found");
          return null;
        }
        
        return player;
      })
      .catch(err => {
        console.error("Error loading Music Player:", err);
        return null;
      });
  }
};

export default musicPreviewEgg;