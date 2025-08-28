import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
type Role = "ADMIN" | "ATENDENTE";

export default function RegisterPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nome: "",
    email: "",
    role: "ATENDENTE" as Role,
    password: "",
    confirm: "",
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.nome.trim()) return setError("Informe seu nome.");
    if (form.password.length < 6) return setError("Senha deve ter ao menos 6 caracteres.");
    if (form.password !== form.confirm) return setError("As senhas não conferem.");

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      if (!res.ok) {
        if (res.status === 400) throw new Error("E-mail já cadastrado.");
        throw new Error("Erro ao cadastrar.");
      }

      // Esperado: { id, nome, email, role }
      const user = await res.json();
      localStorage.setItem("auth:user", JSON.stringify(user));
      nav("/dashboard");
    } catch (err: any) {
      setError(err.message || "Falha ao cadastrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-root">
      {/* HEADER (igual da Login) */}
      <header className="site-header">
        <div className="header-inner">
          <a href="/" className="brand" aria-label="Página inicial">
            <span className="brand-logo">
              <svg viewBox="0 0 24 24" className="icon">
                <path
                  d="M3 9.75L12 3l9 6.75M4.5 10.5V21a.75.75 0 00.75.75H9.75V15a2.25 2.25 0 012.25-2.25h0A2.25 2.25 0 0114.25 15v6.75H18.75A.75.75 0 0019.5 21V10.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div className="brand-text">
              <span className="brand-sub">Sistema Imobiliário</span>
              <span className="brand-title">Painel Administrativo</span>
            </div>
          </a>

          <nav className="header-nav">
            <a className="muted-link" href="#acessibilidade">Acessibilidade</a>
            <a className="muted-link" href="#suporte">Suporte</a>
          </nav>
        </div>
      </header>

      {/* MAIN centralizado */}
      <main className="site-main center-wrap">
        <section className="card register-card">
          <div className="card-head">
            <h1>Criar conta</h1>
            <p>Preencha os dados para acessar o painel.</p>
          </div>

          <form onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                className="input"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="voce@empresa.com"
                autoComplete="username"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="role">Perfil</label>
              <select
                id="role"
                className="input"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
              >
                <option value="ATENDENTE">Atendente</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                className="input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                minLength={6}
              />
            </div>

            <div className="field">
              <label htmlFor="confirm">Confirmar senha</label>
              <input
                id="confirm"
                type="password"
                className="input"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Repita a senha"
                autoComplete="new-password"
                required
                minLength={6}
              />
            </div>

            {error && <span className="field-error">{error}</span>}

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar conta"}
            </button>
          </form>

          <p className="below-text">
            Já tem conta?{" "}
            <Link className="link" to="/login">
              Entrar
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
