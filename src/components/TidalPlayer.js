// src/components/TidalPlayer.js - A simple Tidal player component

// Import the Tidal client utilities
import { 
  initializeTidal, 
  searchTidal, 
  getTrackInfo, 
  getUserPlaylists, 
  getPlaylistTracks,
  TidalCredentialsManager 
} from '../utils/tidalClient.js';

// Define the TidalPlayer class
class TidalPlayer {
  constructor() {
    this.currentTrack = null;
    this.audioElement = null;
    this.playlists = [];
    this.searchResults = [];
    this.isPlaying = false;
    this.isAuthenticated = false;
    
    // Check if user is already authenticated
    this.checkAuthentication();
  }
  
  /**
   * Check if the user is already authenticated with Tidal
   */
  async checkAuthentication() {
    try {
      if (TidalCredentialsManager.hasValidCredentials()) {
        const credentials = TidalCredentialsManager.getCredentials();
        await initializeTidal(credentials);
        this.isAuthenticated = true;
        
        // Load user playlists
        this.loadUserPlaylists();
        
        console.log('User is authenticated with Tidal');
        return true;
      } else if (await TidalCredentialsManager.tryRefreshToken()) {
        // Token was expired but successfully refreshed
        const credentials = TidalCredentialsManager.getCredentials();
        await initializeTidal(credentials);
        this.isAuthenticated = true;
        
        // Load user playlists
        this.loadUserPlaylists();
        
        console.log('User token was refreshed and is now authenticated');
        return true;
      }
      
      console.log('User is not authenticated with Tidal');
      return false;
    } catch (error) {
      console.error('Error checking authentication:', error);
      this.isAuthenticated = false;
      return false;
    }
  }
  
  /**
   * Authenticate with Tidal using user credentials
   * @param {Object} credentials - User credentials
   * @param {string} credentials.accessToken - Tidal access token
   * @param {string} credentials.userId - Tidal user ID
   * @param {string} [credentials.refreshToken] - Optional refresh token
   * @returns {Promise<boolean>} - Whether authentication was successful
   */
  async authenticate(credentials) {
    try {
      await initializeTidal(credentials);
      
      // Store credentials for future use
      TidalCredentialsManager.storeCredentials(credentials);
      
      this.isAuthenticated = true;
      
      // Load user playlists
      await this.loadUserPlaylists();
      
      return true;
    } catch (error) {
      console.error('Error authenticating with Tidal:', error);
      this.isAuthenticated = false;
      return false;
    }
  }
  
  /**
   * Load user playlists from Tidal
   * @returns {Promise<Array>} - Array of playlists
   */
  async loadUserPlaylists() {
    try {
      if (!this.isAuthenticated) {
        throw new Error('User is not authenticated');
      }
      
      const result = await getUserPlaylists();
      this.playlists = result.items || [];
      
      return this.playlists;
    } catch (error) {
      console.error('Error loading user playlists:', error);
      return [];
    }
  }
  
  /**
   * Search for tracks on Tidal
   * @param {string} query - Search query
   * @param {number} [limit=20] - Number of results to return
   * @returns {Promise<Array>} - Array of search results
   */
  async searchTracks(query, limit = 20) {
    try {
      if (!this.isAuthenticated) {
        throw new Error('User is not authenticated');
      }
      
      const results = await searchTidal(query, 'TRACKS', limit);
      this.searchResults = results.tracks?.items || [];
      
      return this.searchResults;
    } catch (error) {
      console.error('Error searching for tracks:', error);
      return [];
    }
  }
  
  /**
   * Play a track by ID
   * @param {string} trackId - Tidal track ID
   * @returns {Promise<boolean>} - Whether playing was successful
   */
  async playTrack(trackId) {
    try {
      if (!this.isAuthenticated) {
        throw new Error('User is not authenticated');
      }
      
      // Get track info
      const trackInfo = await getTrackInfo(trackId);
      this.currentTrack = trackInfo;
      
      // In a real implementation, you would get the audio stream URL from Tidal
      // For now, we'll just simulate playing
      console.log(`Playing track: ${trackInfo.title} by ${trackInfo.artist.name}`);
      
      this.isPlaying = true;
      
      // Trigger a custom event that the track is playing
      document.dispatchEvent(new CustomEvent('tidal-track-playing', { 
        detail: { track: trackInfo }
      }));
      
      return true;
    } catch (error) {
      console.error('Error playing track:', error);
      return false;
    }
  }
  
  /**
   * Pause the current track
   */
  pauseTrack() {
    if (this.isPlaying && this.audioElement) {
      this.audioElement.pause();
      this.isPlaying = false;
      
      // Trigger a custom event that the track is paused
      document.dispatchEvent(new CustomEvent('tidal-track-paused'));
    }
  }
  
  /**
   * Resume the current track
   */
  resumeTrack() {
    if (!this.isPlaying && this.audioElement) {
      this.audioElement.play();
      this.isPlaying = true;
      
      // Trigger a custom event that the track is resumed
      document.dispatchEvent(new CustomEvent('tidal-track-resumed'));
    }
  }
  
  /**
   * Get tracks from a playlist
   * @param {string} playlistId - Tidal playlist ID
   * @returns {Promise<Array>} - Array of tracks
   */
  async getPlaylistTracks(playlistId) {
    try {
      if (!this.isAuthenticated) {
        throw new Error('User is not authenticated');
      }
      
      const result = await getPlaylistTracks(playlistId);
      return result.items || [];
    } catch (error) {
      console.error('Error getting playlist tracks:', error);
      return [];
    }
  }
  
  /**
   * Get the current track info
   * @returns {Object|null} - Current track info
   */
  getCurrentTrack() {
    return this.currentTrack;
  }
  
  /**
   * Check if a track is currently playing
   * @returns {boolean} - Whether a track is playing
   */
  isCurrentlyPlaying() {
    return this.isPlaying;
  }
  
  /**
   * Log out of Tidal
   */
  logout() {
    this.currentTrack = null;
    this.playlists = [];
    this.searchResults = [];
    this.isPlaying = false;
    this.isAuthenticated = false;
    
    // Clear credentials
    TidalCredentialsManager.clearCredentials();
    
    // Trigger a custom event that the user logged out
    document.dispatchEvent(new CustomEvent('tidal-logout'));
  }
}

// Export the TidalPlayer class
export default TidalPlayer;