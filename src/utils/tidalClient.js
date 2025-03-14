// src/utils/tidalClient.js - Front-end utilities for Tidal API interaction

/**
 * Initialize the Tidal client with user credentials
 * @param {Object} credentials - User credentials
 * @param {string} credentials.accessToken - Tidal access token
 * @param {string} credentials.userId - Tidal user ID
 * @param {string} [credentials.refreshToken] - Optional refresh token
 * @returns {Promise<Object>} - Response from the initialization
 */
async function initializeTidal(credentials) {
  try {
    if (!credentials.accessToken || !credentials.userId) {
      throw new Error('Access token and user ID are required');
    }
    
    const response = await fetch('/api/tidal/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to initialize Tidal: ${errorData.error || 'Unknown error'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error initializing Tidal:', error);
    throw error;
  }
}

/**
 * Search for content on Tidal
 * @param {string} query - Search query
 * @param {string} [type] - Type of content to search for
 * @param {number} [limit=20] - Number of results to return
 * @returns {Promise<Object>} - Search results
 */
async function searchTidal(query, type, limit = 20) {
  try {
    if (!query) {
      throw new Error('Search query is required');
    }
    
    const params = new URLSearchParams({
      query: query,
      limit: limit
    });
    
    if (type) {
      params.append('type', type);
    }
    
    const response = await fetch(`/api/tidal/search?${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to search Tidal: ${errorData.error || 'Unknown error'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching Tidal:', error);
    throw error;
  }
}

/**
 * Get track information from Tidal
 * @param {string} trackId - Tidal track ID
 * @returns {Promise<Object>} - Track information
 */
async function getTrackInfo(trackId) {
  try {
    if (!trackId) {
      throw new Error('Track ID is required');
    }
    
    const response = await fetch(`/api/tidal/track/${trackId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to get track info: ${errorData.error || 'Unknown error'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting track info:', error);
    throw error;
  }
}

/**
 * Get user playlists from Tidal
 * @param {Object} [options] - Options for the request
 * @param {number} [options.limit] - Number of playlists to return
 * @param {number} [options.offset] - Offset to start from
 * @param {string} [options.order] - Order to sort playlists
 * @param {string} [options.orderDirection] - Direction to sort playlists (ASC or DESC)
 * @returns {Promise<Object>} - User playlists
 */
async function getUserPlaylists(options = {}) {
  try {
    const params = new URLSearchParams();
    
    if (options.limit) params.append('limit', options.limit);
    if (options.offset) params.append('offset', options.offset);
    if (options.order) params.append('order', options.order);
    if (options.orderDirection) params.append('orderDirection', options.orderDirection);
    
    const response = await fetch(`/api/tidal/playlists?${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to get user playlists: ${errorData.error || 'Unknown error'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting user playlists:', error);
    throw error;
  }
}

/**
 * Get playlist tracks from Tidal
 * @param {string} playlistId - Tidal playlist ID
 * @param {Object} [options] - Options for the request
 * @param {number} [options.limit] - Number of tracks to return
 * @param {number} [options.offset] - Offset to start from
 * @param {string} [options.order] - Order to sort tracks
 * @param {string} [options.orderDirection] - Direction to sort tracks (ASC or DESC)
 * @returns {Promise<Object>} - Playlist tracks
 */
async function getPlaylistTracks(playlistId, options = {}) {
  try {
    if (!playlistId) {
      throw new Error('Playlist ID is required');
    }
    
    const params = new URLSearchParams();
    
    if (options.limit) params.append('limit', options.limit);
    if (options.offset) params.append('offset', options.offset);
    if (options.order) params.append('order', options.order);
    if (options.orderDirection) params.append('orderDirection', options.orderDirection);
    
    const response = await fetch(`/api/tidal/playlist/${playlistId}/tracks?${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to get playlist tracks: ${errorData.error || 'Unknown error'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting playlist tracks:', error);
    throw error;
  }
}

/**
 * Create a new playlist on Tidal
 * @param {Object} playlistOptions - Options for the new playlist
 * @param {string} playlistOptions.name - Name of the playlist
 * @param {string} [playlistOptions.description] - Description of the playlist
 * @param {boolean} [playlistOptions.isPublic] - Whether the playlist is public
 * @returns {Promise<Object>} - New playlist information
 */
async function createPlaylist(playlistOptions) {
  try {
    if (!playlistOptions.name) {
      throw new Error('Playlist name is required');
    }
    
    const response = await fetch('/api/tidal/playlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(playlistOptions)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create playlist: ${errorData.error || 'Unknown error'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
}

/**
 * Add tracks to a playlist on Tidal
 * @param {string} playlistId - Tidal playlist ID
 * @param {string[]} trackIds - Array of track IDs to add
 * @param {Object} [options] - Options for the request
 * @returns {Promise<Object>} - Result of adding tracks
 */
async function addTracksToPlaylist(playlistId, trackIds, options = {}) {
  try {
    if (!playlistId) {
      throw new Error('Playlist ID is required');
    }
    
    if (!trackIds || !Array.isArray(trackIds) || trackIds.length === 0) {
      throw new Error('Track IDs array is required');
    }
    
    const response = await fetch(`/api/tidal/playlist/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        trackIds,
        ...options
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to add tracks to playlist: ${errorData.error || 'Unknown error'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding tracks to playlist:', error);
    throw error;
  }
}

/**
 * Get user data from Tidal
 * @returns {Promise<Object>} - User data
 */
async function getUserData() {
  try {
    const response = await fetch('/api/tidal/user');
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to get user data: ${errorData.error || 'Unknown error'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
}

/**
 * Refresh the Tidal access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} - New tokens
 */
async function refreshToken(refreshToken) {
  try {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }
    
    const response = await fetch('/api/tidal/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to refresh token: ${errorData.error || 'Unknown error'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

// Create a class to manage Tidal credentials
class TidalCredentialsManager {
  /**
   * Store Tidal credentials in localStorage
   * @param {Object} credentials - User credentials
   * @param {string} credentials.accessToken - Tidal access token
   * @param {string} credentials.userId - Tidal user ID
   * @param {string} [credentials.refreshToken] - Optional refresh token
   * @param {number} [credentials.expiresAt] - Optional token expiration timestamp
   */
  static storeCredentials(credentials) {
    if (!credentials.accessToken || !credentials.userId) {
      throw new Error('Access token and user ID are required');
    }
    
    // Add expiration time if not provided (default to 24 hours)
    if (!credentials.expiresAt) {
      credentials.expiresAt = Date.now() + (24 * 60 * 60 * 1000);
    }
    
    localStorage.setItem('tidalCredentials', JSON.stringify(credentials));
  }
  
  /**
   * Get Tidal credentials from localStorage
   * @returns {Object|null} - User credentials or null if not found
   */
  static getCredentials() {
    const credentialsString = localStorage.getItem('tidalCredentials');
    if (!credentialsString) return null;
    
    return JSON.parse(credentialsString);
  }
  
  /**
   * Clear Tidal credentials from localStorage
   */
  static clearCredentials() {
    localStorage.removeItem('tidalCredentials');
  }
  
  /**
   * Check if Tidal credentials are valid and not expired
   * @returns {boolean} - Whether credentials are valid
   */
  static hasValidCredentials() {
    const credentials = this.getCredentials();
    if (!credentials || !credentials.accessToken || !credentials.userId) return false;
    
    // Check if token is expired
    if (credentials.expiresAt && Date.now() >= credentials.expiresAt) return false;
    
    return true;
  }
  
  /**
   * Attempt to refresh the access token if a refresh token is available
   * @returns {Promise<boolean>} - Whether the token was successfully refreshed
   */
  static async tryRefreshToken() {
    const credentials = this.getCredentials();
    if (!credentials || !credentials.refreshToken) return false;
    
    try {
      const result = await refreshToken(credentials.refreshToken);
      
      // Update stored credentials
      this.storeCredentials({
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
        userId: credentials.userId,
        expiresAt: Date.now() + (result.expires_in * 1000)
      });
      
      return true;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  }
}

// Export the Tidal client utilities
export {
  initializeTidal,
  searchTidal,
  getTrackInfo,
  getUserPlaylists,
  getPlaylistTracks,
  createPlaylist,
  addTracksToPlaylist,
  getUserData,
  refreshToken,
  TidalCredentialsManager
};