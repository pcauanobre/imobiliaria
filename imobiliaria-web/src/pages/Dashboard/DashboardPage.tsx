// pages/DashboardPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";

type PageResp<T> =
  | { content: T[]; totalElements: number; totalPages: number; number: number; size: number }
  | T[];

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export default function DashboardPage() {
  const [ownersCount, setOwnersCount] = useState<number | null>(null);
  const [imoveisCount, setImoveisCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      // ===== Proprietários (usa totalElements da paginação) =====
      try {
        const res = await fetch(`${API_BASE}/api/v1/proprietarios?page=0&size=1`);
        if (res.ok) {
          const data: PageResp<any> = await res.json();
          if (Array.isArray(data)) setOwnersCount(data.length);
          else setOwnersCount(data.totalElements ?? (data.content?.length ?? 0));
        } else {
          setOwnersCount(null);
        }
      } catch {
        setOwnersCount(null);
      }

      // ===== Imóveis (se existir /imoveis paginado, usa totalElements) =====
      try {
        const res = await fetch(`${API_BASE}/api/v1/imoveis?page=0&size=1`);
        if (res.ok) {
          const data: PageResp<any> = await res.json();
          if (Array.isArray(data)) setImoveisCount(data.length);
          else setImoveisCount(data.totalElements ?? (data.content?.length ?? 0));
        } else {
          setImoveisCount(null);
        }
      } catch {
        setImoveisCount(null);
      }
    })();
  }, []);

  // CSS do tooltipzinho para itens mockados
  const tipCss = `
    .mock-tip{ position:relative; cursor:default }
    .mock-tip::after{
      content: attr(data-tip);
      position:absolute; left:50%; top:-8px; transform: translate(-50%, -100%);
      background:#0f172a; color:#fff; font-size:11px; padding:6px 8px; border-radius:8px;
      white-space:nowrap; box-shadow:0 4px 14px rgba(2,6,23,.18);
      opacity:0; pointer-events:none; transition:opacity .12s ease;
    }
    .mock-tip:hover::after{ opacity:1 }
  `;

  return (
    <>
      <style>{tipCss}</style>

      {/* KPIs */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-head">
            <div>
              <p className="kpi-label">Proprietários</p>
              <p className="kpi-value">{ownersCount ?? <span className="mock-tip" data-tip="dado mockado">0</span>}</p>
            </div>
            {/* crescimento ainda não calculado na API */}
            <span className="chip chip-slate mock-tip" data-tip="dado mockado">+3</span>
          </div>
          <p className="kpi-sub">Crescimento semanal</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-head">
            <div>
              <p className="kpi-label">Imóveis</p>
              <p className="kpi-value">{imoveisCount ?? <span className="mock-tip" data-tip="dado mockado">0</span>}</p>
            </div>
            {/* ocupação ainda não disponível */}
            <span className="chip chip-slate mock-tip" data-tip="dado mockado">75% ocup.</span>
          </div>
          <p className="kpi-sub">Taxa de ocupação</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-head">
            <div>
              <p className="kpi-label">Inquilinos</p>
              <p className="kpi-value mock-tip" data-tip="dado mockado">73</p>
            </div>
            <span className="chip chip-slate mock-tip" data-tip="dado mockado">+2</span>
          </div>
          <p className="kpi-sub">Novos este mês</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-head">
            <div>
              <p className="kpi-label">Contratos ativos</p>
              <p className="kpi-value mock-tip" data-tip="dado mockado">70</p>
            </div>
            <span className="chip chip-slate mock-tip" data-tip="dado mockado">+1</span>
          </div>
          <p className="kpi-sub">Variação mensal</p>
        </div>
      </section>

      {/* Grid principal (gráfico) */}
      <section className="grid-3" style={{ marginTop: 32 }}>
        <div className="card lg-span-2">
          <div className="card-head-row">
            <h2 className="card-title">Ocupação por mês</h2>
            <button className="icon-btn mock-tip" data-tip="dado mockado" title="Baixar">⬇</button>
          </div>
          <div className="chart-placeholder mock-tip" data-tip="dado mockado">
            <div className="chart-grid" />
          </div>
          <p className="footnote">* Exibição meramente ilustrativa.</p>
        </div>

        {/* Espaço lateral */}
        <div className="card" style={{ display: "grid", placeItems: "center", color: "#64748b" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Sem widgets aqui (por enquanto)</div>
            <div style={{ fontSize: 13 }}>Alertas foram movidos para o sino.</div>
          </div>
        </div>
      </section>

      {/* Documentos + Ações rápidas */}
      <section className="grid-3" style={{ marginTop: 32 }}>
        <div className="card lg-span-2">
          <div className="card-head-row">
            <h2 className="card-title">Últimos documentos enviados</h2>
            <Link to="/documentos" className="link">Ver todos</Link>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Arquivo</th><th>Entidade</th><th>Tamanho</th><th>Data</th><th>Ações</th>
                </tr>
              </thead>
              <tbody className="mock-tip" data-tip="dado mockado">
                <tr>
                  <td>Contrato_1023.pdf</td><td>Contrato (via Inquilino)</td><td>512 KB</td><td>10/08/2025</td>
                  <td className="actions">
                    <a className="icon-btn" href="/documentos" title="Baixar">⬇</a>
                    <button className="icon-btn" title="Remover">🗑</button>
                  </td>
                </tr>
                <tr>
                  <td>RG_Maria.jpg</td><td>Inquilino</td><td>268 KB</td><td>09/08/2025</td>
                  <td className="actions">
                    <a className="icon-btn" href="/documentos" title="Baixar">⬇</a>
                    <button className="icon-btn" title="Remover">🗑</button>
                  </td>
                </tr>
                <tr>
                  <td>Laudo_apt202.pdf</td><td>Imóvel</td><td>1.2 MB</td><td>09/08/2025</td>
                  <td className="actions">
                    <a className="icon-btn" href="/documentos" title="Baixar">⬇</a>
                    <button className="icon-btn" title="Remover">🗑</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="footnote">* Documentos são geridos dentro de cada entidade.</p>
        </div>

        <div className="card">
          <h2 className="card-title">Ações rápidas</h2>
          <div className="quick-grid">
            <Link to="/proprietarios" className="quick-link"><span className="quick-ic">👤</span>Adicionar proprietário</Link>
            <Link to="/proprietarios" className="quick-link"><span className="quick-ic">🏠</span>Adicionar imóvel (via proprietário)</Link>
            <Link to="/proprietarios" className="quick-link mock-tip" data-tip="dado mockado"><span className="quick-ic">🪪</span>Novo inquilino</Link>
            <Link to="/proprietarios" className="quick-link mock-tip" data-tip="dado mockado"><span className="quick-ic">📝</span>Novo contrato</Link>
          </div>
          <p className="footnote">* Navegação simulada.</p>
        </div>
      </section>

      {/* Atividade + Diário */}
      <section className="grid-3" style={{ marginTop: 32 }}>
        <div className="card lg-span-2">
          <div className="card-head-row">
            <h2 className="card-title">Atividade recente</h2>
            <button className="icon-btn mock-tip" data-tip="dado mockado" title="Atualizar">⟲</button>
          </div>
          <ul className="activity mock-tip" data-tip="dado mockado">
            <li className="activity-item">
              <span className="act-badge brand">🗎</span>
              <div>
                <p className="text"><strong>Contrato #1023</strong> criado para <em>Lucas Albuquerque</em> — Imóvel: Casa Rocha Alexandre.</p>
                <p className="small muted">há 2 horas · por Admin</p>
              </div>
            </li>
            <li className="activity-item">
              <span className="act-badge emerald">✔</span>
              <div>
                <p className="text">Documento <strong>RG_Maria.jpg</strong> enviado no cadastro de <em>Maria Silva</em>.</p>
                <p className="small muted">há 5 horas · por Atendente</p>
              </div>
            </li>
            <li className="activity-item">
              <span className="act-badge orange">🔔</span>
              <div>
                <p className="text">Gerado alerta de <strong>reajuste</strong> para o contrato #0984 (em 12 dias).</p>
                <p className="small muted">ontem · por sistema</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="card">
          <div className="card-head-row">
            <h2 className="card-title">Diário do Inquilino (resumo)</h2>
            <Link to="/proprietarios" className="link">Ver tudo</Link>
          </div>
          <ul className="diary mock-tip" data-tip="dado mockado">
            <li className="diary-item">
              <div className="row">
                <p className="label">Pedro Souza — Apt 202</p>
                <span className="chip chip-slate">Manutenção</span>
              </div>
              <p className="text muted">Relatado vazamento na pia da cozinha.</p>
              <p className="small muted">08/08/2025 · Atendente</p>
            </li>
            <li className="diary-item">
              <div className="row">
                <p className="label">Ana Lima — Casa 01</p>
                <span className="chip chip-slate">Comunicação</span>
              </div>
              <p className="text muted">Solicitou 2ª via do contrato.</p>
              <p className="small muted">07/08/2025 · Admin</p>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
