import type { PageResp, Proprietario } from "./types";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function listProprietarios(): Promise<Proprietario[]> {
  const res = await fetch(`${API_BASE}/api/v1/proprietarios`);
  if (!res.ok) throw new Error("Erro ao carregar");
  const data: PageResp<Proprietario> = await res.json();
  return Array.isArray(data) ? data : (data.content ?? []);
}

export async function getProprietario(id: number): Promise<Proprietario> {
  const res = await fetch(`${API_BASE}/api/v1/proprietarios/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar detalhes");
  return res.json();
}

export async function createProprietario(p: Proprietario): Promise<void> {
  const payload = {
    nome: p.nome,
    doc: (p.doc ?? "").replace(/\D/g, ""),
    email: p.email || null,
    tel: p.tel || null,
    obs: p.obs || null,
  };
  const res = await fetch(`${API_BASE}/api/v1/proprietarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  await res.json().catch(() => ({}));
}

export async function updateProprietario(p: Proprietario): Promise<void> {
  if (!p.id) throw new Error("ID ausente");
  const payload = {
    nome: p.nome,
    doc: (p.doc ?? "").replace(/\D/g, ""),
    email: p.email || null,
    tel: p.tel || null,
    obs: p.obs || null,
  };
  const res = await fetch(`${API_BASE}/api/v1/proprietarios/${p.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  await res.json().catch(() => ({}));
}

export async function deleteProprietario(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/v1/proprietarios/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
