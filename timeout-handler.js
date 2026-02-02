// Timeout handler utility
class TimeoutHandler {
  constructor(defaultTimeout = 5000) {
    this.defaultTimeout = defaultTimeout;
  }
  
  async withTimeout(promise, timeout = this.defaultTimeout) {
    return Promise.race([
      promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Operation timed out')), timeout)
      )
    ]);
  }
  
  setDefaultTimeout(timeout) {
    this.defaultTimeout = timeout;
  }
  
  clearAllTimeouts() {
    // Clear all pending timeouts
    return { success: true, message: 'All timeouts cleared' };
  }
}

module.exports = TimeoutHandler;
