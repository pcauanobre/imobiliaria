// Lista de imóveis de um proprietário (sem fallback ?ownerId=)

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import AddImovelModal from "./components/AddImovelModal";
import ConfirmDeleteDialog from "../Detail/components/ConfirmDeleteDialog";
import SuccessDialog from "../Detail/components/SuccessDialog";

/* ============================================================
   CSS — mesmo look&feel utilizado nas telas
   ============================================================ */
const css = `
:root{
  --bg:#f5f7fb; --card:#fff; --text:#0f172a; --muted:#64748b; --brand:#0B1321;
  --border:#e2e8f0; --ring:0 0 0 3px rgba(11,19,33,.22); --shadow:0 14px 40px rgba(2,6,23,.08);
}
.page{ padding:24px }
.header{ display:flex; align-items:center; justify-content:space-between; margin-bottom:8px }
.breadcrumb{ color:var(--muted); font-size:14px; margin-bottom:24px }
.breadcrumb a{ color:inherit; text-decoration:none }
.breadcrumb-active{ font-weight:700; color:var(--brand) }

.input{ width:100%; background:#fff; border:1px solid var(--border); border-radius:14px; padding:12px 14px; font-size:15.5px; outline:none }
.input:focus{ box-shadow:var(--ring); border-color:#94a3b8 }

.card{ background:var(--card); border:1px solid rgba(2,6,23,.06); border-radius:22px; box-shadow:var(--shadow) }
.cardhead{ display:flex; justify-content:space-between; align-items:flex-start; padding:18px 20px; border-bottom:1px solid var(--border) }
.cardhead h2{ margin:0 0 2px; font-size:20px }
.cardhead p{ margin:0; color:var(--muted); font-size:13.5px }

.tablewrap{ overflow:auto }
.table{ width:100%; border-collapse:separate; border-spacing:0 }
.table thead th{ background:#f8fafc; text-align:left; font-size:12.5px; letter-spacing:.03em; color:#475569; padding:12px 16px; border-bottom:1px solid var(--border) }
.table tbody td{ padding:12px 16px; border-bottom:1px solid #eef2f7; font-size:15px }
.table tbody tr:hover{ background:#fafafa }

.rowact{ display:flex; gap:8px; justify-content:center }
.iconbtn{ border:0; background:transparent; padding:8px; border-radius:12px; cursor:pointer; text-decoration:none; color:inherit }
.iconbtn:hover{ background:#f1f5f9 }

.tabbar{ display:flex; gap:8px; padding:12px 18px 18px; border-bottom:1px solid var(--border) }
.tab{ border:1px solid #e2e8f0; background:#fff; border-radius:999px; padding:8px 14px; font-weight:600; font-size:14px; color:#475569; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center }
.tab:hover{ background:#f1f5f9 }
.tab.active{ background:var(--brand); border-color:var(--brand); color:#fff }

.backline{ margin-top:10px; margin-bottom:18px }
.backbtn{ display:inline-flex; align-items:center; gap:8px; font-weight:800; color:var(--text);
  background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:10px 14px; cursor:pointer; text-decoration:none }
.backbtn:hover{ background:#f8fafc }
.backbtn svg{ display:block }

.btn-add{
  background:#0B132B; color:#fff; border:0; border-radius:12px; padding:10px 18px;
  font-size:14px; font-weight:500; cursor:pointer; box-shadow:0 2px 4px rgba(0,0,0,.08); transition:background .2s ease;
}
.btn-add:hover{ background:#1C2541 }

/* pill-link igual ao do Proprietário */
.pill-link {
  display:inline-block;
  padding:6px 12px;
  background:#f8fafc;
  border:1px solid #e2e8f0;
  border-radius:12px;
  font-weight:600;
  font-size:14px;
  color:#0f172a;
  text-decoration:none;
  transition:background .2s ease;
}
.pill-link:hover { background:#f1f5f9 }
`;

/* ============================================================
   Tipos
   ============================================================ */
type Proprietario = {
  id?: number;
  nome: string;
  doc: string;
  email?: string | null;
  tel?: string | null;
  obs?: string | null;
};

type Imovel = {
  id?: number;
  end?: string | null;
  tipo?: string | null;
  situacao?: string | null;
  obs?: string | null;

  finalidade?: string | null;
  cep?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;

  area?: number | null;
  quartos?: number | null;
  banheiros?: number | null;
  vagas?: number | null;
  iptu?: number | null;
  condominio?: number | null;
  anoConstrucao?: number | null;
  disponivelEm?: string | null; // yyyy-MM-dd
};

/* ============================================================
   API helpers
   ============================================================ */
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function getProprietario(id: number): Promise<Proprietario> {
  const res = await fetch(`${API_BASE}/api/v1/proprietarios/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar proprietário");
  return res.json();
}

async function listImoveisByOwner(ownerId: number): Promise<Imovel[]> {
  // ✅ única rota usada
  const res = await fetch(`${API_BASE}/api/v1/proprietarios/${ownerId}/imoveis`);
  if (!res.ok) throw new Error("Erro ao listar imóveis");
  const data = await res.json();
  const arr: any[] = Array.isArray(data) ? data : (data?.content ?? []);
  return arr.map((d) => ({ ...d, end: d.endereco ?? d.end ?? null })) as Imovel[];
}

async function deleteImovel(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/v1/imoveis/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

/* ============================================================
   Página
   ============================================================ */
export default function OwnerImoveisListPage() {
  const { slug } = useParams();
  const nav = useNavigate();
  const location = useLocation() as { state?: { owner?: Proprietario } };

  const [owner, setOwner] = useState<Proprietario | null | undefined>(location.state?.owner ?? undefined);
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [toDelete, setToDelete] = useState<number | null>(null);

  const ownerId = (() => {
    if (!slug) return undefined;
    const parts = decodeURIComponent(slug).split("-");
    const id = Number(parts[parts.length - 1]);
    return Number.isFinite(id) ? id : undefined;
  })();

  useEffect(() => {
    if (!slug || !ownerId) {
      nav("/proprietarios", { replace: true });
      return;
    }
    (async () => {
      try {
        if (!owner) {
          const dto = await getProprietario(ownerId);
          setOwner(dto);
        }
        setLoading(true);
        const items = await listImoveisByOwner(ownerId);
        setImoveis(items);
      } catch (e) {
        console.error(e);
        setImoveis([]);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, ownerId]);

  const filtrados = useMemo(() => {
    const w = q.trim().toLowerCase();
    if (!w) return imoveis;
    return imoveis.filter((i) =>
      (i.end ?? "").toLowerCase().includes(w) ||
      (i.tipo ?? "").toLowerCase().includes(w) ||
      (i.situacao ?? "").toLowerCase().includes(w)
    );
  }, [imoveis, q]);

  const dadosHref = `/proprietarios/${slug}`;
  const imoveisHref = `/proprietarios/${slug}/imoveis`;

  return (
    <div className="page">
      <style>{css}</style>

      <div className="header">
        <div className="breadcrumb">
          <Link to="/dashboard">Dashboard</Link> /{" "}
          <Link to="/proprietarios">Proprietários</Link> /{" "}
          {owner ? (
            <>
              <Link to={dadosHref}>{owner.nome}</Link> /{" "}
              <span className="breadcrumb-active">Imóveis</span>
            </>
          ) : (
            <span className="breadcrumb-active">Imóveis</span>
          )}
        </div>
        <div/>
      </div>

      <section className="card">
        <div className="cardhead">
          <div>
            <div className="backline">
              {/* 🔙 Volta para lista de Proprietários */}
              <button
                className="backbtn"
                onClick={() => nav("/proprietarios", { replace: true })}
                title="Voltar para Proprietários"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Voltar
              </button>
            </div>
            <h2>{owner ? `Imóveis de ${owner.nome}` : "Imóveis"}</h2>
            <p>Gerencie os imóveis vinculados a este proprietário.</p>
          </div>

          <button className="btn-add" onClick={() => setAddOpen(true)}>Adicionar imóvel</button>
        </div>

        <div className="tabbar">
          <Link to={dadosHref} className="tab">Dados</Link>
          <span className="tab">Documentos</span>
          <Link to={imoveisHref} className="tab active">Imóveis</Link>
        </div>

        <div style={{ padding: "12px 18px" }}>
          <input
            className="input"
            placeholder="Buscar por endereço, tipo ou situação"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="tablewrap">
          <table className="table">
            <thead>
              <tr>
                <th>ENDEREÇO</th>
                <th>TIPO</th>
                <th>SITUAÇÃO</th>
                <th style={{ textAlign: "center" }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
                    Carregando...
                  </td>
                </tr>
              ) : filtrados.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
                    Nenhum imóvel encontrado.
                  </td>
                </tr>
              ) : (
                filtrados.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <Link
                        to={`${imoveisHref}/${i.id}`}
                        className="pill-link"
                        state={{ owner, imovel: i }}
                        title="Abrir detalhes do imóvel"
                      >
                        {i.end || "(sem endereço)"}
                      </Link>
                    </td>
                    <td>{i.tipo || "-"}</td>
                    <td>{i.situacao || "-"}</td>
                    <td>
                      <div className="rowact">
                        <Link
                          className="iconbtn"
                          title="Abrir imóvel"
                          to={`${imoveisHref}/${i.id}`}
                          state={{ owner, imovel: i }}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                            <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                        <button
                          className="iconbtn"
                          title="Excluir"
                          onClick={() => { setToDelete(i.id!); setConfirmOpen(true); }}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                              d="M3 6h18M9 6v12m6-12v12M10 6l1-2h2l1 2M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modais */}
      <AddImovelModal
        open={addOpen && !!owner && !!ownerId}
        onClose={() => setAddOpen(false)}
        ownerName={owner?.nome ?? ""}
        ownerId={ownerId ?? 0}
        onSaved={async () => {
          if (!ownerId) return;
          const items = await listImoveisByOwner(ownerId);
          setImoveis(items);
        }}
      />

      <ConfirmDeleteDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          if (!toDelete) return;
          await deleteImovel(toDelete);
          setConfirmOpen(false);
          setToDelete(null);
          if (ownerId) {
            const items = await listImoveisByOwner(ownerId);
            setImoveis(items);
          }
          setSuccessOpen(true);
        }}
      />

      <SuccessDialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        message="🗑️ Imóvel excluído com sucesso."
      />
    </div>
  );
}
