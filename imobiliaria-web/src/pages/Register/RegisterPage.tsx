import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
type Role = "ADMIN" | "ATENDENTE";

export default function RegisterPage() {
  const nav = useNavigate();
  const { setUser } = useAuth();

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

      // Não autentica automaticamente
      localStorage.removeItem("auth:user");
      setUser(null);
      nav("/login", { replace: true, state: { registered: true } });
    } catch (err: any) {
      setError(err.message || "Falha ao cadastrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-root">
      <style>{`
:root{
  --bg:#f5f7fb;
  --text:#0f172a;
  --muted:#64748b;
  --card:#ffffff;
  --ring:0 0 0 3px rgba(11,19,33,.25);
  --brand:#0B1321;        /* mesmo azul do dashboard */
  --border:#e2e8f0;
  --shadow:0 14px 40px rgba(2,6,23,.12);
}

*{box-sizing:border-box}
html,body,#root{height:100%}
body{
  margin:0;
  font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;
  background:var(--bg);
  color:var(--text);
  -webkit-font-smoothing:antialiased;
}
a{text-decoration:none;color:inherit}

.register-root{min-height:100%;display:flex;flex-direction:column}

/* ===== HEADER (mesmo padrão do Login) ===== */
.site-header{padding:28px 0}
.header-inner{
  width:100%;
  margin:0;
  padding:0 24px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.brand{display:inline-flex;gap:14px;align-items:center}
.brand-logo{
  height:46px;width:46px;border-radius:14px;background:var(--brand);
  display:inline-flex;align-items:center;justify-content:center;
  box-shadow:0 2px 10px rgba(11,19,33,.25);color:#fff
}
.icon{width:24px;height:24px}
.brand-text{line-height:1.05}
.brand-sub{display:block;font-size:13px;color:#475569}
.brand-title{display:block;font-size:18px;font-weight:700;color:var(--brand)}
.header-nav{display:none;gap:28px}
@media (min-width: 768px){ .header-nav{display:flex} }
.muted-link{font-size:15px;color:var(--brand);opacity:.95}
.muted-link:hover{opacity:1}

/* ===== MAIN centralizado ===== */
.site-main{
  min-height:calc(100vh - 112px);
  display:grid;
  place-items:center;
  padding:28px 16px;
  position:relative;
}
.site-main::before{
  content:"";
  position:absolute;inset:0;z-index:-1;
  background-image:radial-gradient(circle at 1px 1px, rgba(17,24,39,.08) 1px, transparent 0);
  background-size:26px 26px;
}

/* largura confortável p/ 2 colunas sem ficar "retângulo" */
.center-wrap{
  width:clamp(320px, 94vw, 960px);
  margin:0 auto;
}

/* ===== CARD ===== */
.card{
  background:var(--card);
  border-radius:24px;            /* cantos suaves como no login */
  padding:28px;
  box-shadow:var(--shadow);
  border:1px solid rgba(2,6,23,.06);
}

.register-card h1{margin:0 0 8px 0;font-size:32px;font-weight:800;letter-spacing:-0.01em}
.register-card p{margin:0;color:var(--muted);font-size:16px}
.card-head{margin-bottom:24px}

/* ===== GRID 2 colunas (stack no mobile) ===== */
.grid-2{
  display:grid;
  grid-template-columns:1fr;
  gap:18px;
}
@media (min-width: 900px){
  .grid-2{ grid-template-columns:1fr 1fr; gap:20px; }
}

/* Fieldset/grupo */
.group{
  border:1px solid var(--border);
  border-radius:16px;
  padding:16px;
  background:#fff;
}
.group > legend{
  font-size:14px;
  font-weight:700;
  color:var(--brand);
  padding:0 6px;
}

/* ===== CAMPOS ===== */
.field{margin-bottom:16px}
.field:last-child{margin-bottom:0}
.field label{
  display:block;
  font-size:16px;
  font-weight:700;
  margin-bottom:10px;
  color:#334155;
}
.input, select.input{
  width:100%;
  border:1px solid #cbd5e1;
  background:#fff;
  padding:16px 18px;
  border-radius:14px;
  font-size:16.5px;
  color:#0f172a;
  outline:none;
  box-shadow:0 1px 0 rgba(0,0,0,.02);
  transition:border .15s, box-shadow .15s;
  appearance:none;
}
.input:focus, select.input:focus{box-shadow:var(--ring);border-color:#94a3b8}
.field-error{display:block;margin-top:8px;color:#ef4444;font-size:13px}

/* ===== AÇÕES ===== */
.form-actions{
  margin-top:22px;
  padding-top:18px;
  border-top:1px solid var(--border);
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:10px;
}

/* Botão principal (mesma proporção do login) */
.btn-primary{
  width:auto;
  min-width:200px;
  background:var(--brand);
  color:#fff;
  border:0;border-radius:14px;
  padding:12px 20px;
  font-weight:800;font-size:16.5px;
  cursor:pointer;
  box-shadow:0 10px 22px rgba(11,19,33,.18);
  transition:filter .15s, transform .05s;
}
.btn-primary:hover{filter:brightness(.97)}
.btn-primary:active{transform:scale(.99)}
.btn-primary:disabled{opacity:.7;cursor:not-allowed}

/* Link abaixo (igual login: cor do brand) */
.below-text-inline{
  font-size:14.5px;
  color:var(--muted);
  text-align:center;
}
.below-text-inline .link{
  color:var(--brand);
  font-weight:800; /* destaque no link 'Entrar' */
}
.below-text-inline .link:hover{filter:brightness(.95)}

/* Dark friendly para o fieldset */
@media (prefers-color-scheme: dark){
  .group{background:#ffffff; border-color:#e6e8ee}
  .header-inner .brand-title{color:var(--brand)}
}
      `}</style>

      {/* HEADER */}
      <header className="site-header">
        <div className="header-inner">
          <a href="/" className="brand" aria-label="Página inicial">
            <span className="brand-logo">
              <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
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

      {/* MAIN */}
      <main className="site-main">
        <div className="center-wrap">
          <section className="card register-card">
            <div className="card-head">
              <h1>Criar conta</h1>
              <p>Preencha os dados para acessar o painel.</p>
            </div>

            <form onSubmit={onSubmit} className="register-form">
              <div className="grid-2">
                {/* Coluna esquerda */}
                <fieldset className="group">
                  <legend>Dados pessoais</legend>

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
                </fieldset>

                {/* Coluna direita */}
                <fieldset className="group">
                  <legend>Segurança</legend>

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
                </fieldset>
              </div>

              {/* AÇÕES */}
              <div className="form-actions">
                <button className="btn-primary" type="submit" disabled={loading}>
                  {loading ? "Criando..." : "Criar conta"}
                </button>

                <p className="below-text-inline">
                  Já tem conta?{" "}
                  <Link className="link" to="/login">
                    Entrar
                  </Link>
                </p>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
