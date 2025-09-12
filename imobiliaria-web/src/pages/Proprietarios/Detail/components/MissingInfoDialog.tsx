// pages/Proprietarios/Detail/components/MissingInfoDialog.tsx
// Alerta de "Informações faltando" em POPUP.
// Mostra nomes legíveis dos campos e, ao clicar, fecha o alerta e
// aciona onGoTo(field) para o modal de edição focar/piscar o campo.

type FieldKey = "nome" | "doc" | "email" | "tel" | "obs";

type Props = {
  open: boolean;
  // ideal: (keyof Proprietario)[]. Mantemos string[] por compat.
  faltando: string[];
  onClose: () => void;
  onGoTo?: (field: FieldKey) => void;
};

const LABEL: Record<FieldKey, string> = {
  nome: "Nome",
  doc: "CPF/CNPJ",
  email: "E-mail",
  tel: "Telefone",
  obs: "Observações",
};

const css = `
.backdrop{
  position:fixed; inset:0; background:rgba(2,6,23,.45);
  display:flex; align-items:center; justify-content:center;
  padding:24px; z-index:70;
  animation:fadeIn .2s ease;
}
.small-modal{
  width:100%; max-width:640px; background:#fff;
  border:1px solid rgba(2,6,23,.06); border-radius:18px;
  box-shadow:0 14px 40px rgba(2,6,23,.12); padding:22px; box-sizing:border-box;
  animation:slideUp .25s ease;
}
@keyframes fadeIn{ from{opacity:0} to{opacity:1} }
@keyframes slideUp{ from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }

.modal-title{ margin:0 0 12px; font-size:18px; font-weight:700 }
.modal-sub{ margin:0 0 16px; color:#475569; font-size:14px }
.list{ margin:0; padding:0; list-style:none }
.list li{ margin:8px 0 }
.btn{
  display:inline-flex; align-items:center; justify-content:center;
  border-radius:12px; border:1px solid #e2e8f0;
  padding:10px 16px; background:#f8fafc; color:#0f172a;
  font-weight:600; cursor:pointer; font-size:14px; width:100%;
  transition:background .2s ease;
}
.btn:hover{ background:#f1f5f9 }
.btn.primary{ background:#0B1321; color:#fff; border-color:transparent; width:auto }
.actions{ margin-top:18px; display:flex; justify-content:flex-end }
`;

export default function MissingInfoDialog({ open, faltando, onClose, onGoTo }: Props) {
  if (!open) return null;

  // mapeia para chaves conhecidas; ignora desconhecidas
  const items = (faltando as FieldKey[]).filter((k) => LABEL[k]);

  return (
    <div
      className="backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <style>{css}</style>
      <div className="small-modal" role="dialog" aria-modal="true">
        <h3 className="modal-title">Informações faltando</h3>
        <p className="modal-sub">
          Alguns dados não foram informados. Clique para ir direto ao campo:
        </p>

        <ul className="list">
          {items.map((k) => (
            <li key={k}>
              <button
                className="btn"
                onClick={() => {
                  // Fecha o alerta e avisa quem chamou para abrir o modal focando no campo.
                  onClose();
                  onGoTo?.(k);
                }}
              >
                Preencher {LABEL[k]}
              </button>
            </li>
          ))}
        </ul>

        <div className="actions">
          <button className="btn primary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
