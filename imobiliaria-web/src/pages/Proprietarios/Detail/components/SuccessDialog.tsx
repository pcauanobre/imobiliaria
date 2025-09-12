// pages/Proprietarios/Detail/components/SuccessDialog.tsx
// Mantém exatamente o comportamento/markup do componente original.
// As classes CSS (backdrop, small-modal, confirm-title, etc.) já existem no seu estilo da página.

type Props = {
  open: boolean;
  onClose: () => void;
  message?: string;
};

export default function SuccessDialog({ open, onClose, message = "Excluído com sucesso." }: Props) {
  if (!open) return null;

  return (
    <div
      className="backdrop"
      onClick={(e) => e.currentTarget === e.target && onClose()}
    >
      <div className="small-modal" role="dialog" aria-modal="true">
        <h3 className="confirm-title">✅ Sucesso</h3>
        <p className="confirm-text">{message}</p>
        <div className="confirm-actions">
          <button className="btn primary" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
