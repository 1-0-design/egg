#!/usr/bin/env node

/**
 * Simple Express server to connect Apple Music to web app
 * This provides endpoints to get music info and control playback
 */

const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// API endpoint to get current music info
app.get('/api/music-info', (req, res) => {
  const scriptPath = path.join(__dirname, 'get-music-info.applescript');
  
  exec(`osascript "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing AppleScript: ${error.message}`);
      return res.status(500).json({ status: 'error', message: error.message });
    }
    
    if (stderr) {
      console.error(`AppleScript stderr: ${stderr}`);
    }
    
    try {
      // Parse the JSON output from the AppleScript
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (parseError) {
      console.error(`Error parsing AppleScript output: ${parseError.message}`);
      console.error(`Raw output: ${stdout}`);
      res.status(500).json({ 
        status: 'error', 
        message: 'Failed to parse AppleScript output',
        raw: stdout
      });
    }
  });
});

// API endpoint to control music playback
app.get('/api/music-control', (req, res) => {
  const command = req.query.command;
  const validCommands = ['play', 'pause', 'playpause', 'next', 'previous'];
  
  if (!command || !validCommands.includes(command)) {
    return res.status(400).json({ 
      status: 'error', 
      message: `Invalid command. Use one of: ${validCommands.join(', ')}`
    });
  }
  
  const scriptPath = path.join(__dirname, 'control-music.applescript');
  
  exec(`osascript "${scriptPath}" "${command}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing AppleScript: ${error.message}`);
      return res.status(500).json({ status: 'error', message: error.message });
    }
    
    if (stderr) {
      console.error(`AppleScript stderr: ${stderr}`);
    }
    
    try {
      // Parse the JSON output from the AppleScript
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (parseError) {
      console.error(`Error parsing AppleScript output: ${parseError.message}`);
      console.error(`Raw output: ${stdout}`);
      res.status(500).json({ 
        status: 'error', 
        message: 'Failed to parse AppleScript output',
        raw: stdout
      });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Apple Music bridge server running at http://localhost:${port}`);
  console.log(`Open the demo page at http://localhost:${port}/apple-music-demo.html`);
});