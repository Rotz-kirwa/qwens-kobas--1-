import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const AUTH_CHANGED_EVENT = "queenkoba-auth-changed";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const syncStoredSession = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === "user" || event.key === "token") {
        syncStoredSession();
      }
    };

    const handleAuthChanged = () => {
      syncStoredSession();
    };

    syncStoredSession();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
    };
  }, []);

  const persistSession = (nextUser: User | null, token?: string | null) => {
    if (nextUser && token) {
      localStorage.setItem('user', JSON.stringify(nextUser));
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }

    setUser(nextUser);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || 'Login failed');
    }

    const data = await response.json();
    const token = data.token || data.access_token;
    if (!token) throw new Error('Authentication token missing from response');

    persistSession(data.user, token);
  };

  const signup = async (name: string, email: string, password: string, phone: string) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || 'Signup failed');
    }

    const data = await response.json();
    const token = data.token || data.access_token;
    if (!token) throw new Error('Authentication token missing from response');

    persistSession(data.user, token);
  };

  const loginWithGoogle = async () => {
    window.location.href = `${API_URL}/auth/google`;
    return Promise.resolve();
  };

  const logout = () => {
    persistSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
