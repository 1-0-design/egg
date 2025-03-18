function createMusicEgg(musicData) {
  const wrapper = document.createElement('div');
  wrapper.className = 'tray-egg';
  
  wrapper.innerHTML = `
    <div class="eggs-music transition-all" data-egg-id="music-${musicData.id}" style="background-image: url('${musicData.albumArt}')">
      <div class="overlap-group">
        <div class="frame">
          <div class="info">
            <div class="song-title">${musicData.title.toUpperCase()}</div>
            <div class="artist">${musicData.artist.toUpperCase()}</div>
          </div>
          <div class="more-button">
            <img class="icons-dots" src="assets/icons/dots.svg" alt="More options">
          </div>
        </div>
        <div class="frame-2">
          <img class="album-artwork" src="${musicData.albumArt}" alt="Album artwork">
          <div class="timeline">
            <div class="rectangle"></div>
          </div>
          <div class="play" onclick="toggleMusic('${musicData.previewUrl}')">
            <img src="assets/icons/play.svg" alt="Play">
          </div>
        </div>
      </div>
    </div>
  `;
  
  return wrapper;
}