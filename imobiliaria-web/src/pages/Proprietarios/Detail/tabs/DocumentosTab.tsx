// pages/Proprietarios/Detail/tabs/DocumentosTab.tsx
// No código original, a aba "Documentos" do Proprietário ainda não tinha
// conteúdo funcional (apenas o botão da aba). Para manter o comportamento
// e só organizar a estrutura, este componente mostra um placeholder leve.

export default function DocumentosTab() {
  return (
    <div>
      <div className="k" style={{ marginBottom: 8 }}>
        Documentos do proprietário — placeholder
      </div>
      <p className="v" style={{ maxWidth: 680 }}>
        Nesta seção, futuramente, você poderá enviar e gerenciar arquivos
        (PDF/Imagens) vinculados ao proprietário. Por enquanto, os documentos
        continuam sendo geridos dentro de cada entidade específica (Imóvel,
        Inquilino, Contrato), sem alterações de funcionamento.
      </p>
    </div>
  );
}
