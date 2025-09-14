// Detalhe do imóvel com abas dirigidas por URL (Informações / Contratos / Fotos)
// e botão "Editar" no cabeçalho. Mantém o mesmo look & feel do restante.

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import InfoTab from "./tabs/InfoTab";
import ContratosTab from "./tabs/ContratosTab";
import FotosTab from "./tabs/FotosTab";
import EditImovelModal from "../components/EditImovelModal";

/* =====================  CSS  ===================== */
const css = `
:root{
  --bg:#f5f7fb; --card:#fff; --text:#0f172a; --muted:#64748b; --brand:#0B1321;
  --border:#e2e8f0; --ring:0 0 0 3px rgba(11,19,33,.22); --shadow:0 14px 40px rgba(2,6,23,.08);
}
.page{ padding:24px }
.header{ display:flex; align-items:center; justify-content:space-between; margin-bottom:8px }
.breadcrumb{ color:var(--muted); font-size:14px; margin-bottom:24px }
.breadcrumb a{ color:inherit; text-decoration: none }
.breadcrumb-active{ font-weight:700; color:var(--brand) }

.card{ background:var(--card); border:1px solid rgba(2,6,23,.06); border-radius:22px; box-shadow:var(--shadow) }
.cardhead{ display:flex; justify-content:space-between; align-items:flex-start; padding:18px 20px; border-bottom:1px solid var(--border) }
.cardhead h2{ margin:0 0 4px; font-size:20px }
.cardhead p{ margin:0; color:var(--muted); font-size:13.5px }

.tabbar{ display:flex; gap:8px; padding:12px 18px 18px; border-bottom:1px solid var(--border) }
.tab{ border:1px solid #e5e7eb; background:#fff; border-radius:999px; padding:8px 14px; font-weight:600; font-size:14px; color:#475569; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center }
.tab:hover{ background:#f1f5f9 }
.tab.active{ background:var(--brand); border-color:var(--brand); color:#fff }

.body{ padding:16px 18px }

.backline{ margin-top:10px; margin-bottom:18px }
.backbtn{ display:inline-flex; align-items:center; gap:8px; font-weight:800; color:var(--text);
  background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:10px 14px; cursor:pointer; text-decoration:none }
.backbtn:hover{ background:#f8fafc }
.backbtn svg{ display:block }

.fixedbtn{
  border:1px solid var(--brand); background:var(--brand); border-radius:999px;
  padding:8px 16px; font-weight:600; font-size:14px; color:#fff; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; transition:background .2s ease;
}
.fixedbtn:hover{ background:#1C2541 }
`;

/* =====================  Tipos + API  ===================== */
/** Use nome diferente para evitar conflito com o tipo `Imovel` exportado por outras tabs */
type ImovelDTO = {
  id?: number;
  // endereço + localização
  end?: string | null;          // alias interno (endereco/end)
  endereco?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  cep?: string | null;

  // meta
  tipo?: string | null;
  finalidade?: string | null;
  situacao?: string | null;
  obs?: string | null;

  // métricas
  area?: number | null;
  quartos?: number | null;
  banheiros?: number | null;
  vagas?: number | null;
  iptu?: number | null;
  condominio?: number | null;
  anoConstrucao?: number | null;
  disponivelEm?: string | null; // yyyy-MM-dd
};

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function getImovel(id: number): Promise<ImovelDTO> {
  const r = await fetch(`${API_BASE}/api/v1/imoveis/${id}`);
  if (!r.ok) throw new Error("Erro ao buscar imóvel");
  const dto = await r.json();
  // normaliza "end"
  return { ...dto, end: dto.endereco ?? dto.end ?? null };
}

/* =====================  Página  ===================== */
export default function ImovelDetailPage() {
  const { slug, imovelId } = useParams();
  const nav = useNavigate();
  const loc = useLocation();

  const [imovel, setImovel] = useState<ImovelDTO | null | undefined>(undefined);
  const [editOpen, setEditOpen] = useState(false);

  const base = `/proprietarios/${slug}/imoveis/${imovelId}`;
  const isContratos = (loc.pathname as string).endsWith("/docs"); // rota mantida (/docs)
  const isFotos = (loc.pathname as string).endsWith("/fotos");
  const tailCrumb = isContratos ? "Contratos" : isFotos ? "Fotos" : "Informações";

  const titleNumero = useMemo(
    () => (imovel?.numero && String(imovel.numero).trim()) || String(imovelId),
    [imovel?.numero, imovelId]
  );
  const titleEndereco = useMemo(
    () => (imovel?.end ?? imovel?.endereco ?? null),
    [imovel?.end, imovel?.endereco]
  );

  // ownerId a partir do slug (ex.: "maria-souza-12")
  const ownerIdFromSlug = useMemo(() => {
    if (!slug) return undefined;
    const parts = decodeURIComponent(slug).split("-");
    const last = Number(parts[parts.length - 1]);
    return Number.isFinite(last) ? last : undefined;
  }, [slug]);

  const ownerNameFromSlug = useMemo(() => {
    if (!slug) return "Proprietário";
    const s = decodeURIComponent(slug);
    return s.replace(/-\d+$/, "").replace(/-/g, " ").replace(/\s+/g, " ").trim() || "Proprietário";
  }, [slug]);

  useEffect(() => {
    if (!imovelId) return;
    (async () => {
      try {
        const dto = await getImovel(Number(imovelId));
        setImovel(dto);
      } catch {
        setImovel(null);
      }
    })();
  }, [imovelId]);

  if (imovel === undefined) {
    return (
      <div className="page">
        <style>{css}</style>
        <div className="header">
          <div className="breadcrumb">
            <Link to="/dashboard">Dashboard</Link> /{" "}
            <Link to="/proprietarios">Proprietários</Link> /{" "}
            <Link to={`/proprietarios/${slug}/imoveis`}>Imóveis</Link> /{" "}
            <span className="breadcrumb-active">Carregando…</span>
          </div>
        </div>
        <div className="body" style={{ color: "#64748b" }}>Carregando…</div>
      </div>
    );
  }

  if (imovel === null) {
    return (
      <div className="page">
        <style>{css}</style>
        <div className="header">
          <div className="breadcrumb">
            <Link to="/dashboard">Dashboard</Link> /{" "}
            <Link to="/proprietarios">Proprietários</Link> /{" "}
            <Link to={`/proprietarios/${slug}/imoveis`}>Imóveis</Link> /{" "}
            <span className="breadcrumb-active">Imóvel não encontrado</span>
          </div>
        </div>
        <div className="body" style={{ color: "#64748b" }}>Imóvel não encontrado.</div>
      </div>
    );
  }

  return (
    <div className="page">
      <style>{css}</style>

      <div className="header">
        <div className="breadcrumb">
          <Link to="/dashboard">Dashboard</Link> /{" "}
          <Link to="/proprietarios">Proprietários</Link> /{" "}
          <Link to={`/proprietarios/${slug}/imoveis`}>Imóveis</Link> /{" "}
          <Link to={base}>{titleNumero}</Link> /{" "}
          <span className="breadcrumb-active">{tailCrumb}</span>
        </div>
        <div />
      </div>

      <section className="card">
        <div className="cardhead">
          {/* Esquerda: voltar + título/subtítulo */}
          <div style={{ flex: 1 }}>
            <div className="backline">
              <button
                className="backbtn"
                onClick={() => nav(`/proprietarios/${slug}/imoveis`, { replace: true })}
                title="Voltar para os imóveis do proprietário"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Voltar
              </button>
            </div>

            <h2>{titleEndereco || `Imóvel #${titleNumero}`}</h2>
            <p style={{ color: "#64748b" }}>
              {imovel.tipo ?? "-"} · {imovel.situacao ?? "-"}
            </p>
          </div>

          {/* Direita: único botão escuro */}
          <div style={{ display: "flex", gap: 8 }}>
            <button className="fixedbtn" onClick={() => setEditOpen(true)} title="Editar imóvel">
              Editar
            </button>
          </div>
        </div>

        {/* Abas */}
        <div className="tabbar">
          <Link className={`tab ${!isContratos && !isFotos ? "active" : ""}`} to={base}>Informações</Link>
          <Link className={`tab ${isContratos ? "active" : ""}`} to={`${base}/docs`}>Contratos</Link>
          <Link className={`tab ${isFotos ? "active" : ""}`} to={`${base}/fotos`}>Fotos</Link>
        </div>

        {/* Conteúdo */}
        <div className="body">
          {/* `as any` para compatibilizar com o tipo esperado em InfoTab sem conflito */}
          {!isContratos && !isFotos && <InfoTab imovel={imovel as any} />}
          {isContratos && <ContratosTab />}
          {isFotos && <FotosTab />}
        </div>

        {/* Modal de edição */}
        {editOpen && (
          <EditImovelModal
            open={editOpen}
            onClose={() => setEditOpen(false)}
            imovel={imovel}
            ownerName={ownerNameFromSlug}
            ownerId={ownerIdFromSlug ?? 0}
            onSaved={async () => {
              if (imovel.id) {
                const fresh = await getImovel(imovel.id);
                setImovel(fresh);
              }
              setEditOpen(false);
            }}
          />
        )}
      </section>
    </div>
  );
}
