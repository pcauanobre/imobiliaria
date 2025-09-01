// pages/Proprietarios/ProprietariosPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";

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
  margin-bottom:24px;   /* <-- adiciona espaço */
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

/* Rodapé do modal (NÃO deixa nada esticar e alinha à direita) */
.confirm-actions{
  margin-top:14px;
  display:flex; align-items:center; gap:10px;
  justify-content:flex-end;        /* tudo à direita */
  flex-wrap:nowrap;                /* evita quebra */
}
.confirm-actions .btn {
  flex: 0 0 auto;   /* não cresce */
  width: auto;      /* não estica */
}
.confirm-actions .lead {
  margin-right: auto; /* só serve pra empurrar, sem esticar */
}

/* Botão perigoso (diálogo de exclusão) */
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
  padding:12px 18px 18px; /* padding-bottom aumentado */
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
  padding:10px 14px; cursor:pointer;
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
  // agora retorna o objeto criado (com id)
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
  open, onClose, onSaved,
}: { open: boolean; onClose: () => void; onSaved: () => Promise<void> | void }) {
  const [form, setForm] = useState<Proprietario>({ nome: "", doc: "", email: "", tel: "", obs: "" });
  const nav = useNavigate(); // navegação SPA

  useEffect(() => {
    if (open) setForm({ nome: "", doc: "", email: "", tel: "", obs: "" });
  }, [open]);

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
      if (!form.nome.trim()) return alert("Informe o nome.");
      if (!form.doc.trim()) return alert("Informe CPF/CNPJ.");
      const novo = await createProprietario(form);
      await onSaved();
      onClose();

      const slug = `${encodeURIComponent(novo.nome.replace(/\s+/g, "-"))}-${novo.id}`;
      nav(`/proprietarios/${slug}`, { state: { owner: novo } });
    } catch (e: any) {
      alert(`Falha ao criar proprietário.\n${e?.message ?? e}`);
    }
  }

  return (
    <div className="backdrop" onClick={(e) => e.currentTarget === e.target && onClose()}>
      <div className="small-modal" role="dialog" aria-modal="true">
        <h3 className="confirm-title">Criar proprietário</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <div className="k">NOME</div>
            <input
              className="input"
              placeholder="Ex.: Ana Souza"
              value={form.nome}
              onChange={(e) => set("nome", e.target.value)}
            />
          </div>
          <div>
            <div className="k">CPF/CNPJ</div>
            <input
              className="input"
              placeholder="Somente números"
              value={form.doc}
              onChange={(e) => set("doc", e.target.value)}
            />
          </div>
          <div>
            <div className="k">E-MAIL</div>
            <input
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
              className="input"
              placeholder="(xx) 9xxxx-xxxx"
              value={form.tel ?? ""}
              onChange={(e) => set("tel", e.target.value)}
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <div className="k">OBSERVAÇÕES</div>
            <textarea
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
                      >
                        {o.nome}
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
  const { slug } = useParams(); // 👈 usa :slug
  const nav = useNavigate();
  const location = useLocation() as { state?: { owner?: Proprietario } };

  const [owner, setOwner] = useState<Proprietario | null | undefined>(
    location.state?.owner ?? undefined
  );

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

  return (
    <div className="page">
      <style>{css}</style>

      <div className="header">
        <div className="breadcrumb">
          <Link to="/dashboard">Dashboard</Link> /{" "}
          <Link to="/proprietarios">Proprietários</Link> /{" "}
          <span className="breadcrumb-active">{owner ? owner.nome : "Detalhe"}</span>
        </div>
        <div />
      </div>

      {owner === undefined ? (
        <section className="card">
          <div className="body" style={{ color: "#64748b" }}>Carregando...</div>
        </section>
      ) : owner === null ? (
        <section className="card">
          <div className="body" style={{ color: "#64748b" }}>Proprietário não encontrado.</div>
        </section>
      ) : (
        <section className="card">
          <div className="cardhead">
            <div style={{ flex: 1 }}>
              <div className="backline">
                <button className="backbtn" onClick={() => nav(-1)} title="Voltar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M15 19l-7-7 7-7"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Voltar
                </button>
              </div>

              <h2>{owner.nome}</h2>
              <div style={{ color: "#64748b" }}>{formatDoc(owner.doc)} · 0 imóveis</div>
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
            </div>
          </div>

          <div className="tabbar">
            <span className="tab active">Dados</span>
            <span className="tab">Documentos</span>
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
        </section>
      )}
    </div>
  );
}


/* ============================================================
   Export principal: decide por rota (lista x detalhe)
   ============================================================ */
export default function ProprietariosPage() {
  const { slug } = useParams(); // 👈 usa :slug aqui também
  return slug ? <ProprietarioDetalheView /> : <ProprietariosListView />;
}
