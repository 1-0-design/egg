async function morphSuggestionToEgg(suggestionEl, suggestionData) {
  // Handle current player first if it exists
  const currentPlayer = document.querySelector('.chat .egg-response');
  if (currentPlayer) {
    const music = currentPlayer.querySelector('.song-suggestion');
    const data = {
      title: music.querySelector('.text-wrapper').textContent,
      artist: music.querySelector('.div').textContent,
      albumArt: music.querySelector('.album-artwork').src,
      previewUrl: music.querySelector('.icons-pause-wrapper').getAttribute('onclick').match(/'([^']+)'/)[1],
    };

    // Switch to suggestion state
    music.classList.remove('music-playing');
    music.classList.add('suggestion');

    // Update content to suggestion layout
    music.innerHTML = `
      <div class="overlap-group">
        <div class="overlap">
          <div class="frame-2">
            <div class="text-wrapper-2">${data.title}</div>
            <div class="text-wrapper-3">${data.artist}</div>
          </div>
          <img class="img" alt="Album artwork" src="${data.albumArt}" />
          <div class="rectangle-wrapper">
            <div class="rectangle"></div>
          </div>
        </div>
        <div class="overlap-2">
          <div class="icons-dots-wrapper">
            <img class="icons-dots-2" alt="Icons dots" src="assets/icons/dots.svg" />
          </div>
          <div class="icons-play-wrapper" onclick="toggleMusic('${data.previewUrl}')">
            <img class="icons-play" alt="Play" src="assets/icons/play-white.svg" />
          </div>
        </div>
      </div>
    `;
  }

  // Handle tray egg with fade transition
  const trayEgg = createMusicEgg(suggestionData);
  trayEgg.style.opacity = '0';
  const eggTray = document.querySelector('.egg-collection');
  
  if (state.activeMusicEgg) {
    state.activeMusicEgg.classList.add('egg-fade');
    setTimeout(() => state.activeMusicEgg.remove(), 300);
  }
  
  eggTray.innerHTML = '';
  eggTray.appendChild(trayEgg);
  requestAnimationFrame(() => trayEgg.style.opacity = '1');

  // Morph clicked suggestion to music-playing state
  const suggestion = suggestionEl.querySelector('.song-suggestion');
  suggestion.classList.remove('suggestion');
  suggestion.classList.add('music-playing');

  // Update content to music-playing layout
  suggestion.innerHTML = `
    <div class="overlap-group">
      <div class="frame">
        <div class="text-wrapper">${suggestionData.title}</div>
        <div class="div">${suggestionData.artist}</div>
      </div>
      <div class="more-button">
        <img class="icons-dots" alt="Icons dots" src="assets/icons/dots.svg" />
      </div>
      <img class="album-artwork" alt="Album artwork" src="${suggestionData.albumArt}" />
      <div class="timeline">
        <div class="rectangle"></div>
      </div>
      <div class="icons-pause-wrapper" onclick="toggleMusic('${suggestionData.previewUrl}')">
        <img class="icons-play" alt="Play" src="assets/icons/pause.svg" />
      </div>
    </div>
  `;

  // Update state and start playing
  state.activeMusicEgg = trayEgg;
  toggleMusic(suggestionData.previewUrl);
}