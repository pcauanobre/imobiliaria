import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "../../components/ui/Card";
import "./login.css";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(4, "Mín. 4 caracteres"),
  remember: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
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
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Credenciais inválidas.");
        if (res.status === 403) throw new Error("Usuário inativo.");
        throw new Error("Falha ao autenticar.");
      }

      // Resposta: { id, nome, email, role }
      const user = await res.json();
      localStorage.setItem("auth:user", JSON.stringify(user));
      // redireciona
      window.location.href = "/dashboard";
    } catch (err: any) {
      alert(err.message || "Erro inesperado ao entrar.");
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <Card>
          <div className="col" style={{ gap: 16 }}>
            <div>
              <div className="title">Olá! 👋</div>
              <div className="subtitle">Acesse para entrar no painel da imobiliária.</div>
            </div>

            <form className="col" onSubmit={handleSubmit(onSubmit)}>
              <div className="col">
                <label className="small">E-mail</label>
                <input
                  className="input"
                  placeholder="admin@imobiliaria.com"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="small" style={{ color: "#fca5a5" }}>
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="col">
                <label className="small">Senha</label>
                <input
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="small" style={{ color: "#fca5a5" }}>
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="row" style={{ justifyContent: "space-between" }}>
                <label className="row small" style={{ gap: 8 }}>
                  <input type="checkbox" {...register("remember")} />
                  Lembrar de mim
                </label>

                <button
                  type="button"
                  className="link-btn small"
                  onClick={() => alert("Fluxo fictício: enviaria e-mail de redefinição.")}
                >
                  Esqueci minha senha
                </button>
              </div>

              <button className="btn" disabled={isSubmitting}>
                {isSubmitting ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="hr" />
            <div className="small">
              * Ao entrar, os dados do usuário retornados pela API são salvos em <code>localStorage</code>.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
