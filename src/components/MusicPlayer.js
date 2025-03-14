// src/components/MusicPlayer.js
// A component for playing music previews from iTunes

import { searchMusicPreviews, getTrackById, getTrendingMusic } from '../utils/musicPreviewApi.js';

// Load styles
try {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/src/styles/music-player.css';
  document.head.appendChild(link);
} catch (e) {
  console.error('Error loading music player CSS:', e);
}

class MusicPlayer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('Music player container not found:', containerId);
      return;
    }
    
    this.audioElement = new Audio();
    this.currentTrack = null;
    this.isPlaying = false;
    this.queue = [];
    this.queueIndex = 0;
    
    // Set up audio element listeners
    this.audioElement.addEventListener('timeupdate', () => this.updateProgress());
    this.audioElement.addEventListener('ended', () => this.playNext());
    this.audioElement.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      this.playNext();
    });
    
    // Load initial music
    this.loadInitialMusic();
    this.render();
    this.attachEventListeners();
  }
  
  async loadInitialMusic() {
    try {
      const trending = await getTrendingMusic(10);
      if (trending && trending.length > 0) {
        this.queue = trending;
        this.queueIndex = 0;
        await this.playTrack(trending[0].id);
      }
    } catch (error) {
      console.error('Error loading initial music:', error);
    }
  }
  
  render() {
    if (!this.container) return;
    
    let html = `<div class="music-player">`;
    
    // Show track information if we have a current track
    if (this.currentTrack) {
      html += `
        <img src="${this.currentTrack.albumArt || '/placeholder-favicon.svg'}" alt="Album Artwork" class="album-artwork">
        <div class="player-right">
          <div class="track-info">
            <div class="track-title">${this.currentTrack.title}</div>
            <div class="track-artist">${this.currentTrack.artist}</div>
          </div>
          <div class="controls">
            <button id="prev-button" class="control-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="19 20 9 12 19 4 19 20"></polygon>
                <line x1="5" y1="19" x2="5" y2="5"></line>
              </svg>
            </button>
            <button id="play-button" class="control-button">
              ${this.isPlaying ? 
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>` : 
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>`}
            </button>
            <button id="next-button" class="control-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 4 15 12 5 20 5 4"></polygon>
                <line x1="19" y1="5" x2="19" y2="19"></line>
              </svg>
            </button>
          </div>
        </div>`;
    } else {
      // If no track is loaded, show a loading state
      html += `
        <div class="loading">
          Loading music...
        </div>`;
    }
    
    html += `</div>`;
    
    this.container.innerHTML = html;
  }
  
  attachEventListeners() {
    if (!this.container) return;
    
    // Play/Pause button
    const playButton = document.getElementById('play-button');
    if (playButton) {
      playButton.addEventListener('click', () => this.togglePlay());
    }
    
    // Previous and Next buttons
    const prevButton = document.getElementById('prev-button');
    if (prevButton) {
      prevButton.addEventListener('click', () => this.playPrevious());
    }
    
    const nextButton = document.getElementById('next-button');
    if (nextButton) {
      nextButton.addEventListener('click', () => this.playNext());
    }
  }
  
  async search(query) {
    if (!query) return;
    
    try {
      this.searchResults = await searchMusicPreviews(query);
      
      // If we got results, add them to the queue
      if (this.searchResults.length > 0) {
        this.queue = [...this.searchResults];
        this.queueIndex = 0;
      }
      
      this.render();
      this.attachEventListeners();
    } catch (error) {
      console.error('Search error:', error);
    }
  }
  
  async playTrack(trackId) {
    try {
      // Find track in search results or fetch it if not found
      let track = this.searchResults.find(t => t.id == trackId);
      
      if (!track) {
        track = await getTrackById(trackId);
        if (!track) {
          throw new Error('Track not found');
        }
      }
      
      // Save current track
      this.currentTrack = track;
      
      // Update current track in queue
      const trackIndex = this.queue.findIndex(t => t.id == trackId);
      if (trackIndex !== -1) {
        this.queueIndex = trackIndex;
      }
      
      // Set up audio source
      this.audioElement.src = track.previewUrl;
      this.audioElement.volume = 0.7; // Default volume
      
      // Play the track
      this.audioElement.play()
        .then(() => {
          this.isPlaying = true;
          this.render();
          this.attachEventListeners();
        })
        .catch(error => {
          console.error('Error playing track:', error);
          this.isPlaying = false;
          this.render();
          this.attachEventListeners();
        });
    } catch (error) {
      console.error('Error playing track:', error);
    }
  }
  
  togglePlay() {
    if (!this.currentTrack) {
      // If no track is loaded but we have search results, play the first one
      if (this.searchResults.length > 0) {
        this.playTrack(this.searchResults[0].id);
      }
      return;
    }
    
    if (this.isPlaying) {
      this.audioElement.pause();
      this.isPlaying = false;
    } else {
      this.audioElement.play();
      this.isPlaying = true;
    }
    
    this.render();
    this.attachEventListeners();
  }
  
  playNext() {
    if (this.queue.length === 0) return;
    
    this.queueIndex = (this.queueIndex + 1) % this.queue.length;
    const nextTrack = this.queue[this.queueIndex];
    
    if (nextTrack) {
      this.playTrack(nextTrack.id);
    }
  }
  
  playPrevious() {
    if (this.queue.length === 0) return;
    
    // If we're more than 3 seconds into the track, restart it instead of going to previous
    if (this.audioElement.currentTime > 3) {
      this.audioElement.currentTime = 0;
      return;
    }
    
    this.queueIndex = (this.queueIndex - 1 + this.queue.length) % this.queue.length;
    const prevTrack = this.queue[this.queueIndex];
    
    if (prevTrack) {
      this.playTrack(prevTrack.id);
    }
  }
  
  updateProgress() {
    const currentTimeElement = document.querySelector('.current-time');
    const progressBar = document.querySelector('.progress-bar');
    
    if (currentTimeElement && progressBar) {
      const currentTime = this.audioElement.currentTime;
      const duration = this.audioElement.duration || 30; // iTunes previews are typically 30 seconds
      
      // Update time display
      currentTimeElement.textContent = this.formatTime(currentTime);
      
      // Update progress bar
      const percent = (currentTime / duration) * 100;
      progressBar.style.width = `${percent}%`;
    }
  }
  
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
  
  getCurrentTrack() {
    return this.currentTrack;
  }
  
  isCurrentlyPlaying() {
    return this.isPlaying;
  }
}

export default MusicPlayer;