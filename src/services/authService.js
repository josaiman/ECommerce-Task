
const STORAGE_KEYS = {
  USERS: 'ecommerce_users',
  TOKEN: 'auth_token',
  SESSION: 'active_session'
};


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(email, password) {

    await delay(800);


    if (email === 'admin@shop.com' && password === 'admin123') {
      const adminToken = `admin-token-${Date.now()}`;
      const adminUser = { id: 'admin-1', name: 'Admin', email, role: 'admin' };

      this._persistSession(adminToken, adminUser);
      return { token: adminToken, user: adminUser };
    }


    const users = this._getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      const token = `user-token-${Date.now()}`;
      const { password: _, ...safeUser } = user;
      const sessionUser = { ...safeUser, role: 'user' };

      this._persistSession(token, sessionUser);
      return { token, user: sessionUser };
    }

    throw new Error('Invalid email or password');
  },

  async signup(name, email, password) {
    await delay(800);
    const users = this._getUsers();

    if (users.find(u => u.email === email)) {
      throw new Error('This email is already registered');
    }

    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));


    return this.login(email, password);
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  getCurrentUser() {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.SESSION);
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },

  _getUsers() {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    return stored ? JSON.parse(stored) : [];
  },

  _persistSession(token, user) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
  }
};
