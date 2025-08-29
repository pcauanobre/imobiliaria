import { createContext, useEffect, useMemo, useState } from "react";

export type Role = "ADMIN" | "ATENDENTE";
export type User = { id: number; nome: string; email: string; role: Role } | null;

type AuthContextType = {
  user: User;
  setUser: (u: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User>(null);

  // Hidrata do localStorage ao iniciar
  useEffect(() => {
    const raw = localStorage.getItem("auth:user");
    if (raw) setUserState(JSON.parse(raw));
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser: (u: User) => {
        setUserState(u);
        if (u) localStorage.setItem("auth:user", JSON.stringify(u));
        else localStorage.removeItem("auth:user");
      },
      logout: () => {
        localStorage.removeItem("auth:user");
        setUserState(null);
        window.location.href = "/login";
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
