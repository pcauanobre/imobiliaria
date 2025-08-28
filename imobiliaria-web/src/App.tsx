import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./providers/AuthProvider";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import ErrorBoundary from "./components/ErrorBoundary";

function Dashboard() {
  const ctx = useContext(AuthContext);
  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Bem-vindo, {ctx?.user?.nome ?? "usuário"} ({ctx?.user?.role ?? "?"})</p>
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button onClick={() => ctx?.logout()}>Sair</button>
        <Link to="/register">Ir para cadastro</Link>
      </div>
    </div>
  );
}

function Private({ children }: { children: React.ReactNode }) {
  const ctx = useContext(AuthContext);
  if (!ctx?.user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <Private>
                <Dashboard />
              </Private>
            }
          />
          <Route path="*" element={<div style={{ padding: 24 }}>404</div>} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
