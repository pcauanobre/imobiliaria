import { useAuth } from "../../hooks/useAuth";

export default function DashboardPage() {
  const { userEmail, logout } = useAuth();

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p className="subtitle">Bem-vindo(a){userEmail ? `, ${userEmail}` : ""}!</p>

      <div style={{ marginTop: 16 }}>
        <button className="btn" onClick={logout}>Sair</button>
      </div>

      <div className="hr" />

      <p className="small">
        Aqui iremos colocar os cartões (Proprietários, Imóveis, Inquilinos, Contratos Ativos) e a lista de alertas.
      </p>
    </div>
  );
}
