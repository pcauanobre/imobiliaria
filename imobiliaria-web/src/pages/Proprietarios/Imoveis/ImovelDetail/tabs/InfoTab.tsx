// src/pages/Proprietarios/Imoveis/ImovelDetail/tabs/InfoTab.tsx
// Aba "Informações" — somente os campos solicitados e o vínculo com o proprietário.

import { Link, useParams } from "react-router-dom";

/* ===== Tipos (iguais ao detalhe) ===== */
export type Imovel = {
  id?: number;
  end?: string | null;          // alias de endereco
  endereco?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  cep?: string | null;

  tipo?: string | null;
  finalidade?: string | null;
  situacao?: string | null; // <- usar apenas: "Locado" | "Disponível"
  obs?: string | null;
};

type Props = { imovel: Imovel };

/* ===== Estilos locais mínimos (seguem o look&feel do projeto) ===== */
const css = `
.info-grid{ display:grid; grid-template-columns:1fr 1fr; gap:22px }
.label{ font-size:12px; color:#64748b; margin:0 0 6px }
.value{ font-size:15px; color:#0f172a }
.full{ grid-column:1 / -1 }

.owner-pill{
  display:inline-flex; align-items:center; gap:8px;
  border:1px solid #e5e7eb; padding:8px 12px; border-radius:999px;
  background:#fff; font-weight:600; color:#0f172a; text-decoration:none;
}
.owner-pill:hover{ background:#f8fafc }
`;

export default function InfoTab({ imovel }: Props) {
  // Lê o slug da URL para montar o vínculo com o proprietário
  const { slug } = useParams();

  // Constrói nome legível a partir do slug (ex.: "maria-souza-12" -> "maria souza")
  const ownerName =
    (slug
      ? decodeURIComponent(slug)
          .replace(/-\d+$/, "")
          .replace(/-/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      : "Proprietário") || "Proprietário";

  const ownerLink = slug ? `/proprietarios/${slug}` : "/proprietarios";

  const endereco =
    imovel.end ?? imovel.endereco ?? "";

  return (
    <div>
      <style>{css}</style>

      {/* Vínculo visual com o proprietário */}
      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
        <Link to={ownerLink} className="owner-pill" title="Ir para o proprietário">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Proprietário: {ownerName}
        </Link>
      </div>

      {/* Campos (apenas os solicitados) */}
      <div className="info-grid">
        <div className="full">
          <div className="label">ENDEREÇO</div>
          <div className="value">{endereco || "-"}</div>
        </div>

        <div>
          <div className="label">NÚMERO</div>
          <div className="value">{(imovel.numero ?? "") || "-"}</div>
        </div>

        <div>
          <div className="label">COMPLEMENTO</div>
          <div className="value">{(imovel.complemento ?? "") || "-"}</div>
        </div>

        <div>
          <div className="label">BAIRRO</div>
          <div className="value">{(imovel.bairro ?? "") || "-"}</div>
        </div>

        <div>
          <div className="label">CIDADE</div>
          <div className="value">{(imovel.cidade ?? "") || "-"}</div>
        </div>

        <div>
          <div className="label">UF</div>
          <div className="value">{(imovel.uf ?? "") || "-"}</div>
        </div>

        <div>
          <div className="label">CEP</div>
          <div className="value">{(imovel.cep ?? "") || "-"}</div>
        </div>

        <div>
          <div className="label">TIPO</div>
          <div className="value">{(imovel.tipo ?? "") || "-"}</div>
        </div>

        <div>
          <div className="label">FINALIDADE</div>
          <div className="value">{(imovel.finalidade ?? "") || "-"}</div>
        </div>

        <div>
          <div className="label">SITUAÇÃO</div>
          <div className="value">{(imovel.situacao ?? "") || "-"}</div>
        </div>

        <div className="full">
          <div className="label">OBSERVAÇÕES</div>
          <div className="value">{(imovel.obs ?? "") || "-"}</div>
        </div>
      </div>
    </div>
  );
}
