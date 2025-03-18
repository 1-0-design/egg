      function toggleMusic(previewUrl) {
        // Find the buttons in both chat and tray
        const chatButton = document.querySelector('.chat .eggs-music .play img');
        const trayButton = document.querySelector('.egg-tray .eggs-music .play img');
        
        // Update both buttons
        function updateButtons(isPaused) {
          if (chatButton) chatButton.src = `assets/icons/${isPaused ? 'play' : 'pause'}.svg`;
          if (trayButton) trayButton.src = `assets/icons/${isPaused ? 'play' : 'pause'}.svg`;
        }
        
        if (audioPlayer && audioPlayer.src === previewUrl) {
          if (audioPlayer.paused) {
            audioPlayer.play();
            updateButtons(false);
          } else {
            audioPlayer.pause();
            updateButtons(true);
          }
        } else {
          if (audioPlayer) {
            audioPlayer.pause();
            updateButtons(true);
          }
          
          audioPlayer = new Audio(previewUrl);
          audioPlayer.play();
          updateButtons(false);
          
          audioPlayer.addEventListener('ended', () => {
            updateButtons(true);
          });
        }
      }