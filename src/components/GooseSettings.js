// src/components/GooseSettings.js

/**
 * Component for configuring Goose integration settings
 */

// Goose integration utilities
import { 
  initializeGoose, 
  sendGooseRequest, 
  installGooseExtension, 
  getGooseSetupGuide 
} from '../utils/gooseIntegration.js';

const GooseSettings = {
  /**
   * Initialize the Goose settings component
   * @param {HTMLElement} container - Container element to render in
   */
  init: function(container) {
    this.container = container;
    this.render();
    this.attachEventListeners();
    
    // Check Goose installation on init
    this.checkGooseStatus();
  },
  
  /**
   * Render the settings UI
   */
  render: function() {
    const setupGuide = getGooseSetupGuide();
    
    const html = `
      <div class="goose-settings">
        <h2>${setupGuide.title}</h2>
        
        <div class="status-indicator" id="goose-status">
          <div class="status-loader"></div>
          <span>Checking Goose status...</span>
        </div>
        
        <div class="setup-guide">
          <h3>Setup Instructions</h3>
          <ol class="setup-steps">
            ${setupGuide.steps.map(step => `
              <li>
                <h4>${step.title}</h4>
                <p>${step.description}</p>
              </li>
            `).join('')}
          </ol>
        </div>
        
        <div class="settings-form">
          <h3>Configuration</h3>
          <div class="form-group">
            <label for="api-key">Anthropic API Key</label>
            <input type="password" id="api-key" placeholder="Enter your API key" />
            <p class="helper-text">Your API key is stored locally and never sent to our servers</p>
          </div>
          
          <div class="form-group">
            <label for="model-select">Model</label>
            <select id="model-select">
              <option value="claude-3-opus-20240229">Claude 3 Opus</option>
              <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
              <option value="claude-3-haiku-20240307" selected>Claude 3 Haiku</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="goose-path">Goose CLI Path (optional)</label>
            <input type="text" id="goose-path" placeholder="e.g., /usr/local/bin/goose" />
            <p class="helper-text">Leave empty for default installation location</p>
          </div>
          
          <div class="extensions-section">
            <h3>Recommended Extensions</h3>
            <ul class="extensions-list">
              <li>
                <div class="extension-item">
                  <span>Computer Controller</span>
                  <button class="btn install-extension" data-extension="computercontroller">Install</button>
                </div>
                <p>Enables web scraping, computer control, and automation</p>
              </li>
              <li>
                <div class="extension-item">
                  <span>Developer Tools</span>
                  <button class="btn install-extension" data-extension="developer">Install</button>
                </div>
                <p>Provides code editing and shell command capabilities</p>
              </li>
              <li>
                <div class="extension-item">
                  <span>Memory</span>
                  <button class="btn install-extension" data-extension="memory">Install</button>
                </div>
                <p>Allows Goose to remember information between sessions</p>
              </li>
            </ul>
          </div>
          
          <div class="actions">
            <button id="save-settings" class="btn btn-primary">Save Settings</button>
            <button id="test-connection" class="btn">Test Connection</button>
          </div>
        </div>
      </div>
    `;
    
    this.container.innerHTML = html;
  },
  
  /**
   * Attach event listeners to UI elements
   */
  attachEventListeners: function() {
    // Save settings button
    const saveButton = this.container.querySelector('#save-settings');
    if (saveButton) {
      saveButton.addEventListener('click', this.saveSettings.bind(this));
    }
    
    // Test connection button
    const testButton = this.container.querySelector('#test-connection');
    if (testButton) {
      testButton.addEventListener('click', this.testConnection.bind(this));
    }
    
    // Install extension buttons
    const installButtons = this.container.querySelectorAll('.install-extension');
    installButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const extensionName = e.target.dataset.extension;
        this.installExtension(extensionName, e.target);
      });
    });
  },
  
  /**
   * Check Goose installation status
   */
  async checkGooseStatus() {
    const statusElement = document.getElementById('goose-status');
    
    try {
      const result = await initializeGoose();
      
      if (result.status) {
        statusElement.innerHTML = `
          <div class="status-success">✓</div>
          <span>Goose is installed and ready</span>
        `;
        statusElement.classList.add('success');
      } else {
        statusElement.innerHTML = `
          <div class="status-warning">!</div>
          <span>${result.message}</span>
        `;
        statusElement.classList.add('warning');
      }
    } catch (error) {
      statusElement.innerHTML = `
        <div class="status-error">✗</div>
        <span>Error checking Goose: ${error.message}</span>
      `;
      statusElement.classList.add('error');
    }
  },
  
  /**
   * Save user settings
   */
  saveSettings() {
    const apiKey = document.getElementById('api-key').value;
    const modelSelect = document.getElementById('model-select');
    const model = modelSelect.options[modelSelect.selectedIndex].value;
    const goosePath = document.getElementById('goose-path').value;
    
    // Save settings to localStorage (in a real app, consider more secure storage)
    const settings = {
      apiKey,
      model,
      goosePath,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('egg_goose_settings', JSON.stringify(settings));
    
    // Show success message
    alert('Settings saved successfully!');
  },
  
  /**
   * Test the connection to Goose
   */
  async testConnection() {
    try {
      const testButton = document.getElementById('test-connection');
      const originalText = testButton.textContent;
      
      testButton.textContent = 'Testing...';
      testButton.disabled = true;
      
      // Get settings from localStorage
      const settingsJson = localStorage.getItem('egg_goose_settings');
      
      if (!settingsJson) {
        alert('Please save settings first');
        testButton.textContent = originalText;
        testButton.disabled = false;
        return;
      }
      
      const settings = JSON.parse(settingsJson);
      
      // Send a simple test request
      const response = await sendGooseRequest('Hello, I am testing the Goose integration', {
        model: settings.model
      });
      
      if (response.success) {
        alert('Connection successful! Goose is working correctly.');
      } else {
        alert(`Connection test failed: ${response.message || 'Unknown error'}`);
      }
      
      testButton.textContent = originalText;
      testButton.disabled = false;
    } catch (error) {
      alert(`Error testing connection: ${error.message}`);
      document.getElementById('test-connection').textContent = 'Test Connection';
      document.getElementById('test-connection').disabled = false;
    }
  },
  
  /**
   * Install a Goose extension
   * @param {string} extensionName - The name of the extension to install
   * @param {HTMLElement} buttonElement - The button that was clicked
   */
  async installExtension(extensionName, buttonElement) {
    const originalText = buttonElement.textContent;
    
    try {
      buttonElement.textContent = 'Installing...';
      buttonElement.disabled = true;
      
      const result = await installGooseExtension(extensionName);
      
      if (result.success) {
        buttonElement.textContent = 'Installed';
        buttonElement.classList.add('installed');
      } else {
        buttonElement.textContent = originalText;
        alert(`Installation failed: ${result.message}`);
      }
    } catch (error) {
      buttonElement.textContent = originalText;
      buttonElement.disabled = false;
      alert(`Error installing extension: ${error.message}`);
    }
  }
};

export default GooseSettings;