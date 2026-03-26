import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const AUTH_CHANGED_EVENT = "queenkoba-auth-changed";
const USER_STORAGE_KEY = "user";
const TOKEN_STORAGE_KEY = "token";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  preferred_currency?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readStoredUser = () => {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

const parseResponse = async (response: Response) => {
  const raw = await response.text();
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

const readErrorMessage = (payload: unknown, fallback: string) => {
  if (typeof payload === "string" && payload) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const error = "error" in payload ? payload.error : undefined;
    const message = "message" in payload ? payload.message : undefined;
    if (typeof error === "string" && error) return error;
    if (typeof message === "string" && message) return message;
  }

  return fallback;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback((nextUser: User | null, token?: string | null) => {
    if (nextUser && token) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    setUser(nextUser);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }, []);

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      persistSession(null);
      return;
    }

    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const payload = await parseResponse(response);

    if (!response.ok) {
      throw new Error(readErrorMessage(payload, "Session expired"));
    }

    const nextUser =
      payload && typeof payload === "object" && "user" in payload ? (payload.user as User | null) : null;

    if (!nextUser) {
      throw new Error("Profile response was missing the current user");
    }

    persistSession(nextUser, token);
  }, [persistSession]);

  useEffect(() => {
    let cancelled = false;

    const bootstrapSession = async () => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUser = readStoredUser();

      if (!token) {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      if (storedUser && !cancelled) {
        setUser(storedUser);
      }

      try {
        await refreshProfile();
      } catch {
        if (!cancelled) {
          persistSession(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    const syncStoredSession = () => {
      if (cancelled) {
        return;
      }

      setUser(readStoredUser());
    };

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === USER_STORAGE_KEY || event.key === TOKEN_STORAGE_KEY) {
        syncStoredSession();
      }
    };

    const handleAuthChanged = () => {
      syncStoredSession();
    };

    void bootstrapSession();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);

    return () => {
      cancelled = true;
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
    };
  }, [persistSession, refreshProfile]);

  const authenticate = useCallback(
    async (endpoint: string, body: Record<string, unknown>, fallbackMessage: string) => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await parseResponse(response);

      if (!response.ok) {
        throw new Error(readErrorMessage(payload, fallbackMessage));
      }

      if (!payload || typeof payload !== "object") {
        throw new Error("Authentication response was invalid");
      }

      const token =
        ("token" in payload && typeof payload.token === "string" && payload.token) ||
        ("access_token" in payload && typeof payload.access_token === "string" && payload.access_token) ||
        null;
      const nextUser =
        "user" in payload && payload.user && typeof payload.user === "object" ? (payload.user as User) : null;

      if (!token || !nextUser) {
        throw new Error("Authentication token missing from response");
      }

      persistSession(nextUser, token);
    },
    [persistSession],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      await authenticate("/auth/login", { email, password }, "Login failed");
    },
    [authenticate],
  );

  const signup = useCallback(
    async (name: string, email: string, password: string, phone: string) => {
      await authenticate("/auth/signup", { name, email, password, phone }, "Signup failed");
    },
    [authenticate],
  );

  const loginWithGoogle = useCallback(
    async (credential: string) => {
      await authenticate("/auth/google", { credential }, "Google sign-in failed");
    },
    [authenticate],
  );

  const logout = useCallback(() => {
    persistSession(null);
  }, [persistSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        refreshProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
