// src/app/routes.tsx
import { useEffect, useState } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import { useAuth } from "../hooks/useAuth";

// Protege rotas e hidrata o contexto a partir do localStorage
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useAuth();
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    if (!user) {
      const raw = localStorage.getItem("auth:user");
      if (raw) {
        try {
          setUser(JSON.parse(raw));
        } catch {
          // se der erro no parse, segue sem usuário
        }
      }
    }
    const t = setTimeout(() => setBooting(false), 0);
    return () => clearTimeout(t);
  }, [user, setUser]);

  if (booting) return null; // opcional: um spinner aqui
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Sempre redireciona "/" para "/login"
function IndexRedirect() {
  return <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  { path: "/", element: <IndexRedirect /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <DashboardPage />
      </RequireAuth>
    ),
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
