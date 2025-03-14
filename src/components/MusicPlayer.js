// src/components/MusicPlayer.js
// A component for playing music previews from iTunes

import { searchMusicPreviews, getTrackById } from '../utils/musicPreviewApi.js';

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
      console.error();
      return;
    }
    
    this.audioElement = new Audio();
    this.currentTrack = null;
    this.searchResults = [];
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
    
    this.render();
    this.attachEventListeners();
  }
  
  render() {
    if (!this.container) return;
    
    let html = ;
    
    // Show track information if we have a current track
    if (this.currentTrack) {
      html += <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>;
    } else {
      // If no track is loaded, show a placeholder
      html += ;
    }
    
    // Search box for finding tracks
    html += ;
    
    // Show search results if available
    if (this.searchResults && this.searchResults.length > 0) {
      html += ;
      
      for (const track of this.searchResults) {
        html += ;
      }
      
      html += ;
    }
    
    html += ;
    
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
    
    // Volume slider
    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        this.audioElement.volume = e.target.value;
      });
    }
    
    // Progress bar seeking
    const progressContainer = document.getElementById('progress-container');
    if (progressContainer) {
      progressContainer.addEventListener('click', (e) => {
        const percent = e.offsetX / progressContainer.offsetWidth;
        this.audioElement.currentTime = percent * this.audioElement.duration;
      });
    }
    
    // Search functionality
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    
    if (searchButton && searchInput) {
      searchButton.addEventListener('click', () => {
        this.search(searchInput.value);
      });
      
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.search(searchInput.value);
        }
      });
    }
    
    // Track selection from search results
    const searchResults = document.querySelectorAll('.search-result');
    searchResults.forEach(result => {
      result.addEventListener('click', () => {
        const trackId = result.getAttribute('data-track-id');
        if (trackId) {
          this.playTrack(trackId);
        }
      });
    });
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
      progressBar.style.width = ;
    }
  }
  
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return ;
  }
  
  getCurrentTrack() {
    return this.currentTrack;
  }
  
  isCurrentlyPlaying() {
    return this.isPlaying;
  }
}

export default MusicPlayer;