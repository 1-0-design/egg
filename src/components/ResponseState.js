// src/components/ResponseState.js

import responseManager from '../utils/responseManager.js';

class ResponseState {
  constructor(egg) {
    this.egg = egg;
    this.addStyles();
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .egg-content {
        display: inline-flex;
        height: 60px;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        padding: 23px;
        background: hsl(var(--background));
        border-radius: 100px;
        box-shadow: inset 0px 1px 1px rgba(255, 255, 255, 0.25), 0px 5px 15px rgba(0, 0, 0, 0.15);
        color: hsl(var(--foreground));
      }

      .egg-summary {
        font-family: 'Cash Sans-Medium', Helvetica;
        font-size: 18px;
        font-weight: 500;
        letter-spacing: 0;
        line-height: normal;
      }

      .checkmark {
        width: 48px;
        height: 48px;
        margin: -17px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: hsl(142.1 76.2% 36.3%);
        border-radius: 100px;
        color: hsl(var(--primary-foreground));
      }

      .icon {
        width: 24px;
        height: 24px;
      }

      .icon svg {
        width: 100%;
        height: 100%;
      }
    `;
    document.head.appendChild(style);
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
          <span class="icon">
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