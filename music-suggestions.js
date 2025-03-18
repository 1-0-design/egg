function addMusicWithSuggestions(data) {
  // Add all results as suggestions in ranked order
  const chatContainer = document.querySelector('.chat');
  
  // Helper to create a suggestion element
  function createSuggestion(songData, isPlaying = false) {
    const wrapper = document.createElement('div');
    wrapper.className = 'frame-wrapper';
    
    wrapper.innerHTML = `
      <div class="song-suggestion ${isPlaying ? 'music-playing' : 'suggestion'}" style="background-image: url('${songData.albumArt}')">
        ${isPlaying ? `
          <div class="overlap-group">
            <div class="frame">
              <div class="text-wrapper">${songData.title}</div>
              <div class="div">${songData.artist}</div>
            </div>
            <div class="more-button">
              <img class="icons-dots" alt="Icons dots" src="assets/icons/dots.svg" />
            </div>
            <img class="album-artwork" alt="Album artwork" src="${songData.albumArt}" />
            <div class="timeline">
              <div class="rectangle"></div>
            </div>
            <div class="icons-pause-wrapper" onclick="toggleMusic('${songData.previewUrl}')">
              <img class="icons-play" alt="Play" src="assets/icons/pause.svg" />
            </div>
          </div>
        ` : `
          <div class="overlap-group">
            <div class="overlap">
              <div class="frame-2">
                <div class="text-wrapper-2">${songData.title}</div>
                <div class="text-wrapper-3">${songData.artist}</div>
              </div>
              <img class="img" alt="Album artwork" src="${songData.albumArt}" />
              <div class="rectangle-wrapper">
                <div class="rectangle"></div>
              </div>
            </div>
            <div class="overlap-2">
              <div class="icons-dots-wrapper">
                <img class="icons-dots-2" alt="Icons dots" src="assets/icons/dots.svg" />
              </div>
              <div class="icons-play-wrapper" onclick="handleSuggestionClick(event, ${JSON.stringify(songData).replace(/"/g, '&quot;')})">
                <img class="icons-play" alt="Play" src="assets/icons/play-white.svg" />
              </div>
            </div>
          </div>
        `}
      </div>
    `;
    
    return wrapper;
  }

  // Create first result as playing track
  const topResult = createSuggestion(data.result, true);
  chatContainer.appendChild(topResult);

  // Add rest as suggestions
  data.suggestions.forEach(result => {
    const suggestionEl = createSuggestion({
      title: result.title,
      artist: result.artist,
      albumArt: result.albumArt,
      previewUrl: result.previewUrl
    });
    chatContainer.appendChild(suggestionEl);
  });

  // Handle tray egg
  const trayEgg = createMusicEgg(data.result);
  trayEgg.style.opacity = '0';
  const eggTray = document.querySelector('.egg-collection');
  
  if (state.activeMusicEgg) {
    state.activeMusicEgg.classList.add('egg-fade');
    setTimeout(() => state.activeMusicEgg.remove(), 300);
  }
  
  eggTray.innerHTML = '';
  eggTray.appendChild(trayEgg);
  requestAnimationFrame(() => trayEgg.style.opacity = '1');
  state.activeMusicEgg = trayEgg;

  // Start playing top result
  toggleMusic(data.result.previewUrl);

  // Scroll to latest
  scrollToLatest();
}