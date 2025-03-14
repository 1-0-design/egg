// src/utils/musicPreviewApi.js
// Simple API for fetching 30-second music previews from iTunes

/**
 * Search for tracks on iTunes and get preview URLs
 * @param {string} term - Search query
 * @param {number} limit - Maximum number of results (default: 10)
 * @returns {Promise<Array>} - Array of track objects with preview URLs
 */
async function searchMusicPreviews(term, limit = 10) {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=${limit}`, 
      { mode: 'cors' }
    );
    
    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map the results to a simpler format
    return data.results.map(item => ({
      id: item.trackId,
      title: item.trackName,
      artist: item.artistName,
      album: item.collectionName,
      albumArt: item.artworkUrl100.replace('100x100', '300x300'),
      previewUrl: item.previewUrl,
      releaseDate: new Date(item.releaseDate).getFullYear()
    }));
  } catch (error) {
    console.error('Error searching music previews:', error);
    return [];
  }
}

/**
 * Get track details from iTunes by ID
 * @param {string} trackId - iTunes track ID
 * @returns {Promise<Object|null>} - Track object or null if not found
 */
async function getTrackById(trackId) {
  try {
    const response = await fetch(
      `https://itunes.apple.com/lookup?id=${trackId}`, 
      { mode: 'cors' }
    );
    
    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.resultCount === 0) {
      return null;
    }
    
    const item = data.results[0];
    return {
      id: item.trackId,
      title: item.trackName,
      artist: item.artistName,
      album: item.collectionName,
      albumArt: item.artworkUrl100.replace('100x100', '300x300'),
      previewUrl: item.previewUrl,
      releaseDate: new Date(item.releaseDate).getFullYear()
    };
  } catch (error) {
    console.error('Error getting track by ID:', error);
    return null;
  }
}

/**
 * Search for artist's top tracks
 * @param {string} artistName - Artist name
 * @param {number} limit - Maximum number of results (default: 10)
 * @returns {Promise<Array>} - Array of track objects
 */
async function getArtistTopTracks(artistName, limit = 10) {
  return searchMusicPreviews(`artist:${artistName}`, limit);
}

/**
 * Search for album tracks
 * @param {string} albumName - Album name
 * @param {string} artistName - Optional artist name to narrow results
 * @param {number} limit - Maximum number of results (default: 20)
 * @returns {Promise<Array>} - Array of track objects
 */
async function getAlbumTracks(albumName, artistName = '', limit = 20) {
  const query = artistName 
    ? `album:${albumName} artist:${artistName}`
    : `album:${albumName}`;
    
  return searchMusicPreviews(query, limit);
}

/**
 * Get currently trending music
 * @param {number} limit - Maximum number of results (default: 10)
 * @returns {Promise<Array>} - Array of track objects
 */
async function getTrendingMusic(limit = 10) {
  // This is a workaround since iTunes doesn't have a "trending" endpoint
  // We'll use a list of likely popular artists/genres
  const trendingQueries = [
    'pop', 'hiphop', 'taylor swift', 'the weeknd', 
    'drake', 'billie eilish', 'dua lipa', 'post malone'
  ];
  
  const randomQuery = trendingQueries[Math.floor(Math.random() * trendingQueries.length)];
  return searchMusicPreviews(randomQuery, limit);
}

export {
  searchMusicPreviews,
  getTrackById,
  getArtistTopTracks,
  getAlbumTracks,
  getTrendingMusic
};