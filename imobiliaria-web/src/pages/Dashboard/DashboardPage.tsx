import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="container" style={{ padding: 24 }}>
      <h1 className="title">Dashboard</h1>

      <p className="subtitle" style={{ marginBottom: 8 }}>
        {user
          ? <>Você já está logado {user?.nome ? <>como <strong>{user.nome}</strong></> : "em uma conta"} {user?.role && `(${user.role})`}.<br />Por isso te trouxemos direto pra cá :)</>
          : "Você não está logado."}
      </p>

      <div style={{ marginTop: 16, display: "flex", gap: 16, alignItems: "center" }}>
        <button className="btn" onClick={logout}>
          Desvincular / Logout
        </button>
        <Link to="/register">Ir para cadastro</Link>
      </div>

      <div className="hr" />
      <p className="small">Aqui irão os cartões e alertas.</p>
    </div>
  );
}
