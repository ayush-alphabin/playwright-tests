// User authentication module
class AuthService {
  constructor() {
    this.users = new Map();
  }
  
  register(username, password) {
    if (this.users.has(username)) {
      throw new Error('User already exists');
    }
    this.users.set(username, { password, createdAt: new Date() });
    return { success: true, username };
  }
  
  login(username, password) {
    const user = this.users.get(username);
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }
    return { success: true, token: `token_${username}_${Date.now()}` };
  }
}

module.exports = AuthService;
