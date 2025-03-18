// src/components/MusicPlayer.js
// A component for playing music previews from iTunes

import { searchMusicPreviews, getTrackById, getTrendingMusic } from '../utils/musicPreviewApi.js';

// Custom event for search results
const SEARCH_RESULTS_EVENT = 'musicSearchResults';

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
    console.log('Initializing MusicPlayer with container:', containerId);
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('Music player container not found:', containerId);
      return;
    }
    
    this.audioElement = null; // We'll create this when needed
    this.currentTrack = null;
    this.isPlaying = false;
    this.queue = [];
    this.queueIndex = 0;
    this.progressInterval = null; // For updating progress bar
    this.currentTime = 0;
    this.duration = 30; // iTunes previews are typically 30 seconds

    // Set initial loading state
    this.container.innerHTML = `
      <div class="music-player">
        <div class="loading">
          <div class="spinner"></div>
        </div>
      </div>`;
    
    // We'll only load initial music if explicitly requested
    // Not loading by default as per requirements
  }
  
  async loadInitialMusic() {
    try {
      console.log('Loading initial music...');
      const trending = await getTrendingMusic(10);
      console.log('Trending music loaded, count:', trending.length);
      
      if (trending && trending.length > 0) {
        this.queue = trending;
        this.queueIndex = 0;
        await this.playTrack(trending[0].id);
      } else {
        console.error('No trending music found');
        this.render(); // Render empty state
      }
    } catch (error) {
      console.error('Error loading initial music:', error);
      // Show error state
      this.container.innerHTML = `
        <div class="music-player">
          <div class="error">
            <p>Error loading music. Please try again later.</p>
          </div>
        </div>`;
    }
  }
  
  render() {
    if (!this.container) return;
    
    console.log('Rendering music player, current track:', this.currentTrack);
    
    // Show track information if we have a current track
    if (this.currentTrack) {
      // Default album art as fallback
      const defaultArt = '/src/icons/music.svg';
      
      // Ensure we have an album art URL
      let albumArt = this.currentTrack.albumArt || defaultArt;
      
      // Format time as mm:ss
      const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' + secs : secs}`;
      };
      
      // Calculate progress percentage
      const progressPercent = this.currentTime / this.duration * 100;
      
      // Create the player HTML
      this.container.innerHTML = `
        <div class="music-player">
          <!-- Background album art with blur overlay -->
          <div class="music-player-bg" style="background-image: url('${albumArt}')"></div>
          <div class="music-player-overlay"></div>
          
          <!-- Main player content -->
          <img 
            src="${albumArt}" 
            alt="Album Artwork" 
            class="album-artwork" 
            onerror="this.onerror=null; this.src='/src/icons/music.svg';"
          />
          <div class="player-right">
            <div class="track-info">
              <div class="track-title">${this.currentTrack.title || 'Unknown Title'}</div>
              <div class="track-artist">${this.currentTrack.artist || 'Unknown Artist'}</div>
            </div>
            
            <!-- Timeline progress -->
            <div class="time-info">
              <span>${formatTime(this.currentTime)}</span>
              <span>${formatTime(this.duration)}</span>
            </div>
            <div class="progress-container">
              <div class="progress-bar" style="width: ${progressPercent}%"></div>
            </div>
            
            <!-- Control buttons -->
            <div class="controls">
              <button id="prev-button-${this.container.id}" class="control-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="19 20 9 12 19 4 19 20"></polygon>
                  <line x1="5" y1="19" x2="5" y2="5"></line>
                </svg>
              </button>
              <button id="play-button-${this.container.id}" class="control-button play-pause">
                ${this.isPlaying ? 
                  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>` : 
                  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>`}
              </button>
              <button id="next-button-${this.container.id}" class="control-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="5 4 15 12 5 20 5 4"></polygon>
                  <line x1="19" y1="5" x2="19" y2="19"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>`;
      
      // Animate the background blur after a short delay
      setTimeout(() => {
        const bgElement = this.container.querySelector('.music-player-bg');
        if (bgElement) {
          bgElement.style.filter = 'blur(10px)';
        }
      }, 100);
      
      // Attach event listeners
      this.attachEventListeners();
    } else {
      // If no track is loaded, show a loading state
      this.container.innerHTML = `
        <div class="music-player">
          <div class="music-player-overlay"></div>
          <div class="loading">
            <div class="spinner"></div>
          </div>
        </div>`;
    }
  }
  
  attachEventListeners() {
    // Play/Pause button
    const playButton = document.getElementById(`play-button-${this.container.id}`);
    if (playButton) {
      playButton.addEventListener('click', () => this.togglePlay());
    }
    
    // Previous button
    const prevButton = document.getElementById(`prev-button-${this.container.id}`);
    if (prevButton) {
      prevButton.addEventListener('click', () => this.playPrevious());
    }
    
    // Next button
    const nextButton = document.getElementById(`next-button-${this.container.id}`);
    if (nextButton) {
      nextButton.addEventListener('click', () => this.playNext());
    }
  }
  
  async search(query) {
    if (!query) return;
    
    try {
      console.log('Searching for:', query);
      
      // Show loading state
      this.container.innerHTML = `
        <div class="music-player">
          <div class="loading">
            <div class="spinner"></div>
          </div>
        </div>`;
      
      const results = await searchMusicPreviews(query);
      console.log(`Search results for "${query}":`, results);
      
      if (results && results.length > 0) {
        // Save full results to queue
        this.queue = results;
        this.queueIndex = 0;
        
        // Emit search results event for chat integration
        const searchResultsEvent = new CustomEvent(SEARCH_RESULTS_EVENT, {
          detail: results.slice(0, 3).map(track => ({
            id: track.id,
            title: track.title,
            artist: track.artist,
            albumArt: track.albumArt
          }))
        });
        document.dispatchEvent(searchResultsEvent);
        
        // Auto-play first result
        await this.playTrack(results[0].id);
      } else {
        console.log('No results found for query:', query);
        this.container.innerHTML = `
          <div class="music-player">
            <div class="error">
              <p>No results found for "${query}"</p>
            </div>
          </div>`;
      }
    } catch (error) {
      console.error('Search error:', error);
      this.container.innerHTML = `
        <div class="music-player">
          <div class="error">
            <p>Error searching for music. Please try again.</p>
          </div>
        </div>`;
    }
  }
  
  async playTrack(trackId) {
    try {
      console.log('Playing track ID:', trackId);
      
      // Stop any currently playing audio and progress tracking
      this.stopProgressTracking();
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement = null;
      }
      
      // Show loading state
      this.container.innerHTML = `
        <div class="music-player">
          <div class="music-player-overlay"></div>
          <div class="loading">
            <div class="spinner"></div>
          </div>
        </div>`;
      
      // Find track in queue or fetch it if not found
      let track = this.queue.find(t => t.id === trackId);
      
      if (!track) {
        console.log('Track not in queue, fetching details...');
        track = await getTrackById(trackId);
        if (!track) {
          throw new Error('Track not found');
        }
        // Add to queue if it wasn't there
        this.queue.push(track);
        this.queueIndex = this.queue.length - 1;
      } else {
        // Update queue index
        this.queueIndex = this.queue.findIndex(t => t.id === trackId);
      }
      
      console.log('Track details:', track);
      
      // Reset playback state
      this.currentTime = 0;
      this.currentTrack = track;
      
      // Render the player first so user sees something
      this.render();
      
      // Set up audio source if preview URL exists
      if (track.previewUrl) {
        // Create a new audio element each time (fixes some browser issues)
        this.audioElement = new Audio();
        
        // Set up audio element listeners
        this.audioElement.addEventListener('ended', () => {
          console.log('Audio ended, playing next track');
          this.stopProgressTracking();
          this.playNext();
        });
        
        this.audioElement.addEventListener('error', (e) => {
          console.error('Audio playback error:', e);
          this.isPlaying = false;
          this.stopProgressTracking();
          this.render();
        });
        
        // Get the duration from audioElement if available, otherwise use default 30s
        this.audioElement.addEventListener('loadedmetadata', () => {
          if (this.audioElement.duration && !isNaN(this.audioElement.duration)) {
            this.duration = this.audioElement.duration;
            this.render(); // Update the UI with correct duration
          }
        });
        
        // Add the canplaythrough event to actually start playing when ready
        this.audioElement.addEventListener('canplaythrough', () => {
          console.log('Audio is ready to play without buffering');
          // Play the track now that it's ready
          this.audioElement.play()
            .then(() => {
              console.log('Audio playback started successfully');
              this.isPlaying = true;
              this.startProgressTracking();
              this.render(); // Update UI to show playing state
            })
            .catch(playError => {
              console.error('Error starting playback:', playError);
              this.isPlaying = false;
              this.render(); // Update UI to show error state
            });
        }, { once: true }); // Only trigger once
        
        // Set source and volume
        this.audioElement.src = track.previewUrl;
        this.audioElement.volume = 0.7; // Default volume
        
        // Preload metadata to get duration info
        this.audioElement.preload = 'metadata';
        
        // Start loading the audio
        this.audioElement.load();
        
        console.log('Audio element initialized with URL:', track.previewUrl);
      } else {
        console.error('No preview URL available for track:', track.title);
        this.isPlaying = false;
        this.render();
      }
    } catch (error) {
      console.error('Error playing track:', error);
      this.isPlaying = false;
      
      // Show error state
      this.container.innerHTML = `
        <div class="music-player">
          <div class="music-player-overlay"></div>
          <div class="error">
            <p>Error playing track. Please try another.</p>
          </div>
        </div>`;
    }
  }
  
  // Start tracking progress for the progress bar
  startProgressTracking() {
    // Clear any existing interval first
    this.stopProgressTracking();
    
    // Update progress every 100ms for smooth visuals
    this.progressInterval = setInterval(() => {
      if (this.audioElement && this.isPlaying) {
        this.currentTime = this.audioElement.currentTime;
        
        // Update progress bar without full re-render for performance
        const progressBar = this.container.querySelector('.progress-bar');
        const currentTimeDisplay = this.container.querySelector('.time-info span:first-child');
        
        if (progressBar) {
          const progressPercent = (this.currentTime / this.duration) * 100;
          progressBar.style.width = `${progressPercent}%`;
        }
        
        if (currentTimeDisplay) {
          const mins = Math.floor(this.currentTime / 60);
          const secs = Math.floor(this.currentTime % 60);
          currentTimeDisplay.textContent = `${mins}:${secs < 10 ? '0' + secs : secs}`;
        }
      }
    }, 100);
  }
  
  // Stop tracking progress
  stopProgressTracking() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }
  
  togglePlay() {
    if (!this.currentTrack) {
      // If no track is loaded but we have queue, play the first one
      if (this.queue.length > 0) {
        this.playTrack(this.queue[0].id);
      }
      return;
    }
    
    if (!this.audioElement) {
      console.error('Audio element is not initialized');
      return;
    }
    
    if (this.isPlaying) {
      console.log('Pausing playback');
      this.audioElement.pause();
      this.isPlaying = false;
      this.stopProgressTracking();
    } else {
      console.log('Resuming playback');
      this.audioElement.play()
        .then(() => {
          console.log('Playback resumed successfully');
          this.startProgressTracking();
        })
        .catch(err => {
          console.error('Error resuming playback:', err);
        });
      this.isPlaying = true;
    }
    
    this.render();
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
    if (this.audioElement && this.audioElement.currentTime > 3) {
      this.audioElement.currentTime = 0;
      return;
    }
    
    this.queueIndex = (this.queueIndex - 1 + this.queue.length) % this.queue.length;
    const prevTrack = this.queue[this.queueIndex];
    
    if (prevTrack) {
      this.playTrack(prevTrack.id);
    }
  }
  
  getCurrentTrack() {
    return this.currentTrack;
  }
  
  isCurrentlyPlaying() {
    return this.isPlaying;
  }

  // Cleanup method to remove event listeners and cleanup resources
  destroy() {
    this.stopProgressTracking();
    
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement = null;
    }
    
    this.isPlaying = false;
    this.currentTrack = null;
  }
}

export default MusicPlayer;