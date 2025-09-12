// pages/Proprietarios/Detail/tabs/DadosTab.tsx
// Mostra os dados do proprietário e abre um MODAL para edição.

import { useMemo, useState } from "react";
import EditProprietarioModal from "../components/EditProprietarioModal";

type Proprietario = {
  id?: number;
  nome: string;
  doc: string;
  email?: string | null;
  tel?: string | null;
  obs?: string | null;
};

type Props = {
  owner: Proprietario;
  /** Se o pai quiser recarregar após salvar no modal */
  onUpdated?: (p: Proprietario) => void;
  /** Alternativa: callback só para recarregar */
  reload?: () => void;
};

function formatDoc(doc?: string | null) {
  const d = (doc ?? "").replace(/\D/g, "");
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  return doc ?? "-";
}

export default function DadosTab({ owner, onUpdated, reload }: Props) {
  const [openEdit, setOpenEdit] = useState(false);
  const emailHref = useMemo(() => (owner.email ? `mailto:${owner.email}` : undefined), [owner.email]);

  const whatsHref = useMemo(() => {
    const digits = (owner.tel ?? "").replace(/\D/g, "");
    if (!digits) return undefined;
    // Ajuste simples para BR: se não tiver DDI, força 55
    const withDDI = digits.length <= 11 ? `55${digits}` : digits;
    return `https://wa.me/${withDDI}`;
  }, [owner.tel]);

  return (
    <>
      {/* Cabeçalho de ações (mantém o visual do original) */}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginBottom: 10 }}>
        <a
          className="btn micro"
          href={emailHref}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!emailHref}
          onClick={(e) => !emailHref && e.preventDefault()}
        >
          Abrir email
        </a>

        <a
          className="btn micro"
          href={whatsHref}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!whatsHref}
          onClick={(e) => !whatsHref && e.preventDefault()}
        >
          Abrir WhatsApp
        </a>

        <button className="btn micro" onClick={() => setOpenEdit(true)}>
          Editar
        </button>
      </div>

      {/* Bloco com as informações em duas colunas, como no original */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        <div>
          <div style={{ marginBottom: 22 }}>
            <div className="k">NOME</div>
            <div>{owner.nome || "-"}</div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <div className="k">E-MAIL</div>
            <div>{owner.email || "-"}</div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <div className="k">OBSERVAÇÕES</div>
            <div>{owner.obs || "-"}</div>
          </div>
        </div>

        <div>
          <div style={{ marginBottom: 22 }}>
            <div className="k">CPF/CNPJ</div>
            <div>{formatDoc(owner.doc)}</div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <div className="k">TELEFONE</div>
            <div>{owner.tel || "-"}</div>
          </div>
        </div>
      </div>

      {/* MODAL: edição em popup */}
      <EditProprietarioModal
        open={openEdit}
        owner={owner}
        onClose={() => setOpenEdit(false)}
        onSaved={(p) => {
          setOpenEdit(false);
          onUpdated?.(p);
          reload?.();
        }}
      />
    </>
  );
}
