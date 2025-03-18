# Apple Music Integration Demo

This project demonstrates how to integrate Apple Music with a web application, allowing you to:

1. Get the currently playing track information from the Music app
2. Display album artwork
3. Control playback (play/pause, next, previous)

## Prerequisites

- macOS (this solution uses AppleScript which is macOS-specific)
- Node.js installed on your machine
- Music app (formerly iTunes)

## Getting Started

1. Clone or download this repository
2. Install dependencies:
   ```
   npm install express
   ```
3. Start the server:
   ```
   node apple-music-server.js
   ```
4. Open a browser and go to:
   ```
   http://localhost:3000/apple-music-demo.html
   ```

## How It Works

The integration works using three key components:

1. **AppleScript Files**:
   - `get-music-info.applescript` - Retrieves current track information and album artwork
   - `control-music.applescript` - Controls Music app playback

2. **Node.js Server** (`apple-music-server.js`):
   - Creates API endpoints that execute the AppleScripts
   - Returns JSON data to the web interface

3. **Web Interface** (`apple-music-demo.html`):
   - Displays track information and album artwork
   - Provides playback controls
   - Optionally polls for track changes

## Integrating into Your Project

### 1. Copy the AppleScript Files

Include these in your project:
- `get-music-info.applescript`
- `control-music.applescript`

### 2. Create API Endpoints

Add routes to your existing server:

```javascript
// Get music info
app.get('/api/music-info', (req, res) => {
  exec('osascript get-music-info.applescript', (error, stdout) => {
    res.json(JSON.parse(stdout));
  });
});

// Control playback
app.get('/api/music-control', (req, res) => {
  const command = req.query.command;
  exec(`osascript control-music.applescript "${command}"`, (error, stdout) => {
    res.json(JSON.parse(stdout));
  });
});
```

### 3. Use the JavaScript API

Import the appleMusicBridge.js file and use it in your components:

```javascript
import { getCurrentTrack, startTrackPolling, controlPlayback } from './appleMusicBridge.js';

// Get current track
getCurrentTrack().then(data => {
  console.log('Now playing:', data.track.name);
  if (data.artwork.available) {
    albumArtElement.src = data.artwork.path;
  }
});

// Start polling for track changes
const pollingId = startTrackPolling(trackData => {
  // Update UI with new track data
}, 5000); // Check every 5 seconds

// Control playback
controlPlayback('next').then(result => {
  console.log('Skipped to next track');
});
```

## Customizing

You can modify the AppleScript files to extract additional information or add more control features as needed.

## Troubleshooting

- **Music app not detected**: Make sure the Music app is running
- **Permission errors**: You may need to grant permissions to Terminal/your app to control Music
- **No artwork displayed**: Not all tracks have embedded artwork

## License

MIT License - Feel free to use and modify for your projects!