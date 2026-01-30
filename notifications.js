// Notification system
class NotificationManager {
  constructor() {
    this.notifications = [];
  }
  
  sendNotification(userId, message, type = 'info') {
    const notification = {
      id: Date.now(),
      userId,
      message,
      type,
      read: false,
      createdAt: new Date()
    };
    this.notifications.push(notification);
    return notification;
  }
  
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }
}

module.exports = NotificationManager;
