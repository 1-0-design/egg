      function updateButtons(isPaused) {
        const currentlyPlaying = document.querySelector('.chat .eggs-music .play img');
        const trayVersion = document.querySelector('.egg-tray .eggs-music .play img');
        
        if (currentlyPlaying) currentlyPlaying.src = `assets/icons/${isPaused ? 'play' : 'pause'}.svg`;
        if (trayVersion) trayVersion.src = `assets/icons/${isPaused ? 'play' : 'pause'}.svg`;
      }

      function toggleMusic(previewUrl, playButton) {
        const chatVersion = document.querySelector('.chat .eggs-music .play img');
        const trayVersion = document.querySelector('.egg-tray .eggs-music .play img');

        if (audioPlayer && audioPlayer.src === previewUrl) {
          if (audioPlayer.paused) {
            audioPlayer.play();
            updateButtons(false);  // Show pause icons
          } else {
            audioPlayer.pause();
            updateButtons(true);   // Show play icons
          }
        } else {
          if (audioPlayer) {
            audioPlayer.pause();
            updateButtons(true);   // Reset old buttons to play
          }
          
          audioPlayer = new Audio(previewUrl);
          audioPlayer.play();
          updateButtons(false);    // Set new buttons to pause
          
          audioPlayer.addEventListener('ended', () => {
            updateButtons(true);   // Reset to play when done
          });
        }
      }