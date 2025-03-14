// src/utils/responseManager.js

class ResponseManager {
  constructor() {
    this.hiddenResponseStates = new Set();
  }

  shouldShowResponseState(eggId) {
    // Check if this egg's response state should be hidden
    return !this.hiddenResponseStates.has(eggId);
  }

  hideResponseState(eggId) {
    this.hiddenResponseStates.add(eggId);
  }

  showResponseState(eggId) {
    this.hiddenResponseStates.delete(eggId);
  }

  clearResponseState(eggId) {
    this.hiddenResponseStates.delete(eggId);
  }
}

const responseManager = new ResponseManager();
export default responseManager;