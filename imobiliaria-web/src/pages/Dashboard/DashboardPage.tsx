import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

  // CSS principal (embutido — igual ao dashboard.css)
  const mainCss = `
:root{
  --bg:#f5f7fb;
  --text:#0f172a;
  --muted:#64748b;
  --card:#ffffff;
  --brand:#0B1321;
  --border:#e2e8f0;
  --shadow:0 14px 40px rgba(2,6,23,.08);
}

/* ===== UTIL ===== */
.small{ font-size:12.5px }
.muted{ color:#64748b }
.text{ font-size:15px; line-height:1.35 }
.link{ color:var(--brand); text-decoration:none; font-weight:700 }
.link:hover{ filter:brightness(.95) }
.icon-btn{ background:none; border:0; cursor:pointer; border-radius:10px; padding:8px; color:#0f172a }
.icon-btn:hover{ background:#f1f5f9 }

/* ===== KPIs ===== */
.kpi-grid{
  display:grid;
  grid-template-columns:repeat(1, minmax(0,1fr));
  gap:16px;
}
@media (min-width: 780px){
  .kpi-grid{ grid-template-columns:repeat(2, minmax(0,1fr)) }
}
@media (min-width: 1120px){
  .kpi-grid{ grid-template-columns:repeat(4, minmax(0,1fr)) }
}

.kpi-card{
  background:var(--card);
  border:1px solid rgba(2,6,23,.06);
  border-radius:22px;
  box-shadow:var(--shadow);
  padding:18px 18px 14px;
}
.kpi-head{
  display:flex; align-items:flex-start; justify-content:space-between; gap:10px;
}
.kpi-label{
  margin:0 0 6px 0;
  font-size:13px; letter-spacing:.02em; color:#475569; text-transform:uppercase; font-weight:800;
}
.kpi-value{
  margin:0;
  font-size:32px; font-weight:900; letter-spacing:-.01em; color:#0f172a;
}
.kpi-sub{
  margin:10px 0 0 0; font-size:12.5px; color:#64748b;
}

/* Chips */
.chip{
  display:inline-flex; align-items:center; gap:6px;
  padding:6px 10px; border-radius:999px; font-weight:800; font-size:12.5px;
  border:1px solid var(--border); background:#f8fafc; color:#0f172a;
}
.chip-slate{ background:#0f172a; color:#fff; border-color:transparent }

/* ===== GRID PRINCIPAL ===== */
.grid-3{
  display:grid;
  grid-template-columns:1fr;
  gap:16px;
}
@media (min-width: 980px){
  .grid-3{ grid-template-columns:1fr 1fr 1fr }
  .lg-span-2{ grid-column: span 2 / span 2 }
}

/* ===== CARD ===== */
.card{
  background:var(--card);
  border:1px solid rgba(2,6,23,.06);
  border-radius:22px;
  box-shadow:var(--shadow);
  padding:16px;
}
.card-head-row{
  display:flex; align-items:center; justify-content:space-between; gap:10px;
  margin:4px 0 14px 0;
}
.card-title{
  margin:0; font-size:18px; font-weight:800; color:#0f172a;
}

/* ===== CHART PLACEHOLDER ===== */
.chart-placeholder{
  position:relative;
  height:260px;
  border:1px dashed #d3d9e3;
  border-radius:14px;
  background:#f8fafc;
  display:grid; place-items:center;
  overflow:hidden;
}
.chart-grid{
  position:absolute; inset:0;
  background-image:
    linear-gradient(to right, rgba(2,6,23,.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(2,6,23,.05) 1px, transparent 1px);
  background-size:40px 40px;
}
.footnote{ margin:10px 2px 0; color:#94a3b8; font-size:12px }

/* ===== TABELA DOCUMENTOS ===== */
.table-wrap{ overflow:auto }
.table{
  width:100%;
  border-collapse:separate; border-spacing:0;
}
.table thead th{
  text-align:left; background:#f8fafc; color:#475569;
  font-size:12.5px; letter-spacing:.03em; padding:12px 16px;
  border-bottom:1px solid var(--border);
}
.table tbody td{
  padding:12px 16px; border-bottom:1px solid #eef2f7; font-size:15px; color:#0f172a;
}
.table tbody tr:hover{ background:#fafafa }
.actions{ display:flex; gap:8px; justify-content:flex-start }
.actions .icon-btn{ padding:6px }

/* ===== AÇÕES RÁPIDAS ===== */
.quick-grid{
  display:grid; grid-template-columns:1fr; gap:10px;
}
@media (min-width: 520px){
  .quick-grid{ grid-template-columns:1fr 1fr }
}
.quick-link{
  display:flex; align-items:center; gap:10px;
  background:#f8fafc; border:1px solid var(--border); border-radius:14px;
  padding:12px 14px; font-weight:800; color:#0f172a; text-decoration:none;
}
.quick-link:hover{ filter:brightness(.98) }
.quick-ic{ width:24px; height:24px; display:inline-grid; place-items:center }

/* ===== ATIVIDADE ===== */
.activity{
  list-style:none; margin:0; padding:0; display:grid; gap:10px;
}
.activity-item{
  display:flex; align-items:flex-start; gap:10px; padding:8px 2px;
}
.act-badge{
  display:inline-grid; place-items:center;
  width:28px; height:28px; border-radius:8px; font-size:14px;
  border:1px solid var(--border); background:#fff;
}
.act-badge.brand{ background:#0B1321; color:#fff; border-color:transparent }
.act-badge.emerald{ background:#10b981; color:#fff; border-color:transparent }
.act-badge.orange{ background:#f97316; color:#fff; border-color:transparent }

/* ===== DIÁRIO ===== */
.diary{
  list-style:none; margin:0; padding:0; display:grid; gap:10px;
}
.diary-item{
  border:1px solid var(--border); background:#fff; border-radius:14px;
  padding:12px 14px;
}
.diary-item .row{
  display:flex; align-items:center; justify-content:space-between; gap:10px;
}
.diary-item .label{ font-weight:800; color:#0f172a }
`;

  const styles = `${tipCss}\n${mainCss}`;

  return (
    <>
      <style>{styles}</style>

      {/* KPIs */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-head">
            <div>
              <p className="kpi-label">Proprietários</p>
              <p className="kpi-value">
                {ownersCount ?? <span className="mock-tip" data-tip="dado mockado">0</span>}
              </p>
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
              <p className="kpi-value">
                {imoveisCount ?? <span className="mock-tip" data-tip="dado mockado">0</span>}
              </p>
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
