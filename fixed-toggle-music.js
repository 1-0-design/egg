      function toggleMusic(previewUrl, button) {
        // The button passed is the .play div, get its img directly
        const buttonImg = button.getElementsByTagName('img')[0];
        
        // Find the corresponding button in the tray/chat (opposite of where we are)
        const isInChat = button.closest('.chat') !== null;
        const otherImg = isInChat 
          ? document.querySelector('.egg-tray .play img')
          : document.querySelector('.chat .play img');
        
        function updateButtons(isPaused) {
          const iconName = isPaused ? 'play' : 'pause';
          buttonImg.src = `assets/icons/${iconName}.svg`;
          if (otherImg) otherImg.src = `assets/icons/${iconName}.svg`;
        }
        
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
            // Reset old buttons to play
            const allButtons = document.querySelectorAll('.play img');
            allButtons.forEach(img => img.src = 'assets/icons/play.svg');
          }
          
          audioPlayer = new Audio(previewUrl);
          audioPlayer.play();
          updateButtons(false);    // Set new buttons to pause
          
          audioPlayer.addEventListener('ended', () => {
            updateButtons(true);   // Reset to play when done
          });
        }
      }