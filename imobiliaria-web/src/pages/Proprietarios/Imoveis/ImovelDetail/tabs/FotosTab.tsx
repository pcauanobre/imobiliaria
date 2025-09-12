// pages/Proprietarios/Imoveis/ImovelDetail/tabs/FotosTab.tsx
// Tab "Fotos" extraída do conteúdo inline anterior.
// Mantém o placeholder de miniaturas (thumbgrid) sem lógica adicional.

export default function FotosTab() {
  return (
    <div>
      <div className="k" style={{ marginBottom: 8 }}>
        Fotos do imóvel (pré-visualização) — demonstração
      </div>
      <div className="thumbgrid" style={{ marginBottom: 10 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="thumb" />
        ))}
      </div>
      <div className="k">[upload de fotos aqui]</div>
    </div>
  );
}
