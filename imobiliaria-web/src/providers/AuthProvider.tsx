import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
  userEmail: string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(
    localStorage.getItem("auth_email")
  );

  const isAuthenticated = !!userEmail;

  const login = (email: string) => {
    setUserEmail(email);
    localStorage.setItem("auth_email", email);
  };

  const logout = () => {
    setUserEmail(null);
    localStorage.removeItem("auth_email");
  };

  const value = useMemo(
    () => ({ isAuthenticated, login, logout, userEmail }),
    [isAuthenticated, userEmail]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be inside AuthProvider");
  return ctx;
}
