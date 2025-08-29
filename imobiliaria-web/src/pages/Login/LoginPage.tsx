import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(4, "Mín. 4 caracteres"),
  remember: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showRecover, setShowRecover] = useState(false);
  const { user, setUser } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });

  if (user) return <Navigate to="/dashboard" replace />;

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch(`${API}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Credenciais inválidas.");
        if (res.status === 403) throw new Error("Usuário inativo.");
        throw new Error("Falha ao autenticar.");
      }
      const userJson = await res.json();
      setUser(userJson);
      window.location.href = "/dashboard";
    } catch (err: any) {
      alert(err.message || "Erro inesperado ao entrar.");
    }
  }

  return (
    <div className="login-root">
      <style>{`
:root{
  --bg:#f5f7fb;
  --text:#0f172a;
  --muted:#64748b;
  --card:#ffffff;
  --ring:0 0 0 3px rgba(11,19,33,.35);
  --brand:#0B1321;       /* Azul escuro igual dashboard */
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

.login-root{min-height:100%;display:flex;flex-direction:column}

/* ===== HEADER ===== */
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
  box-shadow:0 2px 10px rgba(11,19,33,.35);color:#fff
}
.icon{width:24px;height:24px}
.brand-text{line-height:1.05}
.brand-sub{display:block;font-size:13px;color:#475569}
.brand-title{display:block;font-size:18px;font-weight:700;color:var(--brand)}
.header-nav{display:none;gap:28px}
@media (min-width: 768px){ .header-nav{display:flex} }
.muted-link{font-size:15px;color:var(--brand)}
.muted-link:hover{filter:brightness(.9)}

/* ===== MAIN ===== */
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

.center-wrap{
  width:clamp(300px, 92vw, 475px);
  margin:0 auto;
}

/* ===== CARD LOGIN ===== */
.card{
  background:var(--card);
  border-radius:24px;
  padding:28px;
  box-shadow:var(--shadow);
  border:1px solid rgba(2,6,23,.06);
}
.login-card h1{margin:0 0 8px 0;font-size:32px;font-weight:800;letter-spacing:-0.01em}
.login-card p{margin:0;color:var(--muted);font-size:16px}
.card-head{margin-bottom:24px}

/* ===== CAMPOS ===== */
.field{margin-bottom:18px}
.field label{display:block;font-size:16px;font-weight:700;margin-bottom:10px;color:#334155}

.input{
  width:100%;
  border:1px solid #cbd5e1;
  background:#fff;
  padding:16px 18px;
  border-radius:14px;
  font-size:17px;
  color:#0f172a;
  outline:none;
  box-shadow:0 1px 0 rgba(0,0,0,.02);
  transition:border .15s, box-shadow .15s;
}
.input:focus{box-shadow:var(--ring);border-color:#94a3b8}

.field-error{display:block;margin-top:6px;color:#ef4444;font-size:13px}

/* ===== AÇÕES ===== */
.link{background:none;border:0;color:var(--brand);cursor:pointer}
.link.tiny{font-size:14px}
.link:hover{filter:brightness(.95)}

.options{
  display:flex;align-items:center;justify-content:flex-start;
  margin:14px 0 18px;
}
.remember{font-size:15px;color:#475569;display:inline-flex;gap:10px;align-items:center}
.remember input[type=checkbox]{accent-color:var(--brand);}

/* Botão enviar */
.btn-primary{
  width:auto;
  min-width:180px;
  background:var(--brand);
  color:#fff;
  border:0;border-radius:14px;
  padding:12px 20px;
  font-weight:800;font-size:16.5px;
  cursor:pointer;
  box-shadow:0 10px 22px rgba(11,19,33,.25);
  transition:filter .15s, transform .05s;
  display:block;
  margin:0 auto;
}
.btn-primary:hover{filter:brightness(1.1)}
.btn-primary:active{transform:scale(.99)}
.btn-primary:disabled{opacity:.7;cursor:not-allowed}

/* Links abaixo do botão */
.post-actions{
  margin-top:14px;
  display:grid;
  gap:8px;
  justify-items:center;
}
.post-actions .link,
.post-actions .muted-link{
  font-size:15px;
  color:var(--brand);
}
.post-actions .muted-link strong{
  font-weight:700;
}

/* ===== MODAL ===== */
.modal-backdrop{
  position:fixed;inset:0;background:rgba(0,0,0,.42);
  display:flex;align-items:center;justify-content:center;padding:16px;z-index:50
}
.modal{
  width:100%;max-width:520px;background:#fff;border-radius:18px;padding:20px;
  border:1px solid rgba(2,6,23,.06);box-shadow:var(--shadow)
}
.modal-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.icon-btn{background:none;border:0;font-size:20px;line-height:1;cursor:pointer;color:#64748b}
.modal-form{display:grid;gap:12px;margin-top:12px}
.modal-actions{margin-top:8px;display:flex;gap:10px;justify-content:flex-end}
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
          <section className="card login-card">
            <div className="card-head">
              <h1>Faça login</h1>
              <p>Acesse o painel administrativo da imobiliária.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="nome@empresa.com"
                  autoComplete="username"
                  {...register("email")}
                />
                {errors.email && <span className="field-error">{errors.email.message}</span>}
              </div>

              <div className="field">
                <label htmlFor="password">Senha</label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                />
                {errors.password && <span className="field-error">{errors.password.message}</span>}
              </div>

              <div className="options">
                <label className="remember">
                  <input type="checkbox" {...register("remember")} /> Lembrar de mim neste dispositivo
                </label>
              </div>

              <button className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Entrando..." : "Entrar"}
              </button>

              {/* Links embaixo */}
              <div className="post-actions">
                <button
                  type="button"
                  className="link tiny"
                  onClick={() => setShowRecover(true)}
                >
                  Esqueci minha senha
                </button>
                <a className="muted-link" href="/register">
                  Não tem conta? <strong>Registre-se</strong>
                </a>
              </div>
            </form>
          </section>
        </div>
      </main>

      {/* MODAL */}
      {showRecover && (
        <section
          className="modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && setShowRecover(false)}
        >
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="recuperar-title">
            <div className="modal-head">
              <h3 id="recuperar-title">Recuperar senha</h3>
              <button className="icon-btn" onClick={() => setShowRecover(false)} aria-label="Fechar">
                ✕
              </button>
            </div>
            <p className="muted">Informe seu e-mail para receber o link de redefinição.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Protótipo: enviaria e-mail de redefinição.");
                setShowRecover(false);
              }}
              className="modal-form"
            >
              <label htmlFor="rec-email">E-mail</label>
              <input id="rec-email" type="email" className="input" placeholder="voce@exemplo.com" />
              <div className="modal-actions">
                <button type="button" className="btn-muted" onClick={() => setShowRecover(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary small">Enviar link</button>
              </div>
              <p className="tiny muted">* Protótipo: ação não envia e-mail.</p>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}
