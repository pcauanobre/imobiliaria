// Wrapper de rotas: lista → detalhe do proprietário.
// NÃO intercepta /imoveis (essas rotas já estão em App.tsx).

import { useParams } from "react-router-dom";

// lista de proprietários
import ProprietariosListPage from "./ProprietariosListPage";

// detalhe do proprietário
import ProprietarioDetailPage from "./Detail/ProprietarioDetailPage";

export default function ProprietariosPage() {
  const { slug } = useParams();

  // Sem :slug → lista
  if (!slug) return <ProprietariosListPage />;

  // Com :slug → detalhe do proprietário
  // (Inclui tanto /proprietarios/:slug quanto /proprietarios/:slug/docs;
  // a própria página decide a aba ativa pela URL.)
  return <ProprietarioDetailPage />;
}
