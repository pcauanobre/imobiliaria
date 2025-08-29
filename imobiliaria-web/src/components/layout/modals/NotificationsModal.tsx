import { useEffect, useState } from "react";
import "./../layout.css";
import HintModal from "./HintModal";

type Item = {
  tag: "Reajuste" | "Vencimento";
  tone: "orange" | "rose";
  title: string;   // Ex: "Contrato #1023 — Lucas Albuquerque"
  sub: string;     // Ex: "Reajuste em 30 dias"
};

export default function NotificationsModal({ onClose }: { onClose: () => void }) {
  const [hint, setHint] = useState<{ title: string; msg: string } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const items: Item[] = [
    {
      tag: "Reajuste",
      tone: "orange",
      title: "Contrato #1023 — Lucas Albuquerque",
      sub: "Reajuste em 30 dias",
    },
    {
      tag: "Vencimento",
      tone: "rose",
      title: "Contrato #0998 — Maria Silva",
      sub: "Vence em 28 dias",
    },
    {
      tag: "Reajuste",
      tone: "orange",
      title: "Contrato #0984 — Pedro Souza",
      sub: "Reajuste em 12 dias",
    },
  ];

  function openHint(kind: Item["tag"]) {
    const base =
      "Essa opção abrirá a área correspondente e mostrará onde ficam os documentos/contratos vinculados.";
    const extra =
      kind === "Reajuste"
        ? " Use para ver contratos que precisam de atualização de valor."
        : " Use para ver contratos próximos do vencimento.";
    setHint({ title: kind, msg: base + extra });
  }

  return (
    <>
      <section
        className="modal-backdrop"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="notif-title">
          <div className="modal-head">
            <h3 id="notif-title" className="modal-title">Notificações</h3>
            <button className="icon-btn" aria-label="Fechar" onClick={onClose}>✕</button>
          </div>

          <div className="modal-body" style={{ paddingTop: 8 }}>
            <ul className="modal-list">
              {items.map((n, i) => (
                <li className="modal-item" key={i}>
                  <div className="modal-badge">
                    <button
                      className={`chip chip-${n.tone}`}
                      type="button"
                      onClick={() => openHint(n.tag)}
                      title={`Sobre ${n.tag.toLowerCase()}`}
                    >
                      {n.tag}
                    </button>
                  </div>

                  <div className="modal-texts">
                    <div className="modal-title-row">{n.title}</div>
                    <div className="modal-sub">{n.sub}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="modal-actions">
            <button className="btn muted" onClick={onClose}>Fechar</button>
          </div>
        </div>
      </section>

      {hint && (
        <HintModal
          title={hint.title}
          message={hint.msg}
          onClose={() => setHint(null)}
        />
      )}
    </>
  );
}
