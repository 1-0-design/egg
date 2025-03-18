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
    console.log(`Searching iTunes for "${term}" with limit ${limit}`);
    
    // Important: Let's add a timestamp to bypass cache issues
    const timestamp = new Date().getTime();
    const apiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=${limit}&t=${timestamp}`;
    
    const response = await fetch(apiUrl, { 
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`iTunes returned ${data.resultCount} results`);
    
    // Map the results to a simpler format with proper error handling
    return data.results.map(item => {
      // Debug info
      if (!item.artworkUrl100) {
        console.warn('Track missing artwork:', item.trackName);
      }
      if (!item.previewUrl) {
        console.warn('Track missing preview URL:', item.trackName);
      }
      
      // Get higher resolution artwork if available (100x100 -> 600x600)
      let albumArt = item.artworkUrl100 || null;
      if (albumArt) {
        albumArt = albumArt.replace('100x100bb', '600x600bb');
      }
      
      return {
        id: item.trackId,
        title: item.trackName || 'Unknown Title',
        artist: item.artistName || 'Unknown Artist',
        album: item.collectionName || 'Unknown Album',
        albumArt: albumArt,
        previewUrl: item.previewUrl,
        releaseDate: item.releaseDate ? new Date(item.releaseDate).getFullYear() : null
      };
    });
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
    console.log(`Getting track details for ID: ${trackId}`);
    
    // Add timestamp to prevent caching issues
    const timestamp = new Date().getTime();
    const response = await fetch(
      `https://itunes.apple.com/lookup?id=${trackId}&t=${timestamp}`, 
      { 
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.resultCount === 0) {
      console.error('No track found with ID:', trackId);
      return null;
    }
    
    const item = data.results[0];
    
    // Debug info
    if (!item.previewUrl) {
      console.warn('Track has no preview URL:', item.trackName);
    }
    
    if (!item.artworkUrl100) {
      console.warn('Track has no artwork:', item.trackName);
    }
    
    // Get higher resolution artwork (100x100 -> 600x600)
    let albumArt = item.artworkUrl100 || null;
    if (albumArt) {
      albumArt = albumArt.replace('100x100bb', '600x600bb');
    }
    
    return {
      id: item.trackId,
      title: item.trackName || 'Unknown Title',
      artist: item.artistName || 'Unknown Artist',
      album: item.collectionName || 'Unknown Album',
      albumArt: albumArt,
      previewUrl: item.previewUrl,
      releaseDate: item.releaseDate ? new Date(item.releaseDate).getFullYear() : null
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
    'pop hits', 'hip hop hits', 'taylor swift', 'the weeknd', 
    'drake', 'billie eilish', 'dua lipa', 'post malone',
    'ariana grande', 'beyonce', 'bad bunny', 'harry styles'
  ];
  
  const randomQuery = trendingQueries[Math.floor(Math.random() * trendingQueries.length)];
  console.log(`Getting trending music with query: ${randomQuery}`);
  return searchMusicPreviews(randomQuery, limit);
}

export {
  searchMusicPreviews,
  getTrackById,
  getArtistTopTracks,
  getAlbumTracks,
  getTrendingMusic
};