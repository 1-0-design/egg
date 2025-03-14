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
    
    let html = 
            <button class="tidal-logout-button" id="tidal-logout">Log Out</button>
          ;
    
    // Authentication section
    if (!isAuthenticated) {
      html += ;
    } else {
      // Now Playing section
      const currentTrack = this.player.getCurrentTrack();
      if (currentTrack) {
        html += ;
      }
      
      // Search section
      html += ;
    }
    
    html += ;
    
    this.container.innerHTML = html;
  }
  
  renderSearchResults() {
    if (!this.searchResults || this.searchResults.length === 0) {
      return '<div class="tidal-loading">Search for tracks to get started</div>';
    }
    
    let html = '';
    
    for (const result of this.searchResults) {
      const track = result.item || result;
      const artist = track.artist || (track.artists && track.artists[0]) || { name: 'Unknown Artist' };
      const album = track.album || { cover: null };
      const coverUrl = album.cover 
        ?  
        : '/placeholder.jpg';
      
      html += ;
    }
    
    return html;
  }
  
  renderPlaylists() {
    if (!this.playlists || this.playlists.length === 0) {
      return '<div class="tidal-loading">Loading your playlists...</div>';
    }
    
    let html = '';
    
    for (const playlist of this.playlists) {
      const playlistData = playlist.data || playlist;
      const coverUrl = playlistData.image 
        ?  
        : '/placeholder.jpg';
      
      html += ;
    }
    
    return html;
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
    
    // Playback controls
    const playPauseButton = document.getElementById('tidal-play-pause');
    if (playPauseButton) {
      playPauseButton.addEventListener('click', () => this.handlePlayPause());
    }
    
    const prevButton = document.getElementById('tidal-prev');
    if (prevButton) {
      prevButton.addEventListener('click', () => this.handlePrev());
    }
    
    const nextButton = document.getElementById('tidal-next');
    if (nextButton) {
      nextButton.addEventListener('click', () => this.handleNext());
    }
    
    // Track selection
    const trackElements = document.querySelectorAll('.tidal-track');
    trackElements.forEach(track => {
      track.addEventListener('click', () => {
        const trackId = track.getAttribute('data-track-id');
        if (trackId) {
          this.handlePlayTrack(trackId);
        }
      });
    });
    
    // Playlist selection
    const playlistElements = document.querySelectorAll('.tidal-playlist');
    playlistElements.forEach(playlist => {
      playlist.addEventListener('click', () => {
        const playlistId = playlist.getAttribute('data-playlist-id');
        if (playlistId) {
          this.handleOpenPlaylist(playlistId);
        }
      });
    });
  }
  
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
      alert();
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
      alert();
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
      alert();
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
  
  handlePrev() {
    // Implementation would depend on playlist context
    console.log('Previous track');
  }
  
  handleNext() {
    // Implementation would depend on playlist context
    console.log('Next track');
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
      alert();
    }
  }
}

// Export the TidalPlayerUI class
export default TidalPlayerUI;