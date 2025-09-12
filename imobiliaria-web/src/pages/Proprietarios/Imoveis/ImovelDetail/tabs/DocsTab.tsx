// pages/Proprietarios/Imoveis/ImovelDetail/tabs/DocsTab.tsx
// Tab "Documentos" extraída fielmente do conteúdo inline anterior.
// Mantém o placeholder simples de upload (sem lógica adicional).

export default function DocsTab() {
  return (
    <div>
      <div className="k" style={{ marginBottom: 8 }}>
        Upload de documentos (PDF/Imagens)
      </div>
      <input className="input" type="file" multiple accept=".pdf,image/*" />
    </div>
  );
}
