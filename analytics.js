// User analytics tracking
class Analytics {
  constructor() {
    this.events = [];
  }
  
  trackEvent(eventName, data) {
    this.events.push({ eventName, data, timestamp: Date.now() });
  }
}

module.exports = Analytics;
