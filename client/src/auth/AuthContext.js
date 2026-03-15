import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthApi } from "../api/api";

const AuthContext = createContext(null);

const SESSION_DURATION_MS = 60 * 60 * 1000; // 60 minutes

export function AuthProvider({ children }) {
  const logoutTimerRef = useRef(null);

  /**
   * Initializes auth state from localStorage
   * so login persists across page refreshes.
   */
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("auth");
      const parsed = raw ? JSON.parse(raw) : null;

      if (parsed?.expiresAt && Date.now() >= parsed.expiresAt) {
        localStorage.removeItem("auth");
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  });

  /**
   * Clears the current logout timer if exists.
   */
  const clearLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  /**
   * Starts auto logout timer according to expiresAt.
   */
  const startLogoutTimer = (expiresAt) => {
    clearLogoutTimer();

    const delay = expiresAt - Date.now();

    if (delay <= 0) {
      logout(true);
      return;
    }

    logoutTimerRef.current = setTimeout(() => {
      logout(true);
    }, delay);
  };

  /**
   * Logs in the user through the API,
   * stores auth data in localStorage,
   * and updates the global auth state.
   */
  const login = async (username, password) => {
    const data = await AuthApi.login({ username, password });

    const authData = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      id: data.userId,
      userId: data.userId,
      username: data.username,
      roles: data.roles || [],
      expiresAt: Date.now() + SESSION_DURATION_MS
    };

    localStorage.setItem("auth", JSON.stringify(authData));
    setUser(authData);
    startLogoutTimer(authData.expiresAt);

    return data;
  };

  /**
   * Clears persisted auth data and resets the auth state.
   * If expired=true, redirects to login with query params.
   */
  const logout = (expired = false) => {
    clearLogoutTimer();
    localStorage.removeItem("auth");
    setUser(null);

    if (expired) {
      const currentPath = window.location.pathname + window.location.search;

      if (window.location.pathname !== "/login") {
        window.location.href =
          `/login?expired=1&redirect=${encodeURIComponent(currentPath)}`;
      }
    }
  };

  /**
   * When app loads or user changes, restore/logout timer.
   */
  useEffect(() => {
    if (user?.expiresAt) {
      if (Date.now() >= user.expiresAt) {
        logout(true);
      } else {
        startLogoutTimer(user.expiresAt);
      }
    } else {
      clearLogoutTimer();
    }

    return () => clearLogoutTimer();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Convenience hook for accessing authentication state and actions.
 */
export function useAuth() {
  return useContext(AuthContext);
}