// src/pages/Proprietarios/ProprietariosListPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AddProprietarioModal from "./Detail/components/AddProprietarioModal";

const css = `
.page { padding:24px }
.header { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px }
.breadcrumb { color:#64748b; font-size:14px; margin-bottom:24px }
.breadcrumb a { color: inherit; text-decoration: none }
.breadcrumb-active { font-weight:700; color:#0B1321 }

.card { background:#fff; border:1px solid rgba(2,6,23,.06); border-radius:22px; box-shadow:0 14px 40px rgba(2,6,23,.08) }
.cardhead { display:flex; justify-content:space-between; align-items:center; padding:18px 20px; border-bottom:1px solid #e2e8f0 }
.cardhead h2 { margin:0 0 2px; font-size:20px }
.cardhead p { margin:0; color:#64748b; font-size:13.5px }

.controls { padding:16px 18px }
.input { width:100%; background:#fff; border:1px solid #e2e8f0; border-radius:14px; padding:12px 14px; font-size:15.5px; outline:none }
.input:focus { box-shadow:0 0 0 3px rgba(11,19,33,.22); border-color:#94a3b8 }

.tablewrap { overflow:auto }
.table { width:100%; border-collapse:separate; border-spacing:0 }
.table thead th { background:#f8fafc; text-align:left; font-size:12.5px; letter-spacing:.03em; color:#475569; padding:12px 16px; border-bottom:1px solid #e2e8f0 }
.table tbody td { padding:12px 16px; border-bottom:1px solid #eef2f7; font-size:15px }
.table tbody tr:hover { background:#fafafa }
.rowact { display:flex; gap:8px; justify-content:flex-end }
.iconbtn { border:0; background:transparent; padding:8px; border-radius:12px; cursor:pointer; color:inherit }
.iconbtn:hover { background:#f1f5f9 }

.btn-add { background:#0B1321; color:#fff; border:0; border-radius:12px; padding:10px 18px; font-size:14px; font-weight:600; cursor:pointer; box-shadow:0 2px 4px rgba(0,0,0,.08); transition:background .2s ease; }
.btn-add:hover { background:#1C2541 }

/* pill do nome (com position:relative pra ancorar a badge) */
.pill-link { position:relative; display:inline-block; padding:6px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; font-weight:600; font-size:14px; color:#0f172a; text-decoration:none; transition:background .2s ease }
.pill-link:hover { background:#f1f5f9 }

/* badge vermelha no canto superior direito da pill */
.badge-dot {
  position:absolute; top:-6px; right:-6px;
  width:14px; height:14px; background:#ef4444;
  border-radius:999px; border:2px solid #fff;
  box-shadow:0 0 0 1px rgba(0,0,0,.08);
}
`;

type Proprietario = {
  id: number;
  nome: string;
  doc?: string | null;
  email?: string | null;
  tel?: string | null;
  obs?: string | null;
};

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function listProprietarios(): Promise<Proprietario[]> {
  const r = await fetch(`${API_BASE}/api/v1/proprietarios`);
  if (!r.ok) throw new Error("Erro ao listar proprietários");
  const data = await r.json();
  const arr: any[] = Array.isArray(data) ? data : (data?.content ?? []);
  // normaliza chaves
  return arr.map(raw => ({
    id: raw.id,
    nome: raw.nome ?? raw.name ?? "",
    doc: raw.doc ?? raw.cpfCnpj ?? raw.cpf ?? null,
    email: raw.email ?? raw.mail ?? null,
    tel: raw.tel ?? raw.telefone ?? null,
    obs: raw.obs ?? raw.observacoes ?? null,
  }));
}

export default function ProprietariosListPage() {
  const [rows, setRows] = useState<Proprietario[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const list = await listProprietarios();
      setRows(list);
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtrados = useMemo(() => {
    const w = q.trim().toLowerCase();
    const base = Array.isArray(rows) ? rows : [];
    if (!w) return base;
    return base.filter(r =>
      r.nome.toLowerCase().includes(w) ||
      (r.doc ?? "").toLowerCase().includes(w) ||
      (r.email ?? "").toLowerCase().includes(w)
    );
  }, [rows, q]);

  return (
    <div className="page">
      <style>{css}</style>

      <div className="header">
        <div className="breadcrumb"><span className="breadcrumb-active">Proprietários</span></div>
      </div>

      <section className="card">
        <div className="cardhead">
          <div>
            <h2>Proprietários</h2>
            <p>Gerencie todos os proprietários cadastrados.</p>
          </div>

          {/* Botão à direita do card */}
          <button className="btn-add" onClick={() => setAddOpen(true)}>
            Adicionar proprietário
          </button>
        </div>

        <div className="controls">
          <input
            className="input"
            placeholder="Buscar por nome, doc ou email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="tablewrap">
          <table className="table">
            <thead>
              <tr>
                <th>NOME</th>
                <th>DOC</th>
                <th>EMAIL</th>
                <th>TELEFONE</th>
                <th style={{ textAlign: "right" }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: 24, color: "#64748b" }}>Carregando…</td></tr>
              ) : filtrados.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 24, color: "#64748b" }}>Nenhum proprietário encontrado.</td></tr>
              ) : (
                filtrados.map(p => {
                  const slug = `${encodeURIComponent((p.nome ?? "proprietario").toString().trim().replace(/\s+/g, "-"))}-${p.id}`;
                  const hasMissing =
                    !(p.nome ?? "").trim() ||
                    !(p.doc ?? "").trim() ||
                    !(p.email ?? "").trim() ||
                    !(p.tel ?? "").trim();

                  return (
                    <tr key={p.id}>
                      <td>
                        <Link to={`/proprietarios/${slug}`} className="pill-link" title={hasMissing ? "Informações faltando" : undefined}>
                          {p.nome || "(sem nome)"}
                          {hasMissing && <span className="badge-dot" aria-hidden="true" />}
                        </Link>
                      </td>
                      <td>{p.doc ?? "-"}</td>
                      <td>{p.email ?? "-"}</td>
                      <td>{p.tel ?? "-"}</td>
                      <td>
                        <div className="rowact">
                          <Link className="iconbtn" to={`/proprietarios/${slug}`} title="Abrir">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                              <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal de criação */}
      <AddProprietarioModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSaved={async () => { setAddOpen(false); await load(); }}
      />
    </div>
  );
}
