import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      // futuras rotas protegidas aqui...
    ],
  },
  { path: "*", element: <Navigate to="/login" replace /> },
]);
