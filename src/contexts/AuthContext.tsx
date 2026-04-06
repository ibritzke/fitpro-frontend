import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

interface User {
  id: string;
  name: string;
  email?: string;
  role: "ADMIN" | "TRAINER" | "STUDENT";
  photoUrl?: string;
  logoUrl?: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  studentLogin: (code: string) => Promise<void>;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("fitpro_token");
    if (storedToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      setToken(storedToken);
      api.get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          // eslint-disable-next-line react-hooks/immutability
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: newToken, refreshToken, ...userData } = res.data;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("fitpro_token", newToken);
    if (refreshToken) localStorage.setItem("fitpro_refresh_token", refreshToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  const studentLogin = async (code: string) => {
    const res = await api.post("/auth/student-login", { code });
    const { token: newToken, refreshToken, ...userData } = res.data;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("fitpro_token", newToken);
    if (refreshToken) localStorage.setItem("fitpro_refresh_token", refreshToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("fitpro_token");
    localStorage.removeItem("fitpro_refresh_token");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, studentLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);