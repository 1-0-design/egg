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
      <div class="inline-flex h-[60px] items-center gap-2.5 relative bg-black rounded-[100px] shadow-[inset_0px_1px_1px_#ffffff40,0px_5px_15px_#00000026] pl-1.5 pr-[18px] py-[23px] text-white" data-track-id="${track.id}">
        <div class="w-12 h-12 mt-[-17px] mb-[-17px] rounded-full overflow-hidden bg-gray-300">
          <img src="${track.albumArt}" alt="${track.title} artwork" class="w-full h-full object-cover">
        </div>
        <div class="relative w-fit mt-[-0.50px] font-medium text-lg tracking-[0] leading-[normal] whitespace-nowrap">
          ${track.title} - ${track.artist}
        </div>
        <div class="inline-flex flex-col items-center justify-center relative flex-[0_0_auto] mt-[-5px] mb-[-5px]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </div>
      </div>
    `).join('');

    resultsContainer.innerHTML = html;

    // Add click handlers
    const bubbles = resultsContainer.querySelectorAll('[data-track-id]');
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
    flex-direction: column;
    gap: 15px;
    margin-top: 15px;
    overflow-x: visible;
    padding: 0;
  }
`;

document.head.appendChild(style);

export default AIResponse;