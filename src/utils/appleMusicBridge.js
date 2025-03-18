// src/utils/appleMusicBridge.js

/**
 * A bridge to communicate with Apple Music via AppleScript
 * This allows for getting currently playing track info and artwork
 */

/**
 * Get the currently playing track from Apple Music
 * @returns {Promise<Object>} Track information including artwork path
 */
async function getCurrentTrack() {
  try {
    // Execute the AppleScript to get current track information
    const response = await fetch('/api/music-info');
    
    if (!response.ok) {
      throw new Error(`Error fetching track info: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting current track:', error);
    return { status: 'error', message: error.message };
  }
}

/**
 * Start polling for track changes
 * @param {Function} callback Function to call when track changes
 * @param {number} interval Polling interval in milliseconds (default: 3000)
 * @returns {number} Interval ID for stopping the polling
 */
function startTrackPolling(callback, interval = 3000) {
  // Get initial track info
  getCurrentTrack().then(callback);
  
  // Set up polling
  return setInterval(() => {
    getCurrentTrack().then(callback);
  }, interval);
}

/**
 * Stop polling for track changes
 * @param {number} intervalId Interval ID from startTrackPolling
 */
function stopTrackPolling(intervalId) {
  if (intervalId) {
    clearInterval(intervalId);
  }
}

/**
 * Control Apple Music playback
 * @param {string} command - Command to execute (play, pause, next, previous)
 * @returns {Promise<Object>} Result of the operation
 */
async function controlPlayback(command) {
  try {
    // Execute the AppleScript to control playback
    const response = await fetch(`/api/music-control?command=${command}`);
    
    if (!response.ok) {
      throw new Error(`Error controlling playback: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error controlling playback:', error);
    return { status: 'error', message: error.message };
  }
}

export { 
  getCurrentTrack,
  startTrackPolling,
  stopTrackPolling,
  controlPlayback
};