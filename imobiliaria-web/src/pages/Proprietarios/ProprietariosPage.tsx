// pages/Proprietarios/ProprietariosPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import ImoveisPage from "./ImoveisPage";  // 👈 mantém

/* ============================================================
   CSS (no mesmo arquivo)
   ============================================================ */
const css = `

/* ============================================================
//## SESSAO: ROOT
============================================================ */
:root {
  --bg:#f5f7fb; 
  --card:#fff; 
  --text:#0f172a; 
  --muted:#64748b; 
  --brand:#0B1321;
  --border:#e2e8f0; 
  --ring:0 0 0 3px rgba(11,19,33,.22); 
  --shadow:0 14px 40px rgba(2,6,23,.08);
}

/* ============================================================
//## SESSAO: BASE PAGE & HEADER
============================================================ */
.page { padding:24px }
.header { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px }
.breadcrumb {
  color: var(--muted);
  font-size:14px;
  margin-bottom:24px;
}
.breadcrumb a { color: inherit; text-decoration: none }
.breadcrumb-active { font-weight:700; color: var(--brand) }

/* ============================================================
//## SESSAO: BOTOES GERAIS
============================================================ */
.btn {
  display:inline-flex; align-items:center; gap:8px; border-radius:12px;
  border:1px solid var(--border); padding:10px 16px; background:#f8fafc;
  color:#0f172a; font-weight:700; cursor:pointer; font-size:14px;
  flex:0 0 auto; white-space:nowrap;
}
.btn:hover { filter: brightness(.98) }
.btn.primary { background:var(--brand); color:#fff; border-color:transparent }
.btn.ghost { background:#fff }
.btn.micro { padding:8px 12px; font-size:13px; border-radius:10px }
.btn.big { padding:12px 20px; font-size:15px; border-radius:14px }

/* ============================================================
//## SESSAO: INPUTS
============================================================ */
.input {
  width:100%; background:#fff; border:1px solid var(--border); border-radius:14px;
  padding:12px 14px; font-size:15.5px; outline:none;
}
.input:focus { box-shadow:var(--ring); border-color:#94a3b8 }

/* ============================================================
//## SESSAO: CARDS E TABELAS
============================================================ */
.card { background:var(--card); border:1px solid rgba(2,6,23,.06); border-radius:22px; box-shadow:var(--shadow) }
.cardhead { display:flex; justify-content:space-between; align-items:flex-start; padding:18px 20px; border-bottom:1px solid var(--border) }
.cardhead h2 { margin:0 0 2px; font-size:20px }
.cardhead p { margin:0; color:var(--muted); font-size:13.5px }
.tablewrap { overflow:auto }
.table { width:100%; border-collapse:separate; border-spacing:0 }
.table thead th {
  background:#f8fafc; text-align:left; font-size:12.5px; letter-spacing:.03em;
  color:#475569; padding:12px 16px; border-bottom:1px solid var(--border);
}
.table tbody td { padding:12px 16px; border-bottom:1px solid #eef2f7; font-size:15px }
.table tbody tr:hover { background:#fafafa }
.rowact { display:flex; gap:8px; justify-content:center }
.iconbtn { border:0; background:transparent; padding:8px; border-radius:12px; cursor:pointer; text-decoration:none; color:inherit }
.iconbtn:hover { background:#f1f5f9 }

/* ============================================================
//## SESSAO: POPUPS
============================================================ */
.backdrop{
  position:fixed; inset:0; background:rgba(2,6,23,.45);
  display:flex; align-items:center; justify-content:center; padding:24px; z-index:50;
}
.small-modal{
  width:100%; max-width:820px; background:#fff;
  border:1px solid rgba(2,6,23,.06); border-radius:18px;
  box-shadow:var(--shadow); padding:20px; box-sizing:border-box;
}
.confirm-title{ margin:0 0 10px; font-size:20px }
.confirm-text{ margin:0 0 12px; color:#475569 }
.confirm-input{
  width:100%; border:1px solid var(--border); border-radius:12px;
  padding:12px 14px; font-size:15px;
}

/* Rodapé do modal */
.confirm-actions{
  margin-top:14px;
  display:flex; align-items:center; gap:10px;
  justify-content:flex-end;
  flex-wrap:nowrap;
}
.confirm-actions .btn { flex: 0 0 auto; width: auto; }
.confirm-actions .lead { margin-right: auto; }

/* Botão perigoso */
.danger{
  background:#ef4444; color:#fff; border:0; border-radius:12px;
  padding:10px 16px; cursor:pointer;
}

/* ============================================================
//## SESSAO: BOTAO ADICIONAR
============================================================ */
.btn-add {
  background:#0B132B;
  color:#fff;
  border:0;
  border-radius:12px;
  padding:10px 18px;
  font-size:14px;
  font-weight:500;
  cursor:pointer;
  box-shadow:0 2px 4px rgba(0,0,0,.08);
  transition:background .2s ease;
}
.btn-add:hover { background:#1C2541; }

/* ============================================================
//## SESSAO: DETALHE (TEXTOS, TABS, GRID)
============================================================ */
.k { font-size:12px; color:#64748b }
.v { margin-top:6px; font-size:15.5px }

.tabbar {
  display:flex; gap:8px;
  padding:12px 18px 18px;
  border-bottom:1px solid var(--border)
}
.tab {
  border:1px solid #e5e7eb;
  background:#fff;
  border-radius:999px;
  padding:8px 14px;
  font-weight:600;
  font-size:14px;
  color:#475569;
  cursor:pointer;
  text-decoration:none;
  display:inline-flex;
  align-items:center;
}
.tab:hover { background:#f1f5f9 }
.tab.active {
  background:var(--brand);
  border-color:var(--brand);
  color:#fff;
}

.body { padding:16px 18px }
.grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px }

/* ============================================================
//## SESSAO: BOTAO VOLTAR
============================================================ */
.backline { margin-top:10px; margin-bottom:18px } 
.backbtn {
  display:inline-flex; align-items:center; gap:8px;
  font-weight:800; color:var(--text);
  background:#fff; border:1px solid #e5e7eb; border-radius:12px;
  padding:10px 14px; cursor:pointer; text-decoration:none;
}
.backbtn:hover { background:#f8fafc }
.backbtn svg { display:block }

/* ============================================================
//## SESSAO: BOTOES FIXOS (EMAIL + WHATS)
============================================================ */
.fixedbtn {
  border:1px solid var(--brand);
  background:var(--brand);
  border-radius:999px;
  padding:8px 16px;
  font-weight:600;
  font-size:14px;
  color:#fff;
  cursor:pointer;
  text-decoration:none;
  display:inline-flex;
  align-items:center;
  transition:background .2s ease;
}
.fixedbtn:hover { background:#1C2541; }

/* ===== Bolinha vermelha (badge) no botão da lista ===== */
.badge-dot {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 14px;
  height: 14px;
  background: #ef4444;
  border-radius: 999px;
  border: 2px solid #fff;
}

/* ===== Ícone triangular de alerta grande ===== */
.warn-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid #fee2e2;
  background: #fff5f5;
  color: #ef4444;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 8px; /* espaço entre o nome e o ícone */
}
.warn-icon:hover {
  filter: brightness(0.95);
}

/* ===== Popup "o que está faltando" ===== */
.missing-list{ margin:10px 0 0; padding-left:18px; }
.missing-list li{ margin:6px 0; }

/* ===== Efeito de destaque leve no input alvo ===== */
@keyframes flashOnce {
  0% { box-shadow:0 0 0 0 rgba(239,68,68,0.00) }
  20%{ box-shadow:0 0 0 4px rgba(239,68,68,0.20) }
  100%{ box-shadow:0 0 0 0 rgba(239,68,68,0.00) }
}
.flash-once{ animation: flashOnce 1.1s ease-out 1 }
`



/* ============================================================
   Tipos + Utils (no mesmo arquivo)
   ============================================================ */
type Proprietario = {
  id?: number;
  nome: string;
  doc: string;
  email?: string | null;
  tel?: string | null;
  obs?: string | null;
};

type PageResp<T> =
  | { content: T[]; totalElements: number; totalPages: number; number: number; size: number }
  | T[];

function formatDoc(doc?: string | null) {
  const d = (doc ?? "").replace(/\D/g, "");
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  return doc ?? "-";
}

/* ===== Regras do "incompleto" ===== */
const FIELD_LABEL: Record<keyof Proprietario, string> = {
  id: "ID",
  nome: "Nome",
  doc: "CPF/CNPJ",
  email: "E-mail",
  tel: "Telefone",
  obs: "Observações",
};

function camposVazios(p?: Proprietario | null) {
  if (!p) return [] as (keyof Proprietario)[];
  const faltando: (keyof Proprietario)[] = [];
  (["nome", "doc", "email", "tel"] as (keyof Proprietario)[]).forEach((k) => {
    const v = (p as any)[k];
    if (v == null || String(v).trim() === "") faltando.push(k);
  });
  // se quiser considerar obs também, descomente:
  // if (!p.obs || p.obs.trim() === "") faltando.push("obs");
  return faltando;
}

/* Helpers para Randomizar (DEBUG) */
function r(min:number,max:number){ return Math.floor(Math.random()*(max-min+1))+min; }
function pick<T>(arr:T[]){ return arr[r(0,arr.length-1)]; }
function randomNome(){
  const nomes=["Ana","Carlos","Felipe","Helena","Igor","Júlia","Marcos","Otávio","Paula","Rafaela"];
  const sobren=["Silva","Souza","Oliveira","Pereira","Lima","Gomes","Costa","Almeida"];
  return `${pick(nomes)} ${pick(sobren)}`;
}
function randomCPF(){
  const n=Array.from({length:9},()=>r(0,9));
  const d1=(n[0]*10+n[1]*9+n[2]*8+n[3]*7+n[4]*6+n[5]*5+n[6]*4+n[7]*3+n[8]*2)%11;
  const dv1=d1<2?0:11-d1;
  const d2=(n[0]*11+n[1]*10+n[2]*9+n[3]*8+n[4]*7+n[5]*6+n[6]*5+n[7]*4+n[8]*3+dv1*2)%11;
  const dv2=d2<2?0:11-d2;
  return [...n,dv1,dv2].join("");
}
function randomPhone(){
  const ddd=pick([11,21,31,41,47,61,71,81]);
  return `(${ddd}) 9${r(1000,9999)}-${r(1000,9999)}`;
}
function randomEmail(nome:string){
  const slug=nome.toLowerCase().replace(/\s+/g,".");
  const dom=pick(["gmail.com","outlook.com","hotmail.com"]);
  return `${slug}${r(1,9999)}@${dom}`;
}

/* ============================================================
   API (no mesmo arquivo)
   ============================================================ */
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function listProprietarios(): Promise<Proprietario[]> {
  const res = await fetch(`${API_BASE}/api/v1/proprietarios`);
  if (!res.ok) throw new Error("Erro ao carregar");
  const data: PageResp<Proprietario> = await res.json();
  return Array.isArray(data) ? data : (data.content ?? []);
}
async function getProprietario(id: number): Promise<Proprietario> {
  const res = await fetch(`${API_BASE}/api/v1/proprietarios/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar detalhes");
  return res.json();
}
async function createProprietario(p: Proprietario): Promise<Proprietario> {
  const payload = {
    nome: p.nome,
    doc: (p.doc ?? "").replace(/\D/g, ""),
    email: p.email || null,
    tel: p.tel || null,
    obs: p.obs || null,
  };
  const res = await fetch(`${API_BASE}/api/v1/proprietarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
async function deleteProprietario(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/v1/proprietarios/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

/* ============================================================
   Popups: Add Proprietário / Confirmar Exclusão / Sucesso
   ============================================================ */
function AddProprietarioModal({
  open,
  onClose,
  onSaved,
  proprietario,           // ⚡ prop nova: proprietário existente para edição
  initialFocusField,      // ⚡ novo: campo para focar e "piscar"
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
    const el = inputRefs.current[field];
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
      // Permitir campos vazios
      const payload: Proprietario = {
        nome: form.nome?.trim() || "",
        doc: (form.doc ?? "").replace(/\D/g, "") || "",
        email: form.email?.trim() || null,
        tel: form.tel?.trim() || null,
        obs: form.obs?.trim() || null,
      };

      if (proprietario?.id) {
        // Edição -> PUT
        const res = await fetch(`${API_BASE}/api/v1/proprietarios/${proprietario.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
      } else {
        // Criação -> POST
        const novo = await createProprietario(payload);
        const slug = `${encodeURIComponent(novo.nome.replace(/\s+/g, "-"))}-${novo.id}`;
        nav(`/proprietarios/${slug}`, { state: { owner: novo } });
      }

      await onSaved();
      onClose();
    } catch (e: any) {
      alert(`Falha ao salvar proprietário.\n${e?.message ?? e}`);
    }
  }

  return (
    <div className="backdrop" onClick={(e) => e.currentTarget === e.target && onClose()}>
      <div className="small-modal" role="dialog" aria-modal="true">
        <h3 className="confirm-title">{proprietario ? "Editar proprietário" : "Criar proprietário"}</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <div className="k">NOME</div>
            <input
              id="owner-nome"
              ref={(el: HTMLInputElement | null) => { inputRefs.current.nome = el; }}
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
              ref={(el: HTMLInputElement | null) => { inputRefs.current.doc = el; }}
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
              ref={(el: HTMLInputElement | null) => { inputRefs.current.email = el; }}
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
              ref={(el: HTMLInputElement | null) => { inputRefs.current.tel = el; }}
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
              ref={(el: HTMLTextAreaElement | null) => { inputRefs.current.obs = el; }}
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

function ConfirmDeleteDialog({
  open, onClose, onConfirm,
}: { open: boolean; onClose: () => void; onConfirm: () => Promise<void> | void }) {
  const [text, setText] = useState("");
  if (!open) return null;
  const can = text.trim().toLowerCase() === "excluir";
  return (
    <div className="backdrop" onClick={(e) => e.currentTarget === e.target && onClose()}>
      <div className="small-modal" role="dialog" aria-modal="true">
        <h3 className="confirm-title">Confirmar exclusão</h3>
        <p className="confirm-text">Esta ação é irreversível. Para confirmar, digite <b>Excluir</b>.</p>
        <input className="confirm-input" placeholder="Digite 'Excluir'" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="confirm-actions">
          <button className="btn micro" onClick={onClose}>Cancelar</button>
          <button className="danger" disabled={!can} onClick={async () => can && (await onConfirm())} style={{ opacity: can ? 1 : 0.6 }}>
            Excluir definitivamente
          </button>
        </div>
      </div>
    </div>
  );
}
function SuccessDialog({ open, onClose, message = "Excluído com sucesso." }: { open: boolean; onClose: () => void; message?: string }) {
  if (!open) return null;
  return (
    <div className="backdrop" onClick={(e)=>e.currentTarget===e.target && onClose()}>
      <div className="small-modal" role="dialog" aria-modal="true">
        <h3 className="confirm-title">✅ Sucesso</h3>
        <p className="confirm-text">{message}</p>
        <div className="confirm-actions"><button className="btn primary" onClick={onClose}>OK</button></div>
      </div>
    </div>
  );
}

/* ============================================================
   POPUP: lista de informações faltando
   ============================================================ */
function MissingInfoDialog({
  open, onClose, faltando, onGoTo
}: {
  open: boolean;
  onClose: () => void;
  faltando: (keyof Proprietario)[];
  onGoTo: (field: keyof Proprietario) => void;
}) {
  if (!open) return null;
  return (
    <div className="backdrop" onClick={(e) => e.currentTarget === e.target && onClose()}>
      <div className="small-modal" role="dialog" aria-modal="true">
        <h3 className="confirm-title">Informações faltando</h3>
        <p className="confirm-text">Alguns dados não foram informados. Clique para ir direto ao campo:</p>
        <ul className="missing-list">
          {faltando.map((k) => (
            <li key={k}>
              <button className="btn micro"
                onClick={() => { onGoTo(k); onClose(); }}
                style={{ marginTop: 4 }}>
                Preencher {FIELD_LABEL[k]}
              </button>
            </li>
          ))}
        </ul>
        <div className="confirm-actions">
          <button className="btn micro" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   LISTA
   ============================================================ */
function ProprietariosListView() {
  const [owners, setOwners] = useState<Proprietario[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [toDelete, setToDelete] = useState<number | null>(null);

  async function carregar() {
    setLoading(true);
    try {
      const data = await listProprietarios();
      setOwners(data);
    } catch (e) {
      console.error(e);
      alert("Falha ao carregar proprietários.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { carregar(); }, []);

  const filtrados = useMemo(() => {
    const w = q.trim().toLowerCase();
    if (!w) return owners;
    return owners.filter((o) => (o.nome ?? "").toLowerCase().includes(w) || (o.doc ?? "").includes(w));
  }, [owners, q]);

  function slugify(nome: string, id?: number) {
    return `${encodeURIComponent(nome.replace(/\s+/g, "-"))}-${id ?? Math.floor(Math.random() * 10000)}`;
  }

  return (
    <div className="page">
      <style>{css}</style>

      <div className="header">
        <div className="breadcrumb">
          <Link to="/dashboard">Dashboard</Link> / <span className="breadcrumb-active">Proprietários</span>
        </div>
        <div />
      </div>

      <div style={{ margin: "8px auto 16px", maxWidth: 560 }}>
        <input className="input" placeholder="Buscar por nome ou CPF/CNPJ" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <section className="card">
        <div className="cardhead">
          <div>
            <h2>Proprietários</h2>
            <p>Gerencie dados, documentos e vínculos com imóveis.</p>
          </div>
          <button
            className="btn-add"
            onClick={() => setAddOpen(true)}
          >
            Adicionar proprietário
          </button>
        </div>

        <div className="tablewrap">
          <table className="table">
            <thead>
              <tr>
                <th>NOME</th>
                <th>CPF/CNPJ</th>
                <th>E-MAIL</th>
                <th>TELEFONE</th>
                <th>OBSERVAÇÕES</th>
                <th style={{ textAlign: "center" }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: 24, textAlign: "center", color: "#64748b" }}>Carregando...</td></tr>
              ) : filtrados.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 24, textAlign: "center", color: "#64748b" }}>Nenhum proprietário encontrado.</td></tr>
              ) : (
                filtrados.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link
                        className="btn micro"
                        to={`/proprietarios/${slugify(o.nome, o.id)}`}
                        state={{ owner: o }}
                        style={{ position: "relative", display: "inline-block" }}
                      >
                        {o.nome || "(sem nome)"}
                        {camposVazios(o).length > 0 && <span className="badge-dot" />}
                      </Link>
                    </td>
                    <td>{formatDoc(o.doc)}</td>
                    <td>{o.email || "-"}</td>
                    <td>{o.tel || "-"}</td>
                    <td>{o.obs || "-"}</td>
                    <td>
                      <div className="rowact">
                        <Link
                          className="iconbtn"
                          title="Detalhes"
                          to={`/proprietarios/${slugify(o.nome, o.id)}`}
                          state={{ owner: o }}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                            <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                        <button
                          className="iconbtn"
                          title="Excluir"
                          onClick={() => { setToDelete(o.id!); setConfirmOpen(true); }}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M9 6v12m6-12v12M10 6l1-2h2l1 2M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <AddProprietarioModal open={addOpen} onClose={() => setAddOpen(false)} onSaved={carregar} />
      <ConfirmDeleteDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          if (!toDelete) return;
          await deleteProprietario(toDelete);
          setConfirmOpen(false);
          setToDelete(null);
          await carregar();
          setSuccessOpen(true);
        }}
      />
      <SuccessDialog open={successOpen} onClose={() => setSuccessOpen(false)} message="🗑️ Excluído com sucesso." />
    </div>
  );
}


/* ============================================================
   DETALHE
   ============================================================ */
function ProprietarioDetalheView() {
  const { slug } = useParams(); // usa :slug
  const nav = useNavigate();
  const location = useLocation() as any; // precisamos de state e pathname

  const [owner, setOwner] = useState<Proprietario | null | undefined>(
    location.state?.owner ?? undefined
  );
  const [editOpen, setEditOpen] = useState(false);

  // popup + campo que deve receber o foco
  const [missingOpen, setMissingOpen] = useState(false);
  const [focusField, setFocusField] = useState<keyof Proprietario | undefined>(undefined);

  useEffect(() => {
    if (!slug) {
      nav("/proprietarios", { replace: true });
      return;
    }

    // Extrai id do slug: "Marcos-Oliveira-9" => 9
    const decoded = decodeURIComponent(slug);
    const partes = decoded.split("-");
    const idParte = Number(partes[partes.length - 1]);

    if (!idParte) {
      nav("/proprietarios", { replace: true });
      return;
    }

    (async () => {
      try {
        const dto = await getProprietario(idParte);
        setOwner(dto);
      } catch {
        if (!location.state?.owner) setOwner(null);
      }
    })();
  }, [slug]);

  // ---- Tabs: base e ativo pela URL ----
  const base = `/proprietarios/${slug}`;
  const isImoveis = (location.pathname as string).endsWith("/imoveis");

  return (
    <div className="page">
      <style>{css}</style>

      <div className="header">
        <div className="breadcrumb">
          <Link to="/dashboard">Dashboard</Link> /{" "}
          <Link to="/proprietarios">Proprietários</Link> /{" "}
          <span className="breadcrumb-active">
            {owner ? owner.nome : "Detalhe"}
          </span>
        </div>
        <div />
      </div>

      {owner === undefined ? (
        <section className="card">
          <div className="body" style={{ color: "#64748b" }}>
            Carregando...
          </div>
        </section>
      ) : owner === null ? (
        <section className="card">
          <div className="body" style={{ color: "#64748b" }}>
            Proprietário não encontrado.
          </div>
        </section>
      ) : (
        <section className="card">
          <div className="cardhead">
            <div style={{ flex: 1 }}>
              <div className="backline">
                <Link to="/proprietarios" className="backbtn" title="Voltar">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M15 19l-7-7 7-7"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Voltar
                </Link>
              </div>
              <h2 style={{ display: "flex", alignItems: "center" }}>
                {owner.nome}
                {camposVazios(owner).length > 0 && (
                  <button
                    className="warn-icon"
                    title="Dados incompletos"
                    onClick={() => setMissingOpen(true)}
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
                      <path d="M12 3l9 16H3L12 3z" strokeWidth="2" />
                      <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2" />
                      <circle cx="12" cy="17" r="1.2" />
                    </svg>
                  </button>
                )}
              </h2>

              <div style={{ color: "#64748b" }}>
                {formatDoc(owner.doc)} · 0 imóveis
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {owner.email && (
                <a
                  className="fixedbtn"
                  href={`mailto:${owner.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir email
                </a>
              )}
              {owner.tel && (
                <a
                  className="fixedbtn"
                  href={`https://wa.me/${owner.tel.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir WhatsApp
                </a>
              )}
              <button className="fixedbtn" onClick={() => setEditOpen(true)}>
                Editar
              </button>
            </div>
          </div>

          <div className="tabbar">
            <Link to={base} className={`tab ${!isImoveis ? "active" : ""}`}>
              Dados
            </Link>
            <span className="tab">Documentos</span>
            <Link
              to={`${base}/imoveis`}
              className={`tab ${isImoveis ? "active" : ""}`}
            >
              Imóveis
            </Link>
          </div>

          <div className="body">
            <div className="grid">
              <div>
                <div className="k">NOME</div>
                <div className="v">{owner.nome}</div>
              </div>
              <div>
                <div className="k">CPF/CNPJ</div>
                <div className="v">{formatDoc(owner.doc)}</div>
              </div>
              <div>
                <div className="k">E-MAIL</div>
                <div className="v">{owner.email || "-"}</div>
              </div>
              <div>
                <div className="k">TELEFONE</div>
                <div className="v">{owner.tel || "-"}</div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div className="k">OBSERVAÇÕES</div>
                <div className="v">{owner.obs || "-"}</div>
              </div>
            </div>
          </div>

          {/* Popup de faltantes */}
          <MissingInfoDialog
            open={missingOpen}
            onClose={() => setMissingOpen(false)}
            faltando={camposVazios(owner)}
            onGoTo={(field) => {
              setFocusField(field);   // qual input deve focar e piscar
              setEditOpen(true);      // abre modal de edição
            }}
          />
        </section>
      )}

      {/* --- Modal de edição --- */}
      {owner && (
        <AddProprietarioModal
          open={editOpen}
          onClose={() => { setEditOpen(false); setFocusField(undefined); }}
          onSaved={async () => {
            if (owner.id) {
              const atualizado = await getProprietario(owner.id);
              setOwner(atualizado);
            }
            setEditOpen(false);
            setFocusField(undefined);
          }}
          proprietario={owner}
          initialFocusField={focusField}
        />
      )}
    </div>
  );
}



/* ============================================================
   Export principal: decide por rota (lista x detalhe)
   ============================================================ */
export default function ProprietariosPage() {
  const { slug } = useParams();
  const location = useLocation();

  if (!slug) return <ProprietariosListView />;

  if (location.pathname.includes("/imoveis")) {
    return <ImoveisPage />;
  }

  return <ProprietarioDetalheView />;
}
