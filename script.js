document.addEventListener('DOMContentLoaded', () => {
    // Load app eggs module
    import('./src/utils/app-eggs.js')
        .then(module => {
            window.WeatherEgg = module.WeatherEgg;
            window.MusicEgg = module.MusicEgg;
        })
        .catch(error => console.error('Error loading app eggs:', error));

    // DOM Elements
    const eggsContainer = document.querySelector('.eggs-container');
    const textarea = document.querySelector('textarea');
    const sendButton = document.querySelector('.send-button');
    const voiceButton = document.querySelector('.voice-button');
    const chatMessages = document.querySelector('.chat-messages');
    const resultView = document.querySelector('.result-view');
    
    // Example of adding a new egg when sending a message
    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, 'user');
        
        // Check for special commands
        if (message.toLowerCase().includes('weather')) {
            processWeatherRequest(message);
        } else if (message.toLowerCase().includes('play') && message.toLowerCase().includes('music')) {
            processMusicRequest(message);
        } else {
            // Create a regular egg for the task
            createEgg(message);
        }
        
        // Add assistant response
        setTimeout(() => {
            addMessage('I\'m working on your request. This may take a moment...', 'assistant');
        }, 500);
        
        // Clear input
        textarea.value = '';
    });
    
    // Handle enter key in textarea
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });
    
    // Process weather request
    async function processWeatherRequest(message) {
        // Extract location from message (if any)
        const locationMatch = message.match(/weather\s+(?:in|for|at)\s+([^?.,]+)/i);
        const location = locationMatch ? locationMatch[1].trim() : null;
        
        // Create a processing egg
        const eggId = 'weather-' + Date.now();
        const eggElement = createProcessingEgg('Weather', eggId);
        
        // Add to container
        eggsContainer.prepend(eggElement);
        
        try {
            // Add response to chat
            addMessage(`I'll check the weather${location ? ' for ' + location : ' for your location'}.`, 'assistant');
            
            // Fetch weather data
            const weatherData = await window.WeatherEgg.fetchWeatherData(location);
            
            // Create weather egg
            const weatherEgg = window.WeatherEgg.create(weatherData);
            
            // Replace processing egg with weather egg
            eggsContainer.replaceChild(weatherEgg, eggElement);
            
            // Add completion message
            addMessage(`Here's the current weather for ${weatherData.location}. It's ${weatherData.condition} with a temperature of ${Math.round(weatherData.temp)}°F.`, 'assistant');
        } catch (error) {
            console.error('Weather error:', error);
            completeEgg(eggElement, 'Weather');
            addMessage('I had trouble getting the weather information. Please try again later.', 'assistant');
        }
    }
    
    // Process music request
    async function processMusicRequest(message) {
        // Extract song or artist from message
        const songMatch = message.match(/play\s+(?:music|song|track)?\s*(?:by|from)?\s*([^?.,]+)/i);
        const searchQuery = songMatch ? songMatch[1].trim() : 'popular songs';
        
        // Create a processing egg
        const eggId = 'music-' + Date.now();
        const eggElement = createProcessingEgg('Music', eggId);
        
        // Add to container
        eggsContainer.prepend(eggElement);
        
        try {
            // Add response to chat
            addMessage(`I'll find and play music for "${searchQuery}" for you.`, 'assistant');
            
            // Search for tracks
            const tracks = await window.MusicEgg.searchTracks(searchQuery);
            
            if (tracks && tracks.length > 0) {
                // Create music egg with the first track
                const musicEgg = window.MusicEgg.create(tracks[0]);
                
                // Replace processing egg with music egg
                eggsContainer.replaceChild(musicEgg, eggElement);
                
                // Add completion message
                addMessage(`I'm now playing "${tracks[0].title}" by ${tracks[0].artist}. You can control playback from the player.`, 'assistant');
            } else {
                completeEgg(eggElement, 'Music');
                addMessage('I couldn\'t find any tracks matching your request. Please try a different search.', 'assistant');
            }
        } catch (error) {
            console.error('Music error:', error);
            completeEgg(eggElement, 'Music');
            addMessage('I had trouble with the music playback. Please try again later.', 'assistant');
        }
    }
    
    // Function to add message to chat
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to create a processing egg
    function createProcessingEgg(summary, id) {
        // Create egg element
        const eggDiv = document.createElement('div');
        eggDiv.classList.add('egg', 'processing');
        eggDiv.id = id;
        
        eggDiv.innerHTML = `
            <div class="egg-content">
                <div class="egg-summary">${summary}</div>
                <div class="egg-preview">
                    <img src="placeholder-favicon.svg" alt="Website Favicon" class="favicon">
                    <div class="preview-window">
                        <div class="placeholder-preview">Processing...</div>
                    </div>
                </div>
            </div>
        `;
        
        return eggDiv;
    }
    
    // Function to create a new egg
    function createEgg(prompt) {
        // Create a short summary (first 20 chars)
        const summary = prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt;
        
        // Create egg element with an ID
        const eggId = 'egg-' + Date.now();
        const eggDiv = createProcessingEgg(summary, eggId);
        
        // Add click event to show full result when clicked
        eggDiv.addEventListener('click', () => {
            showResult(prompt, eggDiv.classList.contains('completed'));
        });
        
        // Add to container
        eggsContainer.prepend(eggDiv);
        
        // Simulate processing completion after some time
        setTimeout(() => {
            completeEgg(eggDiv, summary);
            
            // Add completion message to chat
            addMessage('I\'ve completed your request! Click the egg to view the full results.', 'assistant');
        }, 3000); // 3 seconds for demo
    }
    
    // Function to mark egg as completed
    function completeEgg(eggElement, summary) {
        eggElement.classList.remove('processing');
        eggElement.classList.add('completed');
        
        // Replace content with summary and checkmark
        eggElement.innerHTML = `
            <div class="egg-content">
                <div class="egg-summary">${summary}</div>
                <div class="checkmark">
                    <span class="icon icon-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </span>
                </div>
            </div>
        `;
    }
    
    // Function to show the full-screen result
    function showResult(prompt, isCompleted) {
        if (!isCompleted) {
            alert('This task is still processing. Please wait for it to complete.');
            return;
        }
        
        // Set the title
        document.querySelector('.result-title').textContent = prompt.length > 30 ? 
            prompt.substring(0, 30) + '...' : prompt;
        
        // Add dynamic content based on the prompt
        let resultContent = `
            <h2>Results for: ${prompt}</h2>
            <p>Here's the information you requested:</p>
        `;
        
        // Add some dynamic content based on the prompt type
        if (prompt.toLowerCase().includes('weather')) {
            resultContent += `
                <div class="result-card">
                    <h3>Weather Report</h3>
                    <p>This is a detailed weather report with forecasts and additional climate data.</p>
                </div>
            `;
        } else if (prompt.toLowerCase().includes('music') || prompt.toLowerCase().includes('play')) {
            resultContent += `
                <div class="result-card">
                    <h3>Music Information</h3>
                    <p>Track details, artist information, and recommendations based on your music preferences.</p>
                </div>
            `;
        } else {
            resultContent += `
                <div class="result-card">
                    <h3>AI Assistant Response</h3>
                    <p>I've processed your request for "${prompt}" and compiled the relevant information.</p>
                    <p>Click the share button to generate a shareable link to this result.</p>
                </div>
            `;
        }
        
        document.querySelector('.result-content').innerHTML = resultContent;
        
        // Show the result view
        resultView.style.display = 'flex';
        
        // Add close button functionality
        document.querySelector('.close-button').addEventListener('click', () => {
            resultView.style.display = 'none';
        });
        
        // Add share button functionality
        document.querySelector('.share-button').addEventListener('click', () => {
            const dummyLink = `https://egg.app/share/${Math.random().toString(36).substring(2, 10)}`;
            navigator.clipboard.writeText(dummyLink)
                .then(() => alert(`Link copied to clipboard: ${dummyLink}`))
                .catch(err => console.error('Failed to copy: ', err));
        });
    }
    
    // Handle existing eggs in the interface
    document.querySelectorAll('.egg').forEach(egg => {
        egg.addEventListener('click', () => {
            const summary = egg.querySelector('.egg-summary').textContent;
            showResult(summary, egg.classList.contains('completed'));
        });
    });
});