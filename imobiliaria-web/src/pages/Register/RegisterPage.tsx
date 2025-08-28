import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import "./register.css";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

type Role = "ADMIN" | "ATENDENTE";

export default function RegisterPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    password: "",
    confirm: "",
    role: "ATENDENTE" as Role,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

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
        const msg = res.status === 400 ? "E-mail já cadastrado." : "Erro ao cadastrar.";
        throw new Error(msg);
      }

      // Resposta: { id, nome, email, role }
      const user = await res.json();
      localStorage.setItem("auth:user", JSON.stringify(user)); // guarda sessão simples
      nav("/dashboard");
    } catch (err: any) {
      setError(err.message || "Falha ao cadastrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card>
        <h1 className="text-xl font-semibold mb-2">Criar conta</h1>
        <p className="text-sm text-slate-600 mb-6">Preencha os dados para acessar o painel.</p>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Nome</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">E-mail</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Perfil</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
            >
              <option value="ATENDENTE">Atendente</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Senha</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Confirmar senha</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
              minLength={6}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white rounded-lg py-2 font-medium hover:opacity-95 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <p className="text-sm text-slate-600 mt-4">
          Já tem conta?{" "}
          <Link className="text-indigo-600 hover:text-indigo-800" to="/login">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
