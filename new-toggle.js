let audioPlayer = null;

function toggleMusic(previewUrl) {
    // Find matching buttons for this URL in both chat and tray
    const mainEgg = document.querySelector(`.chat .eggs-music [onclick*="${previewUrl}"]`);
    const trayEgg = document.querySelector(`.egg-tray .eggs-music [onclick*="${previewUrl}"]`);
    
    const mainButton = mainEgg?.querySelector('.play img');
    const trayButton = trayEgg?.querySelector('.play img');
    
    function updateButtons(isPaused) {
        const icon = isPaused ? 'play' : 'pause';
        if (mainButton) mainButton.src = `assets/icons/${icon}.svg`;
        if (trayButton) trayButton.src = `assets/icons/${icon}.svg`;
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