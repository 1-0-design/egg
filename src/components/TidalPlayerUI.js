// src/components/TidalPlayerUI.js
// A UI component for the Tidal player

import TidalPlayer from './TidalPlayer.js';

// Load the CSS
try {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/src/styles/tidal-player.css';
  document.head.appendChild(link);
} catch (e) {
  console.error('Error loading Tidal player CSS:', e);
}

class TidalPlayerUI {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error();
      return;
    }
    
    this.player = new TidalPlayer();
    this.currentTrack = null;
    this.searchResults = [];
    this.playlists = [];
    
    this.render();
    this.attachEventListeners();
  }
  
  render() {
    if (!this.container) return;
    
    // Check if the user is authenticated
    const isAuthenticated = this.player.isAuthenticated;
    
    let html = `
      <div class="tidal-player">
        <div class="tidal-header">
          <h2 class="tidal-title">TIDAL</h2>
          ${isAuthenticated ? `
            <button class="tidal-button" id="tidal-logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Log Out
            </button>
          ` : ''}
        </div>
    `;
    
    // Authentication section
    if (!isAuthenticated) {
      html += `
        <div class="tidal-auth">
          <input type="text" id="tidal-user-id" class="tidal-auth-input" placeholder="Enter your User ID" />
          <input type="password" id="tidal-access-token" class="tidal-auth-input" placeholder="Enter your Access Token" />
          <input type="password" id="tidal-refresh-token" class="tidal-auth-input" placeholder="Enter your Refresh Token (optional)" />
          <button class="tidal-button tidal-button-primary" id="tidal-login-button">Connect to TIDAL</button>
        </div>
      `;
    } else {
      // Now Playing section
      const currentTrack = this.player.getCurrentTrack();
      if (currentTrack) {
        const isPlaying = this.player.isCurrentlyPlaying();
        html += `
          <div class="tidal-track">
            <div class="tidal-track-art">
              <img src="${currentTrack.album?.cover || '/placeholder.jpg'}" alt="${currentTrack.title}" />
            </div>
            <div class="tidal-track-info">
              <div class="tidal-track-title">${currentTrack.title}</div>
              <div class="tidal-track-artist">${currentTrack.artist?.name || 'Unknown Artist'}</div>
            </div>
            <button class="tidal-control-button" id="tidal-play-pause">
              ${isPlaying ? `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ` : `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              `}
            </button>
          </div>
        `;
      }
      
      // Search section
      html += `
        <div class="tidal-search">
          <input type="text" id="tidal-search-input" class="tidal-search-input" placeholder="Search TIDAL" />
          <button class="tidal-button" id="tidal-search-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
        
        <div class="tidal-track-list" id="tidal-search-results">
          ${this.renderSearchResults()}
        </div>
      `;
    }
    
    html += `</div>`;
    
    this.container.innerHTML = html;
  }
  
  renderSearchResults() {
    if (!this.searchResults || this.searchResults.length === 0) {
      return '<div class="tidal-loading">Search for tracks to get started</div>';
    }
    
    return this.searchResults.map(result => {
      const track = result.item || result;
      const artist = track.artist || (track.artists && track.artists[0]) || { name: 'Unknown Artist' };
      const album = track.album || { cover: null };
      const coverUrl = album.cover || '/placeholder.jpg';
      
      return `
        <div class="tidal-track" data-track-id="${track.id}">
          <div class="tidal-track-art">
            <img src="${coverUrl}" alt="${track.title}" />
          </div>
          <div class="tidal-track-info">
            <div class="tidal-track-title">${track.title}</div>
            <div class="tidal-track-artist">${artist.name}</div>
          </div>
          <button class="tidal-control-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
        </div>
      `;
    }).join('');
  }
  
  renderPlaylists() {
    if (!this.playlists || this.playlists.length === 0) {
      return '<div class="tidal-loading">Loading your playlists...</div>';
    }
    
    return this.playlists.map(playlist => {
      const playlistData = playlist.data || playlist;
      const coverUrl = playlistData.image || '/placeholder.jpg';
      
      return `
        <div class="tidal-track" data-playlist-id="${playlistData.id}">
          <div class="tidal-track-art">
            <img src="${coverUrl}" alt="${playlistData.title}" />
          </div>
          <div class="tidal-track-info">
            <div class="tidal-track-title">${playlistData.title}</div>
            <div class="tidal-track-artist">${playlistData.numberOfTracks} tracks</div>
          </div>
          <button class="tidal-control-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
        </div>
      `;
    }).join('');
  }
  
  attachEventListeners() {
    if (!this.container) return;
    
    // Authentication events
    const loginButton = document.getElementById('tidal-login-button');
    if (loginButton) {
      loginButton.addEventListener('click', () => this.handleLogin());
    }
    
    const logoutButton = document.getElementById('tidal-logout');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => this.handleLogout());
    }
    
    // Search events
    const searchButton = document.getElementById('tidal-search-button');
    if (searchButton) {
      searchButton.addEventListener('click', () => this.handleSearch());
    }
    
    const searchInput = document.getElementById('tidal-search-input');
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleSearch();
        }
      });
    }
    
    // Track selection
    const trackElements = document.querySelectorAll('.tidal-track[data-track-id]');
    trackElements.forEach(track => {
      track.addEventListener('click', () => {
        const trackId = track.getAttribute('data-track-id');
        if (trackId) {
          this.handlePlayTrack(trackId);
        }
      });
    });
    
    // Playlist selection
    const playlistElements = document.querySelectorAll('.tidal-track[data-playlist-id]');
    playlistElements.forEach(playlist => {
      playlist.addEventListener('click', () => {
        const playlistId = playlist.getAttribute('data-playlist-id');
        if (playlistId) {
          this.handleOpenPlaylist(playlistId);
        }
      });
    });
    
    // Playback controls
    const playPauseButton = document.getElementById('tidal-play-pause');
    if (playPauseButton) {
      playPauseButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handlePlayPause();
      });
    }
  }
  
  // Event handlers
  async handleLogin() {
    const userIdInput = document.getElementById('tidal-user-id');
    const accessTokenInput = document.getElementById('tidal-access-token');
    const refreshTokenInput = document.getElementById('tidal-refresh-token');
    
    if (!userIdInput || !accessTokenInput) return;
    
    const userId = userIdInput.value.trim();
    const accessToken = accessTokenInput.value.trim();
    const refreshToken = refreshTokenInput ? refreshTokenInput.value.trim() : '';
    
    if (!userId || !accessToken) {
      alert('Please enter your User ID and Access Token.');
      return;
    }
    
    try {
      const success = await this.player.authenticate({
        userId,
        accessToken,
        refreshToken: refreshToken || undefined
      });
      
      if (success) {
        this.playlists = this.player.playlists;
        this.render();
        this.attachEventListeners();
      } else {
        alert('Failed to authenticate with Tidal. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error authenticating:', error);
      alert('Error connecting to TIDAL. Please try again.');
    }
  }
  
  handleLogout() {
    this.player.logout();
    this.currentTrack = null;
    this.searchResults = [];
    this.playlists = [];
    this.render();
    this.attachEventListeners();
  }
  
  async handleSearch() {
    const searchInput = document.getElementById('tidal-search-input');
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    if (!query) return;
    
    try {
      this.searchResults = await this.player.searchTracks(query);
      this.render();
      this.attachEventListeners();
    } catch (error) {
      console.error('Error searching:', error);
      alert('Error searching TIDAL. Please try again.');
    }
  }
  
  async handlePlayTrack(trackId) {
    try {
      await this.player.playTrack(trackId);
      this.currentTrack = this.player.getCurrentTrack();
      this.render();
      this.attachEventListeners();
    } catch (error) {
      console.error('Error playing track:', error);
      alert('Error playing track. Please try again.');
    }
  }
  
  handlePlayPause() {
    if (this.player.isCurrentlyPlaying()) {
      this.player.pauseTrack();
    } else {
      this.player.resumeTrack();
    }
    this.render();
    this.attachEventListeners();
  }
  
  async handleOpenPlaylist(playlistId) {
    try {
      const tracks = await this.player.getPlaylistTracks(playlistId);
      this.searchResults = tracks;
      this.render();
      this.attachEventListeners();
      
      // Scroll to search results
      const searchResults = document.getElementById('tidal-search-results');
      if (searchResults) {
        searchResults.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error opening playlist:', error);
      alert('Error opening playlist. Please try again.');
    }
  }
}

export default TidalPlayerUI;