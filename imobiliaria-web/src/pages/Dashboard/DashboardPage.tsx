import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="container" style={{ padding: 24 }}>
      <h1 className="title">Dashboard</h1>
      <p className="subtitle">
        Bem-vindo{user?.nome ? `, ${user.nome}` : ""} {user?.role ? `(${user.role})` : ""}.
      </p>

      <div style={{ marginTop: 16, display: "flex", gap: 16 }}>
        <button className="btn" onClick={logout}>Sair</button>
        <Link to="/register">Ir para cadastro</Link>
      </div>

      <div className="hr" />
      <p className="small">Aqui irão os cartões e alertas.</p>
    </div>
  );
}
