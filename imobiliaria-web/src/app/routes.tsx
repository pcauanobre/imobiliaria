import { createContext, useEffect, useMemo, useState } from "react";

type User = { id: number; nome: string; email: string; role: "ADMIN" | "ATENDENTE" } | null;

type AuthContextType = {
  user: User;
  setUser: (u: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const raw = localStorage.getItem("auth:user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser: (u: User) => {
        setUser(u);
        if (u) localStorage.setItem("auth:user", JSON.stringify(u));
        else localStorage.removeItem("auth:user");
      },
      logout: () => {
        localStorage.removeItem("auth:user");
        setUser(null);
        window.location.href = "/login";
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
