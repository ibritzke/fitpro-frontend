import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

export type UserRole = "ADMIN" | "TRAINER" | "STUDENT";

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  photoUrl?: string;
  logoUrl?: string;
  trainerId?: string;
}


interface AuthContextData {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  studentLogin: (code: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("fitpro_token");
    if (storedToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      setToken(storedToken);
      refreshUser().finally(() => setLoading(false));
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
    <AuthContext.Provider value={{ user, token, loading, login, studentLogin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);