// pages/Proprietarios/Detail/components/EditProprietarioModal.tsx
// Modal de EDIÇÃO do proprietário com os MESMOS campos do "Criar":
// Nome, CPF/CNPJ, E-mail, Telefone, Endereço (rua + número), Estado civil, Ocupação, Observações.
// - foco + "piscada" no campo indicado (initialFocusField)
// - badge vermelho no input enquanto estiver vazio
// - botões com largura correta

import { useEffect, useMemo, useRef, useState } from "react";

/* ===================== Tipos ===================== */
export type Proprietario = {
  id?: number;
  nome: string | null;
  doc: string | null;
  email?: string | null;
  tel?: string | null;
  obs?: string | null;

  // extras (ainda que o back não persista agora):
  endereco?: string | null;     // Rua + número (texto único)
  estadoCivil?: string | null;
  ocupacao?: string | null;
};

type FieldKey =
  | "nome" | "doc" | "email" | "tel" | "obs"
  | "endereco" | "estadoCivil" | "ocupacao";

type Props = {
  open: boolean;
  owner: Proprietario;
  onClose: () => void;
  onSaved?: (p: Proprietario) => void;
  /** Campo que deve receber foco e "piscar" ao abrir */
  initialFocusField?: FieldKey;
};

/* ===================== Helpers ===================== */
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const toNull = (v?: string | null) => {
  const t = (v ?? "").trim();
  return t ? t : null;
};
const onlyDigitsOrNull = (v?: string | null) => {
  const t = (v ?? "").replace(/\D/g, "");
  return t ? t : null;
};

/* ===================== CSS ===================== */
const modalCss = `
.backdrop{
  position:fixed; inset:0; background:rgba(2,6,23,.45);
  display:flex; align-items:center; justify-content:center;
  padding:24px; z-index:60;
}
.small-modal{
  width:100%; max-width:820px; background:#fff;
  border:1px solid rgba(2,6,23,.06); border-radius:18px;
  box-shadow:0 14px 40px rgba(2,6,23,.12); padding:20px; box-sizing:border-box;
}
.formgrid{ display:grid; grid-template-columns:1fr 1fr; gap:12px }
.full{ grid-column:1 / -1 }
.inputwrap{ position:relative } /* para posicionar a badge */

.input{
  width:100%; background:#fff; border:1px solid #e2e8f0; border-radius:14px;
  padding:10px 12px; font-size:15px; outline:none;
  transition: box-shadow .2s ease, border-color .2s ease;
}
.input:focus{ box-shadow:0 0 0 3px rgba(11,19,33,.22); border-color:#94a3b8 }
.label{ font-size:12px; color:#64748b; margin:8px 0 6px }

/* Botões corrigidos */
.actions{
  display:flex;
  justify-content:flex-end;
  gap:10px;
  margin-top:20px;
}
.actions .btn{ flex:0 0 auto; min-width:120px; width:auto !important; }
.btn{
  display:inline-flex; align-items:center; justify-content:center;
  gap:8px;
  border-radius:12px; border:1px solid #e2e8f0;
  padding:10px 16px;
  background:#f8fafc; color:#0f172a;
  font-weight:700; cursor:pointer; font-size:14px;
}
.btn:hover{ filter:brightness(.98) }
.btn.primary{ background:#0B1321; color:#fff; border-color:transparent }
.modal-title{ font-size:16px; font-weight:700; margin:0 0 12px }

/* Efeito de "piscar" (highlight) */
@keyframes highlight {
  0% { box-shadow:0 0 0 0 rgba(239,68,68,.7); border-color:#ef4444; }
  50% { box-shadow:0 0 0 5px rgba(239,68,68,.25); border-color:#ef4444; }
  100% { box-shadow:0 0 0 0 rgba(239,68,68,0); }
}
.flash { animation: highlight 1s ease 2; }

/* Bolinha vermelha no canto do input */
.badge-dot{
  position:absolute; top:-6px; right:-6px;
  width:14px; height:14px; background:#ef4444;
  border-radius:999px; border:2px solid #fff;
  box-shadow:0 0 0 1px rgba(0,0,0,.06);
}
`;

/* ===================== Componente ===================== */
export default function EditProprietarioModal({
  open,
  owner,
  onClose,
  onSaved,
  initialFocusField,
}: Props) {
  // estados dos campos (mesmos do criar + extras)
  const [nome, setNome] = useState(owner?.nome ?? "");
  const [doc, setDoc] = useState(owner?.doc ?? "");
  const [email, setEmail] = useState(owner?.email ?? "");
  const [tel, setTel] = useState(owner?.tel ?? "");
  const [endereco, setEndereco] = useState(owner?.endereco ?? "");
  const [estadoCivil, setEstadoCivil] = useState(owner?.estadoCivil ?? "");
  const [ocupacao, setOcupacao] = useState(owner?.ocupacao ?? "");
  const [obs, setObs] = useState(owner?.obs ?? "");
  const [saving, setSaving] = useState(false);

  // refs para foco
  const nomeRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const telRef = useRef<HTMLInputElement>(null);
  const enderecoRef = useRef<HTMLInputElement>(null);
  const estadoCivilRef = useRef<HTMLInputElement>(null);
  const ocupacaoRef = useRef<HTMLInputElement>(null);
  const obsRef = useRef<HTMLTextAreaElement>(null);

  // campo que deve "piscar"
  const [flash, setFlash] = useState<FieldKey | undefined>(undefined);

  // badges: enquanto vazio => mostra
  const isEmpty = {
    nome: (nome ?? "").trim() === "",
    doc: (doc ?? "").trim() === "",
    email: (email ?? "").trim() === "",
    tel: (tel ?? "").trim() === "",
    endereco: (endereco ?? "").trim() === "",
    estadoCivil: (estadoCivil ?? "").trim() === "",
    ocupacao: (ocupacao ?? "").trim() === "",
    obs: (obs ?? "").trim() === "",
  };

  useEffect(() => {
    if (open) {
      setNome(owner?.nome ?? "");
      setDoc(owner?.doc ?? "");
      setEmail(owner?.email ?? "");
      setTel(owner?.tel ?? "");
      setEndereco(owner?.endereco ?? "");
      setEstadoCivil(owner?.estadoCivil ?? "");
      setOcupacao(owner?.ocupacao ?? "");
      setObs(owner?.obs ?? "");
      setSaving(false);

      if (initialFocusField) {
        setTimeout(() => {
          focusField(initialFocusField);
          setFlash(initialFocusField);
          setTimeout(() => setFlash(undefined), 2000);
        }, 0);
      }
    }
  }, [open, owner, initialFocusField]);

  function focusField(k: FieldKey) {
    const ref =
      k === "nome" ? nomeRef :
      k === "doc" ? docRef :
      k === "email" ? emailRef :
      k === "tel" ? telRef :
      k === "endereco" ? enderecoRef :
      k === "estadoCivil" ? estadoCivilRef :
      k === "ocupacao" ? ocupacaoRef :
      obsRef;
    ref.current?.focus();
    ref.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  const canSave = useMemo(() => {
    return (nome ?? "").trim().length > 0 && (doc ?? "").trim().length > 0 && !!owner?.id;
  }, [nome, doc, owner?.id]);

  async function handleSave() {
    if (!canSave || !owner?.id) return;
    setSaving(true);
    try {
      const payload: Proprietario = {
        id: owner.id,
        nome: toNull(nome),
        doc: onlyDigitsOrNull(doc),
        email: toNull(email),
        tel: toNull(tel),
        obs: toNull(obs),
        // extras:
        endereco: toNull(endereco),
        estadoCivil: toNull(estadoCivil),
        ocupacao: toNull(ocupacao),
      };

      const res = await fetch(`${API_BASE}/api/v1/proprietarios/${owner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // se o back não devolver os extras, mantemos o payload local
      const updated: Proprietario = await res.json().catch(() => payload);
      onSaved?.(updated);
    } catch (e) {
      console.error(e);
      alert("Falha ao salvar proprietário.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <style>{modalCss}</style>
      <div className="small-modal" role="dialog" aria-modal="true" aria-labelledby="edit-prop-title">
        <h3 id="edit-prop-title" className="modal-title">Editar proprietário</h3>

        <div className="formgrid">
          <div>
            <div className="label">NOME</div>
            <div className="inputwrap">
              <input
                ref={nomeRef}
                className={`input ${flash === "nome" ? "flash" : ""}`}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
              />
              {isEmpty.nome && <span className="badge-dot" />}
            </div>
          </div>

          <div>
            <div className="label">CPF/CNPJ</div>
            <div className="inputwrap">
              <input
                ref={docRef}
                className={`input ${flash === "doc" ? "flash" : ""}`}
                value={doc}
                onChange={(e) => setDoc(e.target.value)}
                placeholder="Somente números"
              />
              {isEmpty.doc && <span className="badge-dot" />}
            </div>
          </div>

          <div>
            <div className="label">E-MAIL</div>
            <div className="inputwrap">
              <input
                ref={emailRef}
                className={`input ${flash === "email" ? "flash" : ""}`}
                value={email ?? ""}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@dominio.com"
              />
              {isEmpty.email && <span className="badge-dot" />}
            </div>
          </div>

          <div>
            <div className="label">TELEFONE</div>
            <div className="inputwrap">
              <input
                ref={telRef}
                className={`input ${flash === "tel" ? "flash" : ""}`}
                value={tel ?? ""}
                onChange={(e) => setTel(e.target.value)}
                placeholder="(xx) 9xxxx-xxxx"
              />
              {isEmpty.tel && <span className="badge-dot" />}
            </div>
          </div>

          <div className="full">
            <div className="label">ENDEREÇO (rua e número)</div>
            <div className="inputwrap">
              <input
                ref={enderecoRef}
                className={`input ${flash === "endereco" ? "flash" : ""}`}
                value={endereco ?? ""}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Ex.: Rua das Flores, 123"
              />
              {isEmpty.endereco && <span className="badge-dot" />}
            </div>
          </div>

          <div>
            <div className="label">ESTADO CIVIL</div>
            <div className="inputwrap">
              <input
                ref={estadoCivilRef}
                className={`input ${flash === "estadoCivil" ? "flash" : ""}`}
                value={estadoCivil ?? ""}
                onChange={(e) => setEstadoCivil(e.target.value)}
                placeholder="Ex.: Solteiro(a)"
              />
              {isEmpty.estadoCivil && <span className="badge-dot" />}
            </div>
          </div>

          <div>
            <div className="label">OCUPAÇÃO</div>
            <div className="inputwrap">
              <input
                ref={ocupacaoRef}
                className={`input ${flash === "ocupacao" ? "flash" : ""}`}
                value={ocupacao ?? ""}
                onChange={(e) => setOcupacao(e.target.value)}
                placeholder="Ex.: Analista, Autônomo..."
              />
              {isEmpty.ocupacao && <span className="badge-dot" />}
            </div>
          </div>

          <div className="full">
            <div className="label">OBSERVAÇÕES</div>
            <div className="inputwrap">
              <textarea
                ref={obsRef}
                className={`input ${flash === "obs" ? "flash" : ""}`}
                rows={4}
                value={obs ?? ""}
                onChange={(e) => setObs(e.target.value)}
                placeholder="Notas internas…"
              />
              {isEmpty.obs && <span className="badge-dot" />}
            </div>
          </div>
        </div>

        <div className="actions">
          <button className="btn" onClick={onClose} disabled={saving}>Cancelar</button>
          <button className="btn primary" onClick={handleSave} disabled={!canSave || saving}>
            {saving ? "Salvando..." : "Concluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
