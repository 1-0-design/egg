// src/utils/responseRenderer.js

import ResponseState from '../components/ResponseState.js';
import responseManager from './responseManager.js';

class ResponseRenderer {
  constructor() {
    this.responses = new Map();
  }

  addResponse(egg, element) {
    // Check if we should hide the response state
    if (egg.hideResponseState) {
      responseManager.hideResponseState(egg.id);
    }

    // Create and store the response
    const response = new ResponseState(egg);
    this.responses.set(egg.id, { egg, element, response });

    // Render the response
    this.renderResponse(egg.id);
  }

  renderResponse(eggId) {
    const response = this.responses.get(eggId);
    if (response) {
      const { element, response: responseState } = response;
      element.innerHTML = responseState.render();
    }
  }

  removeResponse(eggId) {
    this.responses.delete(eggId);
    responseManager.clearResponseState(eggId);
  }

  clearResponses() {
    this.responses.clear();
  }
}

const responseRenderer = new ResponseRenderer();
export default responseRenderer;