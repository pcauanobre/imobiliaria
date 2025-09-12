// pages/Proprietarios/Imoveis/ImoveisPage.tsx
// Wrapper que decide entre a LISTA de imóveis do proprietário e o DETALHE de um imóvel.
// Mantém a compatibilidade com a detecção de :imovelId por URL, como no código original.

import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";

// ⬇️ Caminhos corretos (arquivos irmãos / subpasta)
import OwnerImoveisListPage from "./OwnerImoveisListPage";
import ImovelDetailPage    from "./ImovelDetail/ImovelDetailPage";

export default function ImoveisPage() {
  const { imovelId: paramImovelId } = useParams();
  const location = useLocation();

  // Fallback robusto (mantém compatibilidade com o padrão antigo):
  // se a rota não tiver :imovelId registrado, extrai do pathname.
  const imovelId = useMemo(() => {
    if (paramImovelId) {
      const n = Number(paramImovelId);
      return Number.isFinite(n) ? n : undefined;
    }
    const path =  
      typeof window !== "undefined" ? window.location.pathname : location.pathname;
    const match = path.match(/\/imoveis\/(\d+)(?:\/(docs|fotos))?\/?$/);
    return match ? Number(match[1]) : undefined;
  }, [paramImovelId, location.pathname]);

  // Se tem id => detalhe; senão => lista
  if (imovelId) {
    return <ImovelDetailPage />;
  }
  return <OwnerImoveisListPage />;
}
