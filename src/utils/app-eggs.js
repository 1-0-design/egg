/**
 * App Eggs Module
 * Handles specialized egg types (weather, music player, etc.)
 */

// Weather Egg
const WeatherEgg = {
    /**
     * Create a weather egg
     * @param {Object} weatherData - The weather data to display
     * @returns {HTMLElement} - The weather egg element
     */
    create: function(weatherData) {
        const eggElement = document.createElement('div');
        eggElement.classList.add('egg', 'weather-egg', 'completed');
        
        const weatherIcon = this.getWeatherIcon(weatherData.condition);
        
        eggElement.innerHTML = `
            <div class="weather-widget">
                <div class="weather-location">${weatherData.location}</div>
                <div class="weather-main">
                    <div class="weather-temp">${Math.round(weatherData.temp)}°</div>
                    <img src="${weatherIcon}" alt="${weatherData.condition}" class="weather-icon">
                </div>
                <div class="weather-details">
                    <div class="weather-detail">
                        <span class="icon icon-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M8 5.07A7 7 0 0 0 16 12a7 7 0 1 0-8-6.93"></path>
                                <path d="M11 12h9"></path>
                                <path d="m15 16 4-4-4-4"></path>
                            </svg>
                        </span>
                        <span>${weatherData.wind} mph</span>
                    </div>
                    <div class="weather-detail">
                        <span class="icon icon-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M17 18a5 5 0 0 0-10 0"></path>
                                <line x1="12" y1="9" x2="12" y2="2"></line>
                                <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
                                <line x1="1" y1="18" x2="3" y2="18"></line>
                                <line x1="21" y1="18" x2="23" y2="18"></line>
                                <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
                                <line x1="23" y1="22" x2="1" y2="22"></line>
                                <polyline points="8 6 12 2 16 6"></polyline>
                            </svg>
                        </span>
                        <span>${weatherData.sunrise}</span>
                    </div>
                    <div class="weather-detail">
                        <span class="icon icon-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M17 18a5 5 0 0 0-10 0"></path>
                                <line x1="12" y1="9" x2="12" y2="2"></line>
                                <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
                                <line x1="1" y1="18" x2="3" y2="18"></line>
                                <line x1="21" y1="18" x2="23" y2="18"></line>
                                <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
                                <line x1="23" y1="22" x2="1" y2="22"></line>
                                <polyline points="16 6 12 10 8 6"></polyline>
                            </svg>
                        </span>
                        <span>${weatherData.sunset}</span>
                    </div>
                </div>
            </div>
        `;
        
        return eggElement;
    },
    
    /**
     * Get the appropriate weather icon URL
     * @param {string} condition - The weather condition
     * @returns {string} - URL to weather icon
     */
    getWeatherIcon: function(condition) {
        const condition_lower = condition.toLowerCase();
        let icon = 'cloud.svg';
        
        if (condition_lower.includes('clear') || condition_lower.includes('sunny')) {
            icon = 'sun.svg';
        } else if (condition_lower.includes('rain')) {
            icon = 'cloud-rain.svg';
        } else if (condition_lower.includes('drizzle')) {
            icon = 'cloud-drizzle.svg';
        } else if (condition_lower.includes('snow')) {
            icon = 'cloud-snow.svg';
        } else if (condition_lower.includes('thunder') || condition_lower.includes('lightning')) {
            icon = 'cloud-lightning.svg';
        } else if (condition_lower.includes('cloud')) {
            icon = 'cloud.svg';
        } else if (condition_lower.includes('wind') || condition_lower.includes('breez')) {
            icon = 'wind.svg';
        }
        
        return `src/icons/${icon}`;
    },
    
    /**
 * Fetch weather data from a weather API
 * @param {string} location - The location to get weather for (optional)
 * @returns {Promise<Object>} - Weather data object
 */
fetchWeatherData: async function(location) {
    try {
        // First, if no location was provided, get user's location from IP
        if (!location) {
            const response = await fetch('https://ipapi.co/json/');
            const ipData = await response.json();
            
            if (ipData && ipData.city) {
                location = `${ipData.city}, ${ipData.region_code || ipData.country_code}`;
                console.log(`Detected location: ${location}`);
            } else {
                // Fallback if location detection fails
                location = 'Current Location';
                console.warn('Could not detect location, using default');
            }
        }
        
        // For demo purposes, we'll simulate weather data
        // In a real implementation, this would call a weather API like OpenWeatherMap
        const mockConditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Thunderstorm', 'Snow', 'Clear'];
        const randomCondition = mockConditions[Math.floor(Math.random() * mockConditions.length)];
        const randomTemp = Math.floor(Math.random() * 35) + 40; // 40-75°F
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return mock data with the detected or provided location
        return {
            location: location,
            temp: randomTemp,
            condition: randomCondition,
            wind: Math.floor(Math.random() * 15) + 2, // 2-17 mph
            humidity: Math.floor(Math.random() * 40) + 30, // 30-70%
            sunrise: '6:45 AM',
            sunset: '7:30 PM'
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Return default data if there's an error
        return {
            location: location || 'Unknown Location',
            temp: 70,
            condition: 'Partly Cloudy',
            wind: 8,
            humidity: 65,
            sunrise: '6:45 AM',
            sunset: '7:30 PM'
        };
    }
}
};

// Music Player Egg
const MusicEgg = {
    /**
     * Create a music player egg
     * @param {Object} trackData - The track data to display
     * @returns {HTMLElement} - The music player egg element
     */
    create: function(trackData) {
        const eggElement = document.createElement('div');
        eggElement.classList.add('egg', 'music-egg', 'completed');
        
        eggElement.innerHTML = `
            <div class="music-widget">
                <img src="${trackData.albumArt}" alt="${trackData.title}" class="album-artwork">
                <div class="music-info">
                    <div class="track-title">${trackData.title}</div>
                    <div class="artist-name">${trackData.artist}</div>
                    <div class="music-controls">
                        <button class="music-control-button skip-back" data-action="prev">
                            <span class="icon icon-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polygon points="19 20 9 12 19 4 19 20"></polygon>
                                    <line x1="5" y1="19" x2="5" y2="5"></line>
                                </svg>
                            </span>
                        </button>
                        <button class="music-control-button play-pause" data-action="play">
                            <span class="icon icon-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                            </span>
                        </button>
                        <button class="music-control-button skip-forward" data-action="next">
                            <span class="icon icon-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polygon points="5 4 15 12 5 20 5 4"></polygon>
                                    <line x1="19" y1="5" x2="19" y2="19"></line>
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
                <div class="music-progress">
                    <div class="music-progress-bar" style="width: ${trackData.progress || 0}%"></div>
                </div>
            </div>
        `;
        
        // Add event listeners to the music controls
        this.attachEventListeners(eggElement, trackData);
        
        return eggElement;
    },
    
    /**
     * Attach event listeners to music controls
     * @param {HTMLElement} eggElement - The music egg element
     * @param {Object} trackData - The track data
     */
    attachEventListeners: function(eggElement, trackData) {
        const playPauseButton = eggElement.querySelector('.play-pause');
        const prevButton = eggElement.querySelector('.skip-back');
        const nextButton = eggElement.querySelector('.skip-forward');
        
        playPauseButton.addEventListener('click', () => {
            const isPlaying = playPauseButton.getAttribute('data-state') === 'playing';
            
            if (isPlaying) {
                this.pauseTrack(trackData.id);
                playPauseButton.setAttribute('data-state', 'paused');
                playPauseButton.querySelector('svg').outerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                `;
            } else {
                this.playTrack(trackData.id);
                playPauseButton.setAttribute('data-state', 'playing');
                playPauseButton.querySelector('svg').outerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                `;
            }
        });
        
        prevButton.addEventListener('click', () => {
            this.previousTrack();
        });
        
        nextButton.addEventListener('click', () => {
            this.nextTrack();
        });
    },
    
    /**
     * Play a track
     * @param {string} trackId - The track ID to play
     */
    playTrack: function(trackId) {
        console.log(`Playing track: ${trackId}`);
        // In a real implementation, this would use the Tidal API to play the track
        
        // Simulate track progress updates
        this.startProgressSimulation();
    },
    
    /**
     * Pause the current track
     * @param {string} trackId - The track ID to pause
     */
    pauseTrack: function(trackId) {
        console.log(`Pausing track: ${trackId}`);
        // In a real implementation, this would use the Tidal API to pause the track
        
        // Stop the progress simulation
        this.stopProgressSimulation();
    },
    
    /**
     * Skip to the previous track
     */
    previousTrack: function() {
        console.log('Skipping to previous track');
        // In a real implementation, this would use the Tidal API to go to the previous track
    },
    
    /**
     * Skip to the next track
     */
    nextTrack: function() {
        console.log('Skipping to next track');
        // In a real implementation, this would use the Tidal API to go to the next track
    },
    
    /**
     * Start simulating track progress
     */
    startProgressSimulation: function() {
        this.progressInterval = setInterval(() => {
            const progressBar = document.querySelector('.music-progress-bar');
            if (progressBar) {
                let currentWidth = parseFloat(progressBar.style.width);
                if (currentWidth < 100) {
                    currentWidth += 0.5;
                    progressBar.style.width = `${currentWidth}%`;
                } else {
                    this.stopProgressSimulation();
                    // Auto-play next track
                    setTimeout(() => this.nextTrack(), 500);
                }
            }
        }, 1000);
    },
    
    /**
     * Stop progress simulation
     */
    stopProgressSimulation: function() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    },
    
    /**
     * Search for tracks on Tidal
     * @param {string} query - The search query
     * @returns {Promise<Array>} - Array of track results
     */
    searchTracks: async function(query) {
        // In a real implementation, this would call the Tidal API to search for tracks
        // For demo purposes, we'll return mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock track results
        return [
            {
                id: 't1',
                title: 'Blinding Lights',
                artist: 'The Weeknd',
                album: 'After Hours',
                albumArt: 'https://via.placeholder.com/80x80?text=Album',
                progress: 0
            },
            {
                id: 't2',
                title: 'Circles',
                artist: 'Post Malone',
                album: 'Hollywood\'s Bleeding',
                albumArt: 'https://via.placeholder.com/80x80?text=Album',
                progress: 0
            },
            {
                id: 't3',
                title: 'Dance Monkey',
                artist: 'Tones and I',
                album: 'The Kids Are Coming',
                albumArt: 'https://via.placeholder.com/80x80?text=Album',
                progress: 0
            }
        ];
    }
};

// Export the app eggs
export { WeatherEgg, MusicEgg };