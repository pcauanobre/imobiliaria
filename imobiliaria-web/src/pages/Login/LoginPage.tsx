import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./login.css";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(4, "Mín. 4 caracteres"),
  remember: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showRecover, setShowRecover] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });

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

      const user = await res.json();
      localStorage.setItem("auth:user", JSON.stringify(user));
      window.location.href = "/dashboard";
    } catch (err: any) {
      alert(err.message || "Erro inesperado ao entrar.");
    }
  }

  return (
    <div className="login-root">
      {/* HEADER (mantido) */}
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

      {/* MAIN CENTRALIZADO */}
      <main className="site-main center-wrap">
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
              <div className="field-row">
                <label htmlFor="password">Senha</label>
                <button
                  type="button"
                  className="link tiny"
                  onClick={() => setShowRecover(true)}
                >
                  Esqueci minha senha
                </button>
              </div>
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
              <a className="muted-link" href="/register">Criar conta</a>
            </div>

            <button className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </section>
      </main>

      {/* MODAL RECUPERAR SENHA */}
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
