      function updatePlayButtons(url, isPaused) {
        // Find buttons in both chat and tray
        const mainButton = document.querySelector(`.chat .eggs-music .play img`);
        const trayButton = document.querySelector(`.egg-tray .eggs-music .play img`);
        
        // Update the icons
        if (mainButton) mainButton.src = `assets/icons/${isPaused ? 'play' : 'pause'}.svg`;
        if (trayButton) trayButton.src = `assets/icons/${isPaused ? 'play' : 'pause'}.svg`;
      }

      function toggleMusic(previewUrl) {
        if (audioPlayer && audioPlayer.src === previewUrl) {
          if (audioPlayer.paused) {
            audioPlayer.play();
            updatePlayButtons(previewUrl, false);
          } else {
            audioPlayer.pause();
            updatePlayButtons(previewUrl, true);
          }
        } else {
          if (audioPlayer) {
            audioPlayer.pause();
            // Reset old buttons
            updatePlayButtons(audioPlayer.src, true);
          }
          
          audioPlayer = new Audio(previewUrl);
          audioPlayer.play();
          updatePlayButtons(previewUrl, false);
          
          audioPlayer.addEventListener('ended', () => {
            updatePlayButtons(previewUrl, true);
          });
        }
      }