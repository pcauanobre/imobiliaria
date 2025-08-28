import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "../../components/ui/Card";
import { useAuth } from "../../hooks/useAuth";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(4, "Mín. 4 caracteres"),
  remember: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });

  async function onSubmit(data: FormData) {
    // FICTÍCIO: não chama API real.
    // Apenas "loga" salvando o e-mail no localStorage usando o AuthContext.
    await new Promise((r) => setTimeout(r, 500)); // simula delay
    login(data.email);
    // redireciono via history API
    window.location.href = "/dashboard";
  }

  return (
    <div className="container center">
      <div style={{ width: 380 }}>
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
              * Protótipo: o botão **Entrar** apenas simula login e redireciona para o Dashboard.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
