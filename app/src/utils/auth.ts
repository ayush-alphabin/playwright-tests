interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  expiresAt: number;
}

const STORAGE_KEY = 'shopdemo_auth';
const TOKEN_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

// Simulated user database
const USERS: Record<string, { password: string; user: User }> = {
  'demo@example.com': {
    password: 'Demo1234!',
    user: { id: 'u1', email: 'demo@example.com', name: 'Demo User', role: 'customer' },
  },
  'admin@example.com': {
    password: 'Admin1234!',
    user: { id: 'u2', email: 'admin@example.com', name: 'Admin User', role: 'admin' },
  },
};

function generateToken(): string {
  return 'tok_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadState(): AuthState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { user: null, token: null, expiresAt: 0 };
    const state = JSON.parse(stored) as AuthState;
    if (Date.now() > state.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return { user: null, token: null, expiresAt: 0 };
    }
    return state;
  } catch {
    return { user: null, token: null, expiresAt: 0 };
  }
}

function saveState(state: AuthState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function login(email: string, password: string): { success: boolean; error?: string; user?: User } {
  const entry = USERS[email.toLowerCase()];
  if (!entry) return { success: false, error: 'Invalid email or password' };
  if (entry.password !== password) return { success: false, error: 'Invalid email or password' };

  const state: AuthState = {
    user: entry.user,
    token: generateToken(),
    expiresAt: Date.now() + TOKEN_EXPIRY_MS,
  };
  saveState(state);
  return { success: true, user: entry.user };
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser(): User | null {
  return loadState().user;
}

export function isAuthenticated(): boolean {
  const state = loadState();
  return state.user !== null && Date.now() < state.expiresAt;
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'admin';
}

export function getAuthToken(): string | null {
  return loadState().token;
}
