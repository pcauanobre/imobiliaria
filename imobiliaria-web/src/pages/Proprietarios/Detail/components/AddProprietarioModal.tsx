// pages/Proprietarios/Detail/components/AddProprietarioModal.tsx
// Modal de CRIAÇÃO/EDIÇÃO com CSS de overlay embutido (igual o de edição).

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ===================== Tipos ===================== */
export type Proprietario = {
  id?: number;
  nome: string;
  doc: string;
  email?: string | null;
  tel?: string | null;
  obs?: string | null;
};

/* ===================== Helpers ===================== */
function r(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick<T>(arr: T[]) { return arr[r(0, arr.length - 1)]; }
function randomNome() {
  const nomes = ["Ana","Carlos","Felipe","Helena","Igor","Júlia","Marcos","Otávio","Paula","Rafaela"];
  const sobren = ["Silva","Souza","Oliveira","Pereira","Lima","Gomes","Costa","Almeida"];
  return `${pick(nomes)} ${pick(sobren)}`;
}
function randomCPF() {
  const n = Array.from({ length: 9 }, () => r(0, 9));
  const d1 = (n[0]*10+n[1]*9+n[2]*8+n[3]*7+n[4]*6+n[5]*5+n[6]*4+n[7]*3+n[8]*2)%11;
  const dv1 = d1 < 2 ? 0 : 11 - d1;
  const d2 = (n[0]*11+n[1]*10+n[2]*9+n[3]*8+n[4]*7+n[5]*6+n[6]*5+n[7]*4+n[8]*3+dv1*2)%11;
  const dv2 = d2 < 2 ? 0 : 11 - d2;
  return [...n, dv1, dv2].join("");
}
function randomPhone() {
  const ddd = pick([11,21,31,41,47,61,71,81]);
  return `(${ddd}) 9${r(1000,9999)}-${r(1000,9999)}`;
}
function randomEmail(nome: string) {
  const slug = nome.toLowerCase().replace(/\s+/g, ".");
  const dom = pick(["gmail.com","outlook.com","hotmail.com"]);
  return `${slug}${r(1,9999)}@${dom}`;
}

/* ===================== API ===================== */
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function createProprietario(p: Proprietario): Promise<Proprietario> {
  const toNull = (v?: string | null) => {
    const t = (v ?? "").trim();
    return t ? t : null;
  };
  const onlyDigitsOrNull = (v?: string | null) => {
    const t = (v ?? "").replace(/\D/g, "");
    return t ? t : null;
  };

  const payload = {
    nome: toNull(p.nome),
    doc: onlyDigitsOrNull(p.doc),
    email: toNull(p.email),
    tel: toNull(p.tel),
    obs: toNull(p.obs),
  };

  const res = await fetch(`${API_BASE}/api/v1/proprietarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/* ===================== CSS embutido ===================== */
const modalCss = `
.backdrop{
  position:fixed; inset:0; background:rgba(2,6,23,.45);
  display:flex; align-items:center; justify-content:center;
  padding:24px; z-index:70;
}
.small-modal{
  width:100%; max-width:820px; background:#fff;
  border:1px solid rgba(2,6,23,.06); border-radius:18px;
  box-shadow:0 14px 40px rgba(2,6,23,.12); padding:20px; box-sizing:border-box;
}
.k{ font-size:12px; color:#64748b; margin:8px 0 6px }
.input{
  width:100%; background:#fff; border:1px solid #e2e8f0; border-radius:14px;
  padding:10px 12px; font-size:15px; outline:none;
  transition: box-shadow .2s ease, border-color .2s ease;
}
.input:focus{ box-shadow:0 0 0 3px rgba(11,19,33,.22); border-color:#94a3b8 }
.confirm-title{ font-size:16px; font-weight:700; margin:0 0 12px }
.confirm-actions{
  display:flex; justify-content:flex-end; gap:10px; margin-top:20px;
}
.confirm-actions .btn{ flex:0 0 auto; min-width:120px; width:auto !important; }
.btn{
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  border-radius:12px; border:1px solid #e2e8f0;
  padding:10px 16px; background:#f8fafc; color:#0f172a;
  font-weight:700; cursor:pointer; font-size:14px;
}
.btn:hover{ filter:brightness(.98) }
.btn.micro{ padding:8px 12px; font-size:13px; }
.btn.primary{ background:#0B1321; color:#fff; border-color:transparent }
.btn.lead{ background:#fff }
@keyframes highlight {
  0% { box-shadow:0 0 0 0 rgba(239,68,68,.7); border-color:#ef4444; }
  50% { box-shadow:0 0 0 5px rgba(239,68,68,.25); border-color:#ef4444; }
  100% { box-shadow:0 0 0 0 rgba(239,68,68,0); }
}
.flash-once { animation: highlight 1s ease 1; }
`;

/* ===================== Componente ===================== */
export default function AddProprietarioModal({
  open,
  onClose,
  onSaved,
  proprietario,
  initialFocusField,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
  proprietario?: Proprietario;
  initialFocusField?: keyof Proprietario;
}) {
  const [form, setForm] = useState<Proprietario>({
    nome: "",
    doc: "",
    email: "",
    tel: "",
    obs: "",
  });
  const nav = useNavigate();

  const inputRefs = useRef<{
    id: HTMLInputElement | null;
    nome: HTMLInputElement | null;
    doc: HTMLInputElement | null;
    email: HTMLInputElement | null;
    tel: HTMLInputElement | null;
    obs: HTMLTextAreaElement | null;
  }>({
    id: null,
    nome: null,
    doc: null,
    email: null,
    tel: null,
    obs: null,
  });

  function focusAndFlash(field?: keyof Proprietario) {
    if (!field) return;
    const el = (inputRefs.current as any)[field] as HTMLInputElement | HTMLTextAreaElement | null;
    if (el) {
      el.focus();
      el.classList.remove("flash-once");
      void (el as any).offsetWidth; // força reflow
      el.classList.add("flash-once");
    }
  }

  useEffect(() => {
    if (open) {
      if (proprietario) setForm(proprietario);
      else setForm({ nome: "", doc: "", email: "", tel: "", obs: "" });
      setTimeout(() => focusAndFlash(initialFocusField), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, proprietario, initialFocusField]);

  if (!open) return null;

  function set<K extends keyof Proprietario>(k: K, v: Proprietario[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function randomize() {
    const nome = randomNome();
    set("nome", nome);
    set("doc", randomCPF());
    set("email", randomEmail(nome));
    set("tel", randomPhone());
    set("obs", Math.random() < 0.5 ? "Cliente indicado por parceiro." : "");
  }

  async function salvar() {
    try {
      const toNull = (v?: string | null) => {
        const t = (v ?? "").trim();
        return t ? t : null;
      };
      const onlyDigitsOrNull = (v?: string | null) => {
        const t = (v ?? "").replace(/\D/g, "");
        return t ? t : null;
      };

      const payload: Proprietario = {
        nome: (toNull(form.nome) as any),
        doc: (onlyDigitsOrNull(form.doc) as any),
        email: (toNull(form.email) as any),
        tel: (toNull(form.tel) as any),
        obs: (toNull(form.obs) as any),
      };

      if (proprietario?.id) {
        // Edição
        const res = await fetch(`${API_BASE}/api/v1/proprietarios/${proprietario.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
      } else {
        // Criação
        const novo = await createProprietario(payload);
        const baseNome = (novo?.nome ?? "proprietario").toString().trim();
        const safeNome = baseNome ? baseNome.replace(/\s+/g, "-") : "proprietario";
        const slug = `${encodeURIComponent(safeNome)}-${novo.id}`;
        nav(`/proprietarios/${slug}`, { state: { owner: novo } });
      }

      await onSaved();
      onClose();
    } catch (e: any) {
      alert(`Falha ao salvar proprietário.\n${e?.message ?? e}`);
    }
  }

  return (
    <div className="backdrop">
      <style>{modalCss}</style>
      {/* impedir propagação de cliques dentro do modal (não fecha ao clicar fora) */}
      <div
        className="small-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="confirm-title">{proprietario ? "Editar proprietário" : "Criar proprietário"}</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <div className="k">NOME</div>
            <input
              id="owner-nome"
              ref={(el) => { (inputRefs.current as any).nome = el; }}
              className="input"
              placeholder="Ex.: Ana Souza"
              value={form.nome}
              onChange={(e) => set("nome", e.target.value)}
            />
          </div>

          <div>
            <div className="k">CPF/CNPJ</div>
            <input
              id="owner-doc"
              ref={(el) => { (inputRefs.current as any).doc = el; }}
              className="input"
              placeholder="Somente números"
              value={form.doc}
              onChange={(e) => set("doc", e.target.value)}
            />
          </div>

          <div>
            <div className="k">E-MAIL</div>
            <input
              id="owner-email"
              ref={(el) => { (inputRefs.current as any).email = el; }}
              className="input"
              placeholder="email@dominio.com"
              type="email"
              value={form.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>

          <div>
            <div className="k">TELEFONE</div>
            <input
              id="owner-tel"
              ref={(el) => { (inputRefs.current as any).tel = el; }}
              className="input"
              placeholder="(xx) 9xxxx-xxxx"
              value={form.tel ?? ""}
              onChange={(e) => set("tel", e.target.value)}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <div className="k">OBSERVAÇÕES</div>
            <textarea
              id="owner-obs"
              ref={(el) => { (inputRefs.current as any).obs = el; }}
              className="input"
              rows={4}
              placeholder="Notas internas..."
              value={form.obs ?? ""}
              onChange={(e) => set("obs", e.target.value)}
            />
          </div>
        </div>

        <div className="confirm-actions">
          <button className="btn micro lead" onClick={randomize}>
            Randomizar (DEBUG)
          </button>
          <button className="btn micro primary" onClick={salvar}>
            Concluir
          </button>
          <button className="btn micro" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
