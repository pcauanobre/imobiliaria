import "./../layout.css";

export default function HintModal({
  title,
  message,
  onClose,
}: {
  title: string;
  message: string;
  onClose: () => void;
}) {
  return (
    <section
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-head">
          <h3 className="modal-title">{title}</h3>
          <button className="icon-btn" aria-label="Fechar" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.45 }}>
            {message}
          </p>
        </div>

        <div className="modal-actions">
          <button className="btn primary" onClick={onClose}>
            Entendi
          </button>
        </div>
      </div>
    </section>
  );
}
