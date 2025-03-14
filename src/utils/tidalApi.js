// src/utils/tidalApi.js - Utilities for Tidal API integration
import * as tidalJs from '../../tidal-js/index.js';

let tidalClient = null;

/**
 * Initialize the Tidal API client with user credentials
 * @param {Object} credentials - User credentials
 * @param {string} credentials.accessToken - Tidal access token
 * @param {string} credentials.userId - Tidal user ID
 * @param {string} [credentials.refreshToken] - Optional refresh token
 * @returns {Object} - The initialized Tidal client
 */
function initializeTidalClient(credentials) {
  if (!credentials.accessToken || !credentials.userId) {
    throw new Error('Tidal access token and user ID are required');
  }
  
  tidalClient = new tidalJs.Client({
    accessToken: credentials.accessToken,
    userId: credentials.userId,
    refreshToken: credentials.refreshToken
  });
  
  return tidalClient;
}

/**
 * Get the current Tidal client or throw an error if not initialized
 * @returns {Object} - The Tidal client
 */
function getTidalClient() {
  if (!tidalClient) {
    throw new Error('Tidal client not initialized. Call initializeTidalClient first.');
  }
  return tidalClient;
}

/**
 * Search for content on Tidal
 * @param {string} query - Search query
 * @param {string} [type=TRACKS] - Type of content to search for (TRACKS, ALBUMS, ARTISTS, PLAYLISTS, ALL)
 * @param {number} [limit=20] - Number of results to return
 * @returns {Promise<Object>} - Search results
 */
async function searchTidal(query, type = tidalJs.SearchType.TRACKS, limit = 20) {
  const client = getTidalClient();
  
  try {
    const results = await client.search({
      query: query,
      types: type,
      limit: limit
    });
    
    return results;
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
  const client = getTidalClient();
  
  try {
    return await client.getTrackInfo(trackId);
  } catch (error) {
    console.error('Error getting track info:', error);
    throw error;
  }
}

/**
 * Get user playlists from Tidal
 * @param {Object} [options] - Options for the request
 * @returns {Promise<Object>} - User playlists
 */
async function getUserPlaylists(options = {}) {
  const client = getTidalClient();
  
  try {
    return await client.getUserPlaylists(options);
  } catch (error) {
    console.error('Error getting user playlists:', error);
    throw error;
  }
}

/**
 * Get playlist tracks from Tidal
 * @param {string} playlistId - Tidal playlist ID
 * @param {Object} [options] - Options for the request
 * @returns {Promise<Object>} - Playlist tracks
 */
async function getPlaylistTracks(playlistId, options = {}) {
  const client = getTidalClient();
  
  try {
    return await client.getPlaylistTracks(playlistId, options);
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
 * @returns {Promise<Object>} - New playlist information
 */
async function createPlaylist(playlistOptions) {
  const client = getTidalClient();
  
  try {
    return await client.createPlaylist(playlistOptions);
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
  const client = getTidalClient();
  
  try {
    return await client.addTracksToPlaylist(playlistId, trackIds, options);
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
  const client = getTidalClient();
  
  try {
    return await client.getUserData();
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
  const client = getTidalClient();
  
  try {
    return await client.refresh(refreshToken);
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

// Export the Tidal API utilities
export {
  initializeTidalClient,
  getTidalClient,
  searchTidal,
  getTrackInfo,
  getUserPlaylists,
  getPlaylistTracks,
  createPlaylist,
  addTracksToPlaylist,
  getUserData,
  refreshToken
};