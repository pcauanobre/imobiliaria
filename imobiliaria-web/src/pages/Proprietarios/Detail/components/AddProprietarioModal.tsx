// pages/Proprietarios/Detail/components/AddProprietarioModal.tsx
// Modal de CRIAÇÃO/EDIÇÃO com CSS de overlay embutido (igual o de edição).

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ===================== Tipos ===================== */
export type Proprietario = {
  id?: number;
  nome: string;
  doc: string;              // CPF (somente dígitos)
  email?: string | null;    // opcional
  tel?: string | null;
  obs?: string | null;

  // Campos do quadro-resumo (front only por enquanto)
  estadoCivil?: string | null;
  ocupacao?: string | null;
  endereco?: {
    logradouro: string;     // nome da rua/avenida
    numero: string;         // número
  };
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
function onlyDigits(v: string) { return (v ?? "").replace(/\D/g, ""); }
function isCpfValid(cpf: string) {
  const s = onlyDigits(cpf);
  if (s.length !== 11) return false;
  if (/^(\d)\1+$/.test(s)) return false;
  const nums = [...s].map((n) => +n);
  const d1 = (nums.slice(0,9).reduce((acc, n, i) => acc + n * (10 - i), 0) * 10) % 11 % 10;
  const d2 = (nums.slice(0,10).reduce((acc, n, i) => acc + n * (11 - i), 0) * 10) % 11 % 10;
  return d1 === nums[9] && d2 === nums[10];
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

  // Back atual ainda não recebe os campos novos; enviamos só o que existe hoje.
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
  width:100%; max-width:900px; background:#fff;
  border:1px solid rgba(2,6,23,.06); border-radius:18px;
  box-shadow:0 14px 40px rgba(2,6,23,.12); padding:20px; box-sizing:border-box;
}
.k{ font-size:12px; color:#64748b; margin:8px 0 6px }
.input, .select{
  width:100%; background:#fff; border:1px solid #e2e8f0; border-radius:14px;
  padding:10px 12px; font-size:15px; outline:none;
  transition: box-shadow .2s ease, border-color .2s ease;
}
.input:focus, .select:focus{ box-shadow:0 0 0 3px rgba(11,19,33,.22); border-color:#94a3b8 }
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
.btn:disabled{ opacity:.5; cursor:not-allowed }
.grid{ display:grid; gap:14px }
.grid-2{ grid-template-columns:1fr 1fr }
.err{ color:#ef4444; font-size:12px; margin-top:4px }
@keyframes highlight {
  0% { box-shadow:0 0 0 0 rgba(239,68,68,.7); border-color:#ef4444; }
  50% { box-shadow:0 0 0 5px rgba(239,68,68,.25); border-color:#ef4444; }
  100% { box-shadow:0 0 0 0 rgba(239,68,68,0); }
}
.flash-once { animation: highlight 1s ease 1; }
.section-title{ font-size:13px; font-weight:700; color:#0f172a; margin-top:6px }
.hr{ height:1px; background:#eef2f7; margin:6px 0 2px }
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
    estadoCivil: "",
    ocupacao: "",
    endereco: { logradouro: "", numero: "" },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nav = useNavigate();

  const inputRefs = useRef<any>({
    id: null,
    nome: null,
    doc: null,
    email: null,
    tel: null,
    obs: null,
    estadoCivil: null,
    ocupacao: null,
    logradouro: null,
    numero: null,
  });

  function focusAndFlash(fieldKey?: string) {
    if (!fieldKey) return;
    const el = inputRefs.current[fieldKey] as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
    if (el) {
      el.focus();
      el.classList.remove("flash-once");
      void (el as any).offsetWidth;
      el.classList.add("flash-once");
    }
  }

  useEffect(() => {
    if (open) {
      if (proprietario) {
        setForm((p) => ({
          ...p,
          ...proprietario,
          estadoCivil: proprietario.estadoCivil ?? "",
          ocupacao: proprietario.ocupacao ?? "",
          endereco: proprietario.endereco ?? { logradouro: "", numero: "" },
        }));
      } else {
        setForm({
          nome: "",
          doc: "",
          email: "",
          tel: "",
          obs: "",
          estadoCivil: "",
          ocupacao: "",
          endereco: { logradouro: "", numero: "" },
        });
      }
      setErrors({});
      setTimeout(() => focusAndFlash(initialFocusField as any), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, proprietario, initialFocusField]);

  if (!open) return null;

  function set<K extends keyof Proprietario>(k: K, v: Proprietario[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }
  function setAddr<K extends keyof NonNullable<Proprietario["endereco"]>>(k: K, v: string) {
    setForm((p) => ({ ...p, endereco: { ...(p.endereco ?? {} as any), [k]: v } as any }));
  }

  function randomize() {
    const nome = randomNome();
    set("nome", nome);
    set("doc", randomCPF());
    set("email", randomEmail(nome));
    set("tel", randomPhone());
    set("estadoCivil", pick(["Solteiro(a)","Casado(a)","Divorciado(a)","Viúvo(a)","União estável"]));
    set("ocupacao", pick(["Analista","Autônomo","Comerciante","Professor(a)","Servidor(a) público(a)"]));
    set("endereco", {
      logradouro: pick(["Rua Beija-flor","Av. Central","Rua das Laranjeiras","Travessa das Flores"]),
      numero: `${r(1,9999)}`,
    });
    set("obs", Math.random() < 0.5 ? "Cliente indicado por parceiro." : "");
  }

  function validate(): { ok: boolean; firstKey?: string } {
    const e: Record<string,string> = {};
    const telDigits = onlyDigits(form.tel ?? "");
    const docDigits = onlyDigits(form.doc ?? "");

    if (!form.nome?.trim()) e["nome"] = "Informe o nome.";
    if (!docDigits) e["doc"] = "Informe o CPF.";
    else if (!isCpfValid(docDigits)) e["doc"] = "CPF inválido.";
    if (!telDigits) e["tel"] = "Informe o telefone.";
    else if (!(telDigits.length === 10 || telDigits.length === 11)) e["tel"] = "Telefone inválido.";
    if (!form.estadoCivil?.trim()) e["estadoCivil"] = "Informe o estado civil.";
    if (!form.ocupacao?.trim()) e["ocupacao"] = "Informe a ocupação.";
    if (!form.endereco?.logradouro?.trim()) e["logradouro"] = "Endereço obrigatório.";
    if (!form.endereco?.numero?.trim()) e["numero"] = "Número obrigatório.";

    setErrors(e);
    const firstKey = Object.keys(e)[0];
    if (firstKey) focusAndFlash(firstKey);
    return { ok: Object.keys(e).length === 0, firstKey };
  }

  const canSubmit = validateLite(form);

  function validateLite(f: Proprietario) {
    const telDigits = onlyDigits(f.tel ?? "");
    const docDigits = onlyDigits(f.doc ?? "");
    return (
      !!f.nome?.trim() &&
      !!docDigits && isCpfValid(docDigits) &&
      !!telDigits && (telDigits.length === 10 || telDigits.length === 11) &&
      !!f.estadoCivil?.trim() &&
      !!f.ocupacao?.trim() &&
      !!f.endereco?.logradouro?.trim() &&
      !!f.endereco?.numero?.trim()
    );
  }

  async function salvar() {
    try {
      const { ok } = validate();
      if (!ok) return;

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
        email: (toNull(form.email) as any), // opcional
        tel: (toNull(form.tel) as any),
        obs: (toNull(form.obs) as any),
        // Guardamos os novos campos no estado; envio ao back fica para quando existir no endpoint/DB
        estadoCivil: (toNull(form.estadoCivil) as any),
        ocupacao: (toNull(form.ocupacao) as any),
        endereco: form.endereco,
      };

      if (proprietario?.id) {
        const res = await fetch(`${API_BASE}/api/v1/proprietarios/${proprietario.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          // Se o back não aceitar extras, envie somente os campos já persistidos:
          body: JSON.stringify({
            nome: payload.nome,
            doc: payload.doc,
            email: payload.email,
            tel: payload.tel,
            obs: payload.obs,
          }),
        });
        if (!res.ok) throw new Error(await res.text());
      } else {
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

        {/* DADOS BÁSICOS */}
        <div className="section-title">Dados do proprietário</div>
        <div className="hr" />
        <div className="grid grid-2">
          <div>
            <div className="k">NOME*</div>
            <input
              id="owner-nome"
              ref={(el) => { inputRefs.current.nome = el; }}
              className="input"
              placeholder="Ex.: Ana Souza"
              value={form.nome}
              onChange={(e) => set("nome", e.target.value)}
            />
            {errors.nome && <div className="err">{errors.nome}</div>}
          </div>

          <div>
            <div className="k">CPF*</div>
            <input
              id="owner-doc"
              ref={(el) => { inputRefs.current.doc = el; }}
              className="input"
              placeholder="Somente números"
              value={form.doc}
              onChange={(e) => set("doc", onlyDigits(e.target.value))}
              inputMode="numeric"
            />
            {errors.doc && <div className="err">{errors.doc}</div>}
          </div>

          <div>
            <div className="k">TELEFONE*</div>
            <input
              id="owner-tel"
              ref={(el) => { inputRefs.current.tel = el; }}
              className="input"
              placeholder="(xx) 9xxxx-xxxx"
              value={form.tel ?? ""}
              onChange={(e) => set("tel", e.target.value)}
            />
            {errors.tel && <div className="err">{errors.tel}</div>}
          </div>

          <div>
            <div className="k">E-MAIL (opcional)</div>
            <input
              id="owner-email"
              ref={(el) => { inputRefs.current.email = el; }}
              className="input"
              placeholder="email@dominio.com"
              type="email"
              value={form.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>

          <div>
            <div className="k">ESTADO CIVIL*</div>
            <select
              ref={(el) => { inputRefs.current.estadoCivil = el; }}
              className="select"
              value={form.estadoCivil ?? ""}
              onChange={(e) => set("estadoCivil", e.target.value)}
            >
              <option value="">Selecione</option>
              <option>Solteiro(a)</option>
              <option>Casado(a)</option>
              <option>Divorciado(a)</option>
              <option>Viúvo(a)</option>
              <option>União estável</option>
            </select>
            {errors.estadoCivil && <div className="err">{errors.estadoCivil}</div>}
          </div>

          <div>
            <div className="k">OCUPAÇÃO/PROFISSÃO*</div>
            <input
              ref={(el) => { inputRefs.current.ocupacao = el; }}
              className="input"
              placeholder="Ex.: Analista, Comerciante…"
              value={form.ocupacao ?? ""}
              onChange={(e) => set("ocupacao", e.target.value)}
            />
            {errors.ocupacao && <div className="err">{errors.ocupacao}</div>}
          </div>
        </div>

        {/* ENDEREÇO (apenas rua e número) */}
        <div className="section-title" style={{ marginTop: 14 }}>Endereço residencial</div>
        <div className="hr" />
        <div className="grid grid-2">
          <div>
            <div className="k">ENDEREÇO (rua/avenida)*</div>
            <input
              ref={(el) => { inputRefs.current.logradouro = el; }}
              className="input"
              placeholder="Ex.: Rua Beija-flor"
              value={form.endereco?.logradouro ?? ""}
              onChange={(e) => setAddr("logradouro", e.target.value)}
            />
            {errors.logradouro && <div className="err">{errors.logradouro}</div>}
          </div>
          <div>
            <div className="k">NÚMERO*</div>
            <input
              ref={(el) => { inputRefs.current.numero = el; }}
              className="input"
              placeholder="Nº"
              value={form.endereco?.numero ?? ""}
              onChange={(e) => setAddr("numero", e.target.value)}
            />
            {errors.numero && <div className="err">{errors.numero}</div>}
          </div>
        </div>

        {/* OBS */}
        <div style={{ marginTop: 10 }}>
          <div className="k">OBSERVAÇÕES</div>
          <textarea
            id="owner-obs"
            ref={(el) => { inputRefs.current.obs = el; }}
            className="input"
            rows={3}
            placeholder="Notas internas..."
            value={form.obs ?? ""}
            onChange={(e) => set("obs", e.target.value)}
          />
        </div>

        <div className="confirm-actions">
          <button className="btn micro lead" onClick={randomize}>
            Randomizar (DEBUG)
          </button>
          <button className="btn micro primary" onClick={salvar} disabled={!canSubmit}>
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
