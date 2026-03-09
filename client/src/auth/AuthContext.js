import { createContext, useContext, useState } from "react";
import { AuthApi } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("auth");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = async (username, password) => {
    const data = await AuthApi.login({ username, password });

    const authData = {
      accessToken: data.accessToken,
      username: data.username,
      roles: data.roles
    };

    localStorage.setItem("auth", JSON.stringify(authData));
    setUser(authData);

    return data;
  };

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

export function useAuth() {
  return useContext(AuthContext);
}