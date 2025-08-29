import { Link } from "react-router-dom";
import "./dashboard.css"; // pode seguir vazio ou com seus ajustes locais

export default function DashboardPage() {
  return (
    <>
      {/* KPIs */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-head">
            <div>
              <p className="kpi-label">Proprietários</p>
              <p className="kpi-value">35</p>
            </div>
            <span className="chip chip-slate">+3</span>
          </div>
          <p className="kpi-sub">Crescimento semanal</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-head">
            <div>
              <p className="kpi-label">Imóveis</p>
              <p className="kpi-value">82</p>
            </div>
            <span className="chip chip-slate">75% ocup.</span>
          </div>
          <p className="kpi-sub">Taxa de ocupação</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-head">
            <div>
              <p className="kpi-label">Inquilinos</p>
              <p className="kpi-value">73</p>
            </div>
            <span className="chip chip-slate">+2</span>
          </div>
          <p className="kpi-sub">Novos este mês</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-head">
            <div>
              <p className="kpi-label">Contratos ativos</p>
              <p className="kpi-value">70</p>
            </div>
            <span className="chip chip-slate">+1</span>
          </div>
          <p className="kpi-sub">Variação mensal</p>
        </div>
      </section>

      {/* Grid principal (gráfico) */}
      <section className="grid-3" style={{ marginTop:32 }}>
        <div className="card lg-span-2">
          <div className="card-head-row">
            <h2 className="card-title">Ocupação por mês</h2>
            <button className="icon-btn" title="Baixar">⬇</button>
          </div>
          <div className="chart-placeholder"><div className="chart-grid" /></div>
          <p className="footnote">* Exibição meramente ilustrativa no protótipo.</p>
        </div>

        {/* Espaço vazio para futuro (antes eram os alertas) */}
        <div className="card" style={{ display:"grid", placeItems:"center", color:"#64748b" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontWeight:700, marginBottom:6 }}>Sem widgets aqui (por enquanto)</div>
            <div style={{ fontSize:13 }}>Alertas foram movidos para o menu lateral (ícone de sino).</div>
          </div>
        </div>
      </section>

      {/* Documentos + Ações rápidas */}
      <section className="grid-3" style={{ marginTop:32 }}>
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
              <tbody>
                <tr>
                  <td>Contrato_1023.pdf</td><td>Contrato (via Inquilino)</td><td>512 KB</td><td>10/08/2025</td>
                  <td className="actions"><a className="icon-btn" href="/documentos" title="Baixar">⬇</a><button className="icon-btn" title="Remover">🗑</button></td>
                </tr>
                <tr>
                  <td>RG_Maria.jpg</td><td>Inquilino</td><td>268 KB</td><td>09/08/2025</td>
                  <td className="actions"><a className="icon-btn" href="/documentos" title="Baixar">⬇</a><button className="icon-btn" title="Remover">🗑</button></td>
                </tr>
                <tr>
                  <td>Laudo_apt202.pdf</td><td>Imóvel</td><td>1.2 MB</td><td>09/08/2025</td>
                  <td className="actions"><a className="icon-btn" href="/documentos" title="Baixar">⬇</a><button className="icon-btn" title="Remover">🗑</button></td>
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
            <Link to="/proprietarios" className="quick-link"><span className="quick-ic">🪪</span>Novo inquilino (via proprietário → imóvel)</Link>
            <Link to="/proprietarios" className="quick-link"><span className="quick-ic">📝</span>Novo contrato (via inquilino/imóvel)</Link>
          </div>
          <p className="footnote">* Navegação simulada.</p>
        </div>
      </section>

      {/* Atividade + Diário */}
      <section className="grid-3" style={{ marginTop:32 }}>
        <div className="card lg-span-2">
          <div className="card-head-row">
            <h2 className="card-title">Atividade recente</h2>
            <button className="icon-btn" title="Atualizar">⟲</button>
          </div>
          <ul className="activity">
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
          <ul className="diary">
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
