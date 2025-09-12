// src/pages/Proprietarios/ProprietariosPage.tsx
// Wrapper de rotas: lista → detalhe do proprietário → imóveis

import { useParams, useLocation } from "react-router-dom";

// lista de proprietários
import ProprietariosListPage from "./ProprietariosListPage";

// detalhe do proprietário
import ProprietarioDetailPage from "./Detail/ProprietarioDetailPage";

// lista de imóveis do proprietário
import OwnerImoveisListPage from "./Imoveis/OwnerImoveisListPage";

export default function ProprietariosPage() {
  const { slug } = useParams();
  const location = useLocation();

  // Sem :slug → lista
  if (!slug) return <ProprietariosListPage />;

  // Se URL contém "/imoveis" → tela de imóveis do proprietário
  if (location.pathname.includes("/imoveis")) {
    return <OwnerImoveisListPage />;
  }

  // Padrão → detalhe do proprietário
  return <ProprietarioDetailPage />;
}
