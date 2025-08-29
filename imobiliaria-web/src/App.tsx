import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./providers/AuthProvider";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import ErrorBoundary from "./components/ErrorBoundary";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import SidebarLayout from "./components/layout/SidebarLayout"; // <- layout correto

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
                <SidebarLayout>
                  <DashboardPage />
                </SidebarLayout>
              </Private>
            }
          />
          <Route
            path="/proprietarios"
            element={
              <Private>
                <SidebarLayout>
                  <div style={{ padding: 16 }}>[Proprietários]</div>
                </SidebarLayout>
              </Private>
            }
          />
          <Route
            path="/alertas"
            element={
              <Private>
                <SidebarLayout>
                  <div style={{ padding: 16 }}>[Alertas]</div>
                </SidebarLayout>
              </Private>
            }
          />
          <Route
            path="/config"
            element={
              <Private>
                <SidebarLayout>
                  <div style={{ padding: 16 }}>[Configurações]</div>
                </SidebarLayout>
              </Private>
            }
          />

          <Route path="*" element={<div style={{ padding: 24 }}>404</div>} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
