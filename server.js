// Simple Express server to serve the static files and handle API requests
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

// This is a workaround to use ES modules in CommonJS
// In production, you'd want to properly set up your build system
let tidalApi;
async function loadTidalApi() {
  try {
    tidalApi = await import('./src/utils/tidalApi.js');
    console.log('Tidal API loaded successfully');
  } catch (error) {
    console.error('Error loading Tidal API:', error);
  }
}
loadTidalApi();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to handle prompts/requests
app.post('/api/prompt', async (req, res) => {
  try {
    const { prompt, apiKey } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }
    
    // Here would be the logic to call Anthropic API or Goose
    // For demo purposes, we'll return a mock response
    
    setTimeout(() => {
      res.json({
        id: Math.random().toString(36).substring(2, 10),
        response: "This is a simulated response to your prompt. In a real implementation, this would be the response from the AI model.",
        metadata: {
          model: "claude-3-sonnet-20240229",
          processing_time: "1.2s",
          prompt_tokens: 128,
          completion_tokens: 256
        }
      });
    }, 2000); // Simulate some processing time
    
  } catch (error) {
    console.error('Error processing prompt:', error);
    res.status(500).json({ error: 'Failed to process prompt' });
  }
});

// API endpoint to fetch favicon
app.get('/api/favicon', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Logic to fetch favicon would go here
    // For demo, return the placeholder
    res.sendFile(path.join(__dirname, 'placeholder-favicon.svg'));
    
  } catch (error) {
    console.error('Error fetching favicon:', error);
    res.status(500).json({ error: 'Failed to fetch favicon' });
  }
});

// ----- TIDAL API ENDPOINTS -----

// Initialize Tidal client
app.post('/api/tidal/initialize', async (req, res) => {
  try {
    if (!tidalApi) {
      return res.status(500).json({ error: 'Tidal API not loaded yet' });
    }
    
    const { accessToken, userId, refreshToken } = req.body;
    
    if (!accessToken || !userId) {
      return res.status(400).json({ error: 'Access token and user ID are required' });
    }
    
    const client = tidalApi.initializeTidalClient({
      accessToken,
      userId,
      refreshToken
    });
    
    res.json({ success: true, message: 'Tidal client initialized successfully' });
  } catch (error) {
    console.error('Error initializing Tidal client:', error);
    res.status(500).json({ error: 'Failed to initialize Tidal client', details: error.message });
  }
});

// Search Tidal
app.get('/api/tidal/search', async (req, res) => {
  try {
    if (!tidalApi) {
      return res.status(500).json({ error: 'Tidal API not loaded yet' });
    }
    
    const { query, type, limit } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const results = await tidalApi.searchTidal(query, type, limit ? parseInt(limit) : undefined);
    res.json(results);
  } catch (error) {
    console.error('Error searching Tidal:', error);
    res.status(500).json({ error: 'Failed to search Tidal', details: error.message });
  }
});

// Get track info
app.get('/api/tidal/track/:id', async (req, res) => {
  try {
    if (!tidalApi) {
      return res.status(500).json({ error: 'Tidal API not loaded yet' });
    }
    
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Track ID is required' });
    }
    
    const trackInfo = await tidalApi.getTrackInfo(id);
    res.json(trackInfo);
  } catch (error) {
    console.error('Error getting track info:', error);
    res.status(500).json({ error: 'Failed to get track info', details: error.message });
  }
});

// Get user playlists
app.get('/api/tidal/playlists', async (req, res) => {
  try {
    if (!tidalApi) {
      return res.status(500).json({ error: 'Tidal API not loaded yet' });
    }
    
    const { limit, offset, order, orderDirection } = req.query;
    
    const options = {};
    if (limit) options.limit = parseInt(limit);
    if (offset) options.offset = parseInt(offset);
    if (order) options.order = order;
    if (orderDirection) options.orderDirection = orderDirection;
    
    const playlists = await tidalApi.getUserPlaylists(options);
    res.json(playlists);
  } catch (error) {
    console.error('Error getting user playlists:', error);
    res.status(500).json({ error: 'Failed to get user playlists', details: error.message });
  }
});

// Get playlist tracks
app.get('/api/tidal/playlist/:id/tracks', async (req, res) => {
  try {
    if (!tidalApi) {
      return res.status(500).json({ error: 'Tidal API not loaded yet' });
    }
    
    const { id } = req.params;
    const { limit, offset, order, orderDirection } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Playlist ID is required' });
    }
    
    const options = {};
    if (limit) options.limit = parseInt(limit);
    if (offset) options.offset = parseInt(offset);
    if (order) options.order = order;
    if (orderDirection) options.orderDirection = orderDirection;
    
    const tracks = await tidalApi.getPlaylistTracks(id, options);
    res.json(tracks);
  } catch (error) {
    console.error('Error getting playlist tracks:', error);
    res.status(500).json({ error: 'Failed to get playlist tracks', details: error.message });
  }
});

// Create playlist
app.post('/api/tidal/playlist', async (req, res) => {
  try {
    if (!tidalApi) {
      return res.status(500).json({ error: 'Tidal API not loaded yet' });
    }
    
    const { name, description, isPublic } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Playlist name is required' });
    }
    
    const playlistOptions = { name };
    if (description) playlistOptions.description = description;
    if (isPublic !== undefined) playlistOptions.isPublic = isPublic;
    
    const playlist = await tidalApi.createPlaylist(playlistOptions);
    res.json(playlist);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ error: 'Failed to create playlist', details: error.message });
  }
});

// Add tracks to playlist
app.post('/api/tidal/playlist/:id/tracks', async (req, res) => {
  try {
    if (!tidalApi) {
      return res.status(500).json({ error: 'Tidal API not loaded yet' });
    }
    
    const { id } = req.params;
    const { trackIds, onArtifactNotFound, onDupes } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Playlist ID is required' });
    }
    
    if (!trackIds || !Array.isArray(trackIds) || trackIds.length === 0) {
      return res.status(400).json({ error: 'Track IDs array is required' });
    }
    
    const options = {};
    if (onArtifactNotFound) options.onArtifactNotFound = onArtifactNotFound;
    if (onDupes) options.onDupes = onDupes;
    
    const result = await tidalApi.addTracksToPlaylist(id, trackIds, options);
    res.json(result);
  } catch (error) {
    console.error('Error adding tracks to playlist:', error);
    res.status(500).json({ error: 'Failed to add tracks to playlist', details: error.message });
  }
});

// Get user data
app.get('/api/tidal/user', async (req, res) => {
  try {
    if (!tidalApi) {
      return res.status(500).json({ error: 'Tidal API not loaded yet' });
    }
    
    const userData = await tidalApi.getUserData();
    res.json(userData);
  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(500).json({ error: 'Failed to get user data', details: error.message });
  }
});

// Refresh token
app.post('/api/tidal/refresh', async (req, res) => {
  try {
    if (!tidalApi) {
      return res.status(500).json({ error: 'Tidal API not loaded yet' });
    }
    
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }
    
    const tokens = await tidalApi.refreshToken(refreshToken);
    res.json(tokens);
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Failed to refresh token', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});