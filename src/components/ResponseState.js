// src/components/ResponseState.js

import responseManager from '../utils/responseManager.js';

class ResponseState {
  constructor(egg) {
    this.egg = egg;
  }

  render() {
    // If egg has hideResponseState flag, don't render the state
    if (this.egg.hideResponseState || !responseManager.shouldShowResponseState(this.egg.id)) {
      return '';
    }

    return `
      <div class="egg-content">
        <div class="egg-summary">${this.egg.name}</div>
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
}

export default ResponseState;