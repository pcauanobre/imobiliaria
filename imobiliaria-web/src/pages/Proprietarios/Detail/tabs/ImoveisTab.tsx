// src/pages/Proprietarios/Detail/tabs/ImoveisTab.tsx
import { Link, useParams } from "react-router-dom";

/* CSS para o estilo pill + tabela */
const css = `
.pill-link {
  display:inline-block !important;
  padding:6px 12px !important;
  background:#f8fafc !important;
  border:1px solid #e2e8f0 !important;
  border-radius:12px !important;
  font-weight:600 !important;
  font-size:14px !important;
  color:#0f172a !important;
  text-decoration:none !important;
  transition:background .2s ease !important;
}
.pill-link:hover {
  background:#f1f5f9 !important;
}

.table { width:100%; border-collapse:separate; border-spacing:0 }
.table thead th {
  background:#f8fafc; text-align:left; font-size:12.5px; letter-spacing:.03em;
  color:#475569; padding:12px 16px; border-bottom:1px solid #e2e8f0;
}
.table tbody td {
  padding:12px 16px;
  border-bottom:1px solid #eef2f7;
  font-size:15px;
}
.table tbody tr:hover { background:#fafafa }

.rowact { display:flex; gap:8px; justify-content:flex-end }
.iconbtn {
  border:0; background:transparent; padding:8px; border-radius:12px;
  cursor:pointer; color:inherit;
}
.iconbtn:hover { background:#f1f5f9 }
`;

export type ImovelItem = {
  id: number;
  endereco: string;
  tipo: string;
  situacao: string;
};

type Props = { items: ImovelItem[] };

export default function ImoveisTab({ items }: Props) {
  const { slug } = useParams(); // usado para montar a rota do detalhe

  return (
    <div>
      <style>{css}</style>
      <div style={{ overflow: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th>ENDEREÇO</th>
              <th>TIPO</th>
              <th>SITUAÇÃO</th>
              <th style={{ textAlign: "right" }}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: 24, color: "#64748b" }}>
                  Nenhum imóvel encontrado.
                </td>
              </tr>
            ) : (
              items.map((r) => (
                <tr key={r.id}>
                  <td>
                    {/* pill clicável para abrir detalhe do imóvel */}
                    <Link
                      to={`/proprietarios/${slug}/imoveis/${r.id}`}
                      className="pill-link"
                    >
                      {r.endereco || "(sem endereço)"}
                    </Link>
                  </td>
                  <td>{r.tipo}</td>
                  <td>{r.situacao}</td>
                  <td>
                    <div className="rowact">
                      <Link
                        className="iconbtn"
                        to={`/proprietarios/${slug}/imoveis/${r.id}`}
                        title="Abrir"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M9 5l7 7-7 7"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                      <button className="iconbtn" title="Excluir">
                        <svg
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 6h18M9 6v12m6-12v12M10 6l1-2h2l1 2M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14"
                          />
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
    </div>
  );
}
