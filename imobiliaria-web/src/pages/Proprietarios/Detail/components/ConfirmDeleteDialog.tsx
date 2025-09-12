// pages/Proprietarios/Detail/components/ConfirmDeleteDialog.tsx
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

export default function ConfirmDeleteDialog({ open, onClose, onConfirm }: Props) {
  const [text, setText] = useState("");
  if (!open) return null;

  const can = text.trim().toLowerCase() === "excluir";

  return (
    <div
      className="backdrop"
      onClick={(e) => e.currentTarget === e.target && onClose()}
    >
      <div className="small-modal" role="dialog" aria-modal="true">
        <h3 className="confirm-title">Confirmar exclusão</h3>
        <p className="confirm-text">
          Esta ação é irreversível. Para confirmar, digite <b>Excluir</b>.
        </p>
        <input
          className="confirm-input"
          placeholder="Digite 'Excluir'"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="confirm-actions">
          <button className="btn micro" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="danger"
            disabled={!can}
            onClick={async () => can && (await onConfirm())}
            style={{ opacity: can ? 1 : 0.6 }}
          >
            Excluir definitivamente
          </button>
        </div>
      </div>
    </div>
  );
}
