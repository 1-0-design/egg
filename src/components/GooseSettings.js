/**
 * GooseSettings.js
 * A simplified implementation of the Goose Settings component
 */

const GooseSettings = {
  init: function(container) {
    if (!container) return;
    
    container.innerHTML = `
      <div class="goose-settings">
        <h3>Goose Integration Settings</h3>
        <div class="setting-group">
          <label for="goose-api-key">Goose API Key</label>
          <input type="password" id="goose-api-key" placeholder="Enter your Goose API key">
          <p class="helper-text">Your Goose API key is stored locally</p>
        </div>
        <div class="setting-group">
          <label>Enable Goose Voice Integration</label>
          <div class="toggle-switch">
            <input type="checkbox" id="goose-voice-toggle" checked>
            <label for="goose-voice-toggle"></label>
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners
    const apiKeyInput = document.getElementById('goose-api-key');
    if (apiKeyInput) {
      // Load saved API key
      const savedKey = localStorage.getItem('goose_api_key') || '';
      apiKeyInput.value = savedKey;
      
      // Save API key on change
      apiKeyInput.addEventListener('change', function() {
        localStorage.setItem('goose_api_key', this.value);
      });
    }
    
    const voiceToggle = document.getElementById('goose-voice-toggle');
    if (voiceToggle) {
      // Load saved voice preference
      const voiceEnabled = localStorage.getItem('goose_voice_enabled') !== 'false';
      voiceToggle.checked = voiceEnabled;
      
      // Save voice preference on change
      voiceToggle.addEventListener('change', function() {
        localStorage.setItem('goose_voice_enabled', this.checked);
      });
    }
  }
};

export default GooseSettings;