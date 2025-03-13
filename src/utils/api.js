// src/utils/api.js - Utilities for API communication

/**
 * Sends a prompt to the Anthropic Claude API
 * @param {string} prompt - User's prompt text
 * @param {string} apiKey - Anthropic API key
 * @param {string} model - Model ID to use (e.g. claude-3-haiku-20240307)
 * @returns {Promise} - Promise resolving to API response
 */
async function callClaudeAPI(prompt, apiKey, model = 'claude-3-haiku-20240307') {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 1024
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

/**
 * Sends a prompt to the Goose API (when integrated)
 * @param {string} prompt - User's prompt text
 * @param {object} config - Configuration for the request
 * @returns {Promise} - Promise resolving to API response
 */
async function callGooseAPI(prompt, config) {
  // Implementation would depend on Goose API specifics
  // This is a placeholder for the integration
  try {
    const response = await fetch('/api/goose/prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        ...config
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Goose API Error: ${errorData.error || 'Unknown error'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error calling Goose API:', error);
    throw error;
  }
}

/**
 * Fetches a favicon for a given URL
 * @param {string} url - The website URL to fetch the favicon for
 * @returns {Promise<string>} - Promise resolving to the favicon URL
 */
async function getFavicon(url) {
  try {
    // Extract the domain from the URL
    const domain = new URL(url).hostname;
    
    // Try google's favicon service first
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    
    // Return the favicon URL
    return faviconUrl;
  } catch (error) {
    console.error('Error fetching favicon:', error);
    return '/placeholder-favicon.svg'; // Fallback to placeholder
  }
}

// Export the API utilities
export {
  callClaudeAPI,
  callGooseAPI,
  getFavicon
};