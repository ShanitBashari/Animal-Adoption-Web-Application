import { createContext, useContext, useState } from "react";
import { AuthApi } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  /**
   * Initializes auth state from localStorage
   * so login persists across page refreshes.
   */
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("auth");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

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
      roles: data.roles || []
    };

    localStorage.setItem("auth", JSON.stringify(authData));
    setUser(authData);

    return data;
  };

  /**
   * Clears persisted auth data and resets the auth state.
   */
  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
  };

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