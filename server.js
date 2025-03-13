// Simple Express server to serve the static files and handle API requests
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});