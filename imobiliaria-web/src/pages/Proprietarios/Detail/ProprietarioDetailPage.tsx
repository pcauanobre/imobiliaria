// src/pages/Proprietarios/Detail/ProprietarioDetailPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

// ✅ IMPORTS (caminho correto é ./components/...)
import EditProprietarioModal from "./components/EditProprietarioModal";
import MissingInfoDialog from "./components/MissingInfoDialog";

type Proprietario = {
  id: number;
  nome: string | null;
  doc: string | null;
  email: string | null;
  tel: string | null;
  obs: string | null;
};

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function getProprietario(id: number): Promise<Proprietario> {
  const r = await fetch(`${API_BASE}/api/v1/proprietarios/${id}`);
  if (!r.ok) throw new Error("Erro ao buscar proprietário");
  const dto = await r.json();

  // 🔧 normaliza possíveis aliases vindos do backend
  return {
    id: Number(dto.id),
    nome: dto.nome ?? dto.name ?? null,
    doc: dto.doc ?? dto.cpfCnpj ?? dto.cpf ?? null,
    email: dto.email ?? null,
    tel: dto.tel ?? dto.telefone ?? null,
    obs: dto.obs ?? dto.observacoes ?? null,
  };
}

const css = `
.page{ padding:24px }
.card{ background:#fff; border:1px solid rgba(2,6,23,.06); border-radius:22px; box-shadow:0 14px 40px rgba(2,6,23,.08) }
.cardhead{ display:flex; justify-content:space-between; align-items:flex-start; padding:18px 20px; border-bottom:1px solid #e2e8f0 }
.h1{ margin:0 0 2px; font-size:20px; display:flex; align-items:center; gap:8px }
.sub{ margin:0; color:#64748b; font-size:13.5px }
.backline{ margin-top:10px; margin-bottom:18px }
.backbtn{ display:inline-flex; align-items:center; gap:8px; font-weight:800; color:#0f172a; background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:10px 14px; cursor:pointer; text-decoration:none }
.backbtn:hover{ background:#f8fafc }
.toolbar{ display:flex; gap:8px }
.btn{ border:1px solid #e2e8f0; background:#f8fafc; color:#0f172a; border-radius:12px; padding:10px 16px; font-weight:700; cursor:pointer }
.btn:hover{ filter:brightness(.98) }
.btn.primary{ background:#0B1321; color:#fff; border-color:transparent }
.tabbar{ display:flex; gap:8px; padding:12px 18px 18px; border-bottom:1px solid #e2e8f0 }
.tab{ border:1px solid #e2e8f0; background:#fff; border-radius:999px; padding:8px 14px; font-weight:600; font-size:14px; color:#475569; text-decoration:none }
.tab:hover{ background:#f1f5f9 }
.tab.active{ background:#0B1321; color:#fff; border-color:#0B1321 }
.grid{ padding:20px; display:grid; grid-template-columns:1fr 1fr; gap:14px }
.k{ font-size:12px; color:#64748b; margin-bottom:6px }
.v{ font-size:15px; }
.full{ grid-column:1 / -1 }
.breadcrumb{ color:#64748b; font-size:14px; margin-bottom:24px }
.breadcrumb a{ color:inherit; text-decoration:none }
.breadcrumb-active{ font-weight:700; color:#0B1321 }

/* ⚠️ Ícone do alerta */
.warn-icon{
  width:34px;height:34px;border-radius:8px;border:1px solid #fee2e2;background:#fff5f5;color:#ef4444;
  display:inline-flex;align-items:center;justify-content:center;cursor:pointer
}
.warn-icon:hover{ filter:brightness(.95) }
`;

export default function ProprietarioDetailPage() {
  const { slug } = useParams();
  const nav = useNavigate();

  // extrai id do slug "qualquer-coisa-123"
  const ownerId = useMemo(() => {
    if (!slug) return undefined;
    const last = Number(decodeURIComponent(slug).split("-").pop());
    return Number.isFinite(last) ? last : undefined;
  }, [slug]);

  const [owner, setOwner] = useState<Proprietario | null>(null);
  const [,setLoading] = useState(false);

  // popups
  const [editOpen, setEditOpen] = useState(false);
  const [missingOpen, setMissingOpen] = useState(false);
  const [focusField, setFocusField] =
    useState<"nome" | "doc" | "email" | "tel" | "obs" | undefined>(undefined);

  useEffect(() => {
    if (!ownerId) return;
    (async () => {
      setLoading(true);
      try {
        const dto = await getProprietario(ownerId);
        setOwner(dto);
      } catch (e) {
        console.error(e);
        setOwner(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [ownerId]);

  // lista de faltantes (robusta a null/undefined/"")
  const faltando = useMemo(() => {
    const miss: Array<"nome" | "doc" | "email" | "tel" | "obs"> = [];
    const empty = (v: unknown) => {
      if (v === null || v === undefined) return true;
      if (typeof v === "string" && v.trim() === "") return true;
      return false;
    };
    if (!owner) return miss;
    if (empty(owner.nome)) miss.push("nome");
    if (empty(owner.doc)) miss.push("doc");
    if (empty(owner.email)) miss.push("email");
    if (empty(owner.tel)) miss.push("tel");
    if (empty(owner.obs)) miss.push("obs");
    return miss;
  }, [owner]);

  const base = `/proprietarios/${slug}`;
  const imoveisHref = `${base}/imoveis`;

  return (
    <div className="page">
      <style>{css}</style>

      <div className="breadcrumb">
        <Link to="/dashboard">Dashboard</Link> /{" "}
        <Link to="/proprietarios">Proprietários</Link> /{" "}
        <span className="breadcrumb-active">{owner?.nome ?? "Proprietário"}</span>
      </div>

      <section className="card">
        <div className="cardhead">
          <div>
            <div className="backline">
              <button className="backbtn" onClick={() => nav("/proprietarios", { replace: true })}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Voltar
              </button>
            </div>

            <h2 className="h1">
              {owner?.nome ?? "…"}
              {faltando.length > 0 && (
                <button className="warn-icon" title="Dados incompletos" onClick={() => setMissingOpen(true)}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                    <path d="M12 3l9 16H3L12 3z" strokeWidth="2" />
                    <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2" />
                    <circle cx="12" cy="17" r="1.2" />
                  </svg>
                </button>
              )}
            </h2>
            <p className="sub">{owner?.doc ? owner.doc : "Sem documento"}</p>
          </div>

          <div className="toolbar">
            {faltando.length > 0 && (
              <button className="btn" onClick={() => setMissingOpen(true)}>Completar dados</button>
            )}
            <button className="btn primary" onClick={() => setEditOpen(true)}>Editar</button>
          </div>
        </div>

        <div className="tabbar">
          <span className="tab active">Dados</span>
          <span className="tab">Documentos</span>
          <Link to={imoveisHref} className="tab">Imóveis</Link>
        </div>

        <div className="grid">
          <div>
            <div className="k">NOME</div>
            <div className="v">{owner?.nome ?? "-"}</div>
          </div>
          <div>
            <div className="k">CPF/CNPJ</div>
            <div className="v">{owner?.doc ?? "-"}</div>
          </div>
          <div>
            <div className="k">E-MAIL</div>
            <div className="v">{owner?.email ?? "-"}</div>
          </div>
          <div>
            <div className="k">TELEFONE</div>
            <div className="v">{owner?.tel ?? "-"}</div>
          </div>
          <div className="full">
            <div className="k">OBSERVAÇÕES</div>
            <div className="v">{owner?.obs ?? "-"}</div>
          </div>
        </div>
      </section>

      {/* Popup: editar */}
      {owner && (
        <EditProprietarioModal
          open={editOpen}
          onClose={() => { setEditOpen(false); setFocusField(undefined); }}
          owner={owner}
          initialFocusField={focusField}
          onSaved={async () => {
            if (!ownerId) return;
            const dto = await getProprietario(ownerId);
            setOwner(dto);
            setEditOpen(false);
            setFocusField(undefined);
          }}
        />
      )}

      {/* Popup: faltando info */}
      <MissingInfoDialog
        open={missingOpen}
        faltando={faltando}
        onClose={() => setMissingOpen(false)}
        onGoTo={(field) => {
          setMissingOpen(false);
          setFocusField(field); // 👉 o modal vai focar e "piscar" esse campo
          setEditOpen(true);
        }}
      />
    </div>
  );
}
