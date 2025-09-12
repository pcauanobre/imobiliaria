// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./providers/AuthProvider";

import ErrorBoundary from "./components/ErrorBoundary";
import SidebarLayout from "./components/layout/SidebarLayout";

// Páginas
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ProprietariosPage from "./pages/Proprietarios/ProprietariosPage";

// Nova estrutura: o wrapper que decide Lista x Detalhe de Imóveis
import ImoveisPage from "./pages/Proprietarios/Imoveis/ImoveisPage.tsx";

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

          {/* Público */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Dashboard */}
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

          {/* Proprietários (lista) */}
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

          {/* Detalhe do proprietário (usa a própria ProprietariosPage para decidir a aba) */}
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

          {/* Imóveis do proprietário (wrapper decide: lista x detalhe) */}
          <Route
            path="/proprietarios/:slug/imoveis"
            element={
              <Private>
                <SidebarLayout>
                  <ImoveisPage />
                </SidebarLayout>
              </Private>
            }
          />
          <Route
            path="/proprietarios/:slug/imoveis/:imovelId"
            element={
              <Private>
                <SidebarLayout>
                  <ImoveisPage />
                </SidebarLayout>
              </Private>
            }
          />
          <Route
            path="/proprietarios/:slug/imoveis/:imovelId/docs"
            element={
              <Private>
                <SidebarLayout>
                  <ImoveisPage />
                </SidebarLayout>
              </Private>
            }
          />
          <Route
            path="/proprietarios/:slug/imoveis/:imovelId/fotos"
            element={
              <Private>
                <SidebarLayout>
                  <ImoveisPage />
                </SidebarLayout>
              </Private>
            }
          />

          {/* Outras rotas simples (placeholders) */}
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

          {/* 404 */}
          <Route path="*" element={<div style={{ padding: 24 }}>404</div>} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
