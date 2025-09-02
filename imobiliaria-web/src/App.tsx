// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./providers/AuthProvider";

import ErrorBoundary from "./components/ErrorBoundary";
import SidebarLayout from "./components/layout/SidebarLayout";

import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ProprietariosPage from "./pages/Proprietarios/ProprietariosPage";
import { ImovelDetalheView } from "./pages/Proprietarios/ImoveisPage"; // ⬅️ apenas o export nomeado

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
                  <ProprietariosPage />
                </SidebarLayout>
              </Private>
            }
          />

          {/* detalhe com slug */}
          <Route
            path="/proprietarios/:slug"
            element={
              <Private>
                <SidebarLayout>
                  <ProprietariosPage />
                </SidebarLayout>
              </Private>
            }
          />

          {/* aba Imóveis (usa ProprietariosPage, que decide renderizar ImoveisPage internamente) */}
          <Route
            path="/proprietarios/:slug/imoveis"
            element={
              <Private>
                <SidebarLayout>
                  <ProprietariosPage />
                </SidebarLayout>
              </Private>
            }
          />

          {/* detalhe do imóvel */}
          <Route
            path="/proprietarios/:slug/imoveis/:imovelId"
            element={
              <Private>
                <SidebarLayout>
                  <ImovelDetalheView />
                </SidebarLayout>
              </Private>
            }
          />

          <Route
            path="/alertas"
            element={
              <Private>
                <SidebarLayout>
                  <div className="p-4">[Alertas]</div>
                </SidebarLayout>
              </Private>
            }
          />
          <Route
            path="/config"
            element={
              <Private>
                <SidebarLayout>
                  <div className="p-4">[Configurações]</div>
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
