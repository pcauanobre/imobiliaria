export default function Topbar() {
  return (
    <header className="dash-topbar">
      <div className="topbar-inner">
        <nav aria-label="breadcrumb" className="crumbs">
          <span>Dashboard</span>
        </nav>

        <div className="top-search">
          <span className="search-icon">⌕</span>
          <input
            type="search"
            placeholder="Buscar por nome, CPF/CNPJ, endereço, contrato..."
            className="search-input"
          />
        </div>

        {/* sem user/bell aqui, tudo foi para a sidebar */}
        <div style={{ width: 48 }} /> 
      </div>
    </header>
  );
}
