// src/AIResponse.js
// Handles AI responses including music search results

class AIResponse {
  constructor() {
    // Listen for music search results
    document.addEventListener('musicSearchResults', (event) => {
      this.handleMusicResults(event.detail);
    });
  }

  handleMusicResults(tracks) {
    // Create or get the results container
    let resultsContainer = document.querySelector('.music-search-results');
    if (!resultsContainer) {
      resultsContainer = document.createElement('div');
      resultsContainer.className = 'music-search-results';
      document.querySelector('.chat-response').appendChild(resultsContainer);
    }

    // Create bubbles for each track
    const html = tracks.map(track => `
      <div class="track-bubble" data-track-id="${track.id}">
        <img src="${track.albumArt}" alt="${track.title} artwork" class="track-bubble-art">
        <div class="track-bubble-info">
          <div class="track-bubble-title">${track.title}</div>
          <div class="track-bubble-artist">${track.artist}</div>
        </div>
      </div>
    `).join('');

    resultsContainer.innerHTML = html;

    // Add click handlers
    const bubbles = resultsContainer.querySelectorAll('.track-bubble');
    bubbles.forEach(bubble => {
      bubble.addEventListener('click', () => {
        const trackId = bubble.dataset.trackId;
        // Find the music player instance
        const player = document.querySelector('.music-player');
        if (player && player.__musicPlayer) {
          player.__musicPlayer.playTrack(trackId);
        }
      });
    });
  }
}

// Add styles
const style = document.createElement('style');
style.textContent = `
  .music-search-results {
    display: flex;
    gap: 12px;
    margin-top: 12px;
    overflow-x: auto;
    padding: 4px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .music-search-results::-webkit-scrollbar {
    display: none;
  }

  .track-bubble {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .track-bubble:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
  }

  .track-bubble-art {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    object-fit: cover;
  }

  .track-bubble-info {
    min-width: 120px;
    max-width: 160px;
  }

  .track-bubble-title {
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .track-bubble-artist {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.7);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

document.head.appendChild(style);

export default AIResponse;