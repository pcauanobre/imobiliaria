import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

/* ============================================================
   CSS — mesmo look&feel dos Proprietários
   ============================================================ */
const css = `
:root{
  --bg:#f5f7fb; --card:#fff; --text:#0f172a; --muted:#64748b; --brand:#0B1321;
  --border:#e2e8f0; --ring:0 0 0 3px rgba(11,19,33,.22); --shadow:0 14px 40px rgba(2,6,23,.08);
}
.page{ padding:24px }
.header{ display:flex; align-items:center; justify-content:space-between; margin-bottom:8px }
.breadcrumb{ color:var(--muted); font-size:14px; margin-bottom:24px }
.breadcrumb a{ color:inherit; text-decoration:none }
.breadcrumb-active{ font-weight:700; color:var(--brand) }

.btn{ display:inline-flex; align-items:center; gap:8px; border-radius:12px; border:1px solid var(--border);
  padding:10px 16px; background:#f8fafc; color:#0f172a; font-weight:700; cursor:pointer; font-size:14px; flex:0 0 auto }
.btn:hover{ filter:brightness(.98) }
.btn.primary{ background:var(--brand); color:#fff; border-color:transparent }
.btn.micro{ padding:8px 12px; font-size:13px; border-radius:10px }
.btn-add{ background:#0B132B; color:#fff; border:0; border-radius:12px; padding:10px 18px; font-size:14px; font-weight:500; cursor:pointer;
  box-shadow:0 2px 4px rgba(0,0,0,.08); transition:background .2s ease }
.btn-add:hover{ background:#1C2541 }

.input{ width:100%; background:#fff; border:1px solid var(--border); border-radius:14px; padding:12px 14px; font-size:15.5px; outline:none }
.input:focus{ box-shadow:var(--ring); border-color:#94a3b8 }
select.input{ appearance:none; background:#fff }
textarea.input{ resize:vertical }

.card{ background:var(--card); border:1px solid rgba(2,6,23,.06); border-radius:22px; box-shadow:var(--shadow) }
.cardhead{ display:flex; justify-content:space-between; align-items:flex-start; padding:18px 20px; border-bottom:1px solid var(--border) }
.cardhead h2{ margin:0 0 2px; font-size:20px }
.cardhead p{ margin:0; color:var(--muted); font-size:13.5px }
.tablewrap{ overflow:auto }
.table{ width:100%; border-collapse:separate; border-spacing:0 }
.table thead th{ background:#f8fafc; text-align:left; font-size:12.5px; letter-spacing:.03em; color:#475569; padding:12px 16px; border-bottom:1px solid var(--border) }
.table tbody td{ padding:12px 16px; border-bottom:1px solid #eef2f7; font-size:15px }
.table tbody tr:hover{ background:#fafafa }
.rowact{ display:flex; gap:8px; justify-content:center }
.iconbtn{ border:0; background:transparent; padding:8px; border-radius:12px; cursor:pointer; text-decoration:none; color:inherit }
.iconbtn:hover{ background:#f1f5f9 }

.tabbar{ display:flex; gap:8px; padding:12px 18px 18px; border-bottom:1px solid var(--border) }
.tab{ border:1px solid #e5e7eb; background:#fff; border-radius:999px; padding:8px 14px; font-weight:600; font-size:14px; color:#475569; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center }
.tab:hover{ background:#f1f5f9 }
.tab.active{ background:var(--brand); border-color:var(--brand); color:#fff }

.body{ padding:16px 18px }
.k{ font-size:12px; color:#64748b }
.v{ margin-top:6px; font-size:15.5px }

.backline{ margin-top:10px; margin-bottom:18px }
.backbtn{ display:inline-flex; align-items:center; gap:8px; font-weight:800; color:var(--text);
  background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:10px 14px; cursor:pointer; text-decoration:none }
.backbtn:hover{ background:#f8fafc }
.backbtn svg{ display:block }

/* ===== Popup ===== */
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
.confirm-actions{
  margin-top:14px; display:flex; align-items:center; gap:10px; justify-content:flex-end; flex-wrap:nowrap
}
.confirm-actions .btn{ flex:0 0 auto; width:auto }
.confirm-actions .lead{ margin-right:auto }

/* Abas do modal */
.modal-tabs{ display:flex; gap:10px; border-bottom:1px solid var(--border); padding:10px 0 14px }
.modal-tab{ border:1px solid #e5e7eb; background:#fff; border-radius:999px; padding:8px 14px; font-weight:700; font-size:14px; color:#475569; cursor:pointer }
.modal-tab.active{ background:var(--brand); border-color:var(--brand); color:#fff }
.modal-content{
  padding-top:16px;
  min-height:300px;
  max-height:500px;
  overflow-y:auto;
}
.grid2{ display:grid; grid-template-columns:1fr 1fr; gap:14px }

.thumbgrid{ display:grid; grid-template-columns:repeat(4,1fr); gap:8px }
.thumb{ width:100%; aspect-ratio:1/1; object-fit:cover; border:1px solid var(--border); border-radius:10px }

/* badge usado depois (ex.: pendente) */
.badge-dot{
  position:absolute; top:-4px; right:-4px; width:14px; height:14px;
  background:#ef4444; border-radius:999px; border:2px solid #fff;
}
`;

/* ============================================================
   Tipos
   ============================================================ */
type Proprietario = {
  id?: number;
  nome: string;
  doc: string;
  email?: string | null;
  tel?: string | null;
  obs?: string | null;
};

type Imovel = {
  id?: number;
  end?: string | null;
  tipo?: string | null;
  situacao?: string | null;
  obs?: string | null;

  // extras (opcionais – usados na tela de detalhe)
  finalidade?: string | null;
  cep?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;

  area?: number | null;
  quartos?: number | null;
  banheiros?: number | null;
  vagas?: number | null;
  iptu?: number | null;
  condominio?: number | null;
  anoConstrucao?: number | null;
  disponivelEm?: string | null; // yyyy-MM-dd
};

/* ============================================================
   Helpers
   ============================================================ */
function r(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick<T>(arr: T[]) { return arr[r(0, arr.length - 1)]; }
const toNull = (s?: string | null) => { const t = (s ?? "").trim(); return t ? t : null; };
const toNum = (s?: string | null) => { const t = (s ?? "").trim(); return t ? Number(t) : null; };

function getImovelFormPreset() {
  const tipos = ["Casa", "Apartamento", "Kitnet", "Sala Comercial", "Terreno", "Galpão"];
  const situacoes = ["Ativo", "Locado", "Desocupado", "Inativo"];
  function randomEnd() {
    const ruas = ["Av. Brasil", "Rua das Flores", "Rua das Limeiras", "Av. Beira Mar", "Rua Bahia", "Rua XV de Novembro"];
    const bairros = ["Centro", "Jardim Europa", "Boa Vista", "São José", "Nova Esperança"];
    return `${pick(ruas)}, ${r(10, 999)} - ${pick(bairros)}`;
  }
  function random() {
    return {
      end: randomEnd(),
      tipo: pick(tipos),
      situacao: pick(situacoes),
      obs: Math.random() < 0.6 ? "Imóvel captado via indicação." : ""
    };
  }
  return { tipos, situacoes, random };
}

/* ============================================================
   API
   ============================================================ */
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function getProprietario(id: number): Promise<Proprietario> {
  const res = await fetch(`${API_BASE}/api/v1/proprietarios/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar proprietário");
  return res.json();
}

async function listImoveisByOwner(ownerId: number): Promise<Imovel[]> {
  let data: any;
  const res = await fetch(`${API_BASE}/api/v1/proprietarios/${ownerId}/imoveis`);
  if (res.ok) data = await res.json();
  else {
    const res2 = await fetch(`${API_BASE}/api/v1/imoveis?ownerId=${ownerId}`);
    if (!res2.ok) throw new Error("Erro ao listar imóveis");
    data = await res2.json();
  }
  const arr: any[] = Array.isArray(data) ? data : (data?.content ?? []);
  return arr.map((d) => ({ ...d, end: d.endereco ?? d.end ?? null })) as Imovel[];
}

async function getImovel(id: number): Promise<Imovel> {
  const res = await fetch(`${API_BASE}/api/v1/imoveis/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar imóvel");
  const dto = await res.json();
  return { ...dto, end: dto.endereco ?? dto.end ?? null };
}

async function createImovel(ownerId: number, body: any): Promise<Imovel> {
  const payload = {
    end: toNull(body.end),
    tipo: toNull(body.tipo),
    situacao: toNull(body.situacao),
    obs: toNull(body.obs),
    finalidade: toNull(body.finalidade),
    cep: toNull(body.cep),
    numero: toNull(body.numero),
    complemento: toNull(body.complemento),
    bairro: toNull(body.bairro),
    cidade: toNull(body.cidade),
    uf: toNull(body.uf),
    area: toNum(body.area),
    quartos: toNum(body.quartos),
    banheiros: toNum(body.banheiros),
    vagas: toNum(body.vagas),
    iptu: toNum(body.iptu),
    condominio: toNum(body.condominio),
    anoConstrucao: toNum(body.anoConstrucao),
    disponivelEm: toNull(body.disponivelEm),
  };
  const res = await fetch(`${API_BASE}/api/v1/proprietarios/${ownerId}/imoveis`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  const dto = await res.json();
  return { ...dto, end: dto.endereco ?? dto.end ?? null };
}

async function updateImovel(id: number, body: any): Promise<Imovel> {
  const res = await fetch(`${API_BASE}/api/v1/imoveis/${id}`, {
    method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  const dto = await res.json();
  return { ...dto, end: dto.endereco ?? dto.end ?? null };
}

async function deleteImovel(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/v1/imoveis/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

/* ============================================================
   Modal: Adicionar/Editar Imóvel
   ============================================================ */
function AddImovelModal({
  open, onClose, ownerName, onSaved, ownerId, imovel,
}: {
  open: boolean;
  onClose: () => void;
  ownerName: string;
  ownerId: number;
  onSaved: () => Promise<void> | void;
  imovel?: Imovel; // se vier, edita
}) {
  const preset = getImovelFormPreset();
  const [tab, setTab] = useState<"info" | "contratos" | "docs" | "fotos">("info");

  const [form, setForm] = useState({
    end: "",
    tipo: preset.tipos[0]!,
    situacao: preset.situacoes[0]!,
    obs: "",
    cep: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "SP",
    area: "",
    quartos: "",
    banheiros: "",
    vagas: "",
    anoConstrucao: "",
    iptu: "",
    condominio: "",
    finalidade: "Aluguel",
    disponivelEm: "",
  });

  const [docs, setDocs] = useState<File[]>([]);
  const fileDocsRef = useRef<HTMLInputElement | null>(null);

  const MAX_SLOTS = 5;
  const [fotoSlots, setFotoSlots] = useState<(File | null)[]>(Array(MAX_SLOTS).fill(null));
  const fotoRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (open) {
      setTab("info");
      if (imovel) {
        setForm({
          end: imovel.end ?? "",
          tipo: String(imovel.tipo ?? preset.tipos[0]),
          situacao: String(imovel.situacao ?? preset.situacoes[0]),
          obs: imovel.obs ?? "",
          cep: imovel.cep ?? "",
          numero: imovel.numero ?? "",
          complemento: imovel.complemento ?? "",
          bairro: imovel.bairro ?? "",
          cidade: imovel.cidade ?? "",
          uf: imovel.uf ?? "SP",
          area: String(imovel.area ?? ""),
          quartos: String(imovel.quartos ?? ""),
          banheiros: String(imovel.banheiros ?? ""),
          vagas: String(imovel.vagas ?? ""),
          anoConstrucao: String(imovel.anoConstrucao ?? ""),
          iptu: String(imovel.iptu ?? ""),
          condominio: String(imovel.condominio ?? ""),
          finalidade: String(imovel.finalidade ?? "Aluguel"),
          disponivelEm: imovel.disponivelEm ?? "",
        });
      } else {
        setForm({
          end: "",
          tipo: preset.tipos[0]!,
          situacao: preset.situacoes[0]!,
          obs: "",
          cep: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          uf: "SP",
          area: "",
          quartos: "",
          banheiros: "",
          vagas: "",
          anoConstrucao: "",
          iptu: "",
          condominio: "",
          finalidade: "Aluguel",
          disponivelEm: "",
        });
      }
      setDocs([]);
      setFotoSlots(Array(MAX_SLOTS).fill(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, imovel]);

  if (!open) return null;

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function randomize() {
    const base = preset.random();
    setForm((p) => ({
      ...p,
      end: base.end,
      tipo: base.tipo ?? p.tipo,
      situacao: base.situacao ?? p.situacao,
      obs: base.obs ?? "",
      cep: `${r(10, 99)}${r(100, 999)}-${r(100, 999)}`.slice(0, 9),
      numero: String(r(10, 9999)),
      complemento: Math.random() < 0.4 ? "Apto " + r(11, 120) : "",
      bairro: "Centro",
      cidade: "São Paulo",
      uf: "SP",
      area: String(r(35, 280)),
      quartos: String(r(1, 5)),
      banheiros: String(r(1, 4)),
      vagas: String(r(0, 3)),
      anoConstrucao: String(r(1975, 2024)),
      iptu: String(r(50, 1200)),
      condominio: String(r(0, 1800)),
      finalidade: pick(["Aluguel", "Venda", "Ambos"]),
      disponivelEm: "",
    }));
  }

  function handleChangeFoto(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setFotoSlots((arr) => { const cp = arr.slice(); cp[i] = file; return cp; });
  }
  function removerFoto(i: number) {
    setFotoSlots((arr) => { const cp = arr.slice(); cp[i] = null; return cp; });
    if (fotoRefs.current[i]) fotoRefs.current[i]!.value = "";
  }

  async function salvar() {
    try {
      if (!form.end.trim()) return alert("Informe o endereço.");
      const payload = {
        end: form.end, tipo: form.tipo, situacao: form.situacao, obs: form.obs,
        finalidade: form.finalidade, cep: form.cep, numero: form.numero, complemento: form.complemento,
        bairro: form.bairro, cidade: form.cidade, uf: form.uf, area: form.area, quartos: form.quartos,
        banheiros: form.banheiros, vagas: form.vagas, iptu: form.iptu, condominio: form.condominio,
        anoConstrucao: form.anoConstrucao, disponivelEm: form.disponivelEm,
      };

      if (imovel?.id) await updateImovel(imovel.id, payload);
      else await createImovel(ownerId, payload);

      // upload opcional de docs/fotos (se backend existir)
      // try { ... FormData ... POST /imoveis/:id/docs } catch {}

      await onSaved();
      onClose();
    } catch (e: any) {
      alert(`Falha ao salvar imóvel.\n${e?.message ?? e}`);
    }
  }

  return (
    <div className="backdrop" onClick={(e) => e.currentTarget === e.target && onClose()}>
      <div className="small-modal" role="dialog" aria-modal="true">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <h3 className="confirm-title" style={{ margin: 0 }}>{imovel ? "Editar imóvel" : "Adicionar imóvel"} •</h3>
          <div className="k" style={{ fontWeight: 700 }}>{ownerName}</div>
          <div style={{ marginLeft: "auto" }}>
            <button className="btn micro" onClick={onClose}>Fechar</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button className={`modal-tab ${tab === "info" ? "active" : ""}`} onClick={() => setTab("info")}>Informações</button>
          <button className={`modal-tab ${tab === "contratos" ? "active" : ""}`} onClick={() => setTab("contratos")}>Contratos</button>
          <button className={`modal-tab ${tab === "docs" ? "active" : ""}`} onClick={() => setTab("docs")}>Documentos</button>
          <button className={`modal-tab ${tab === "fotos" ? "active" : ""}`} onClick={() => setTab("fotos")}>Fotos</button>
        </div>

        {/* Conteúdo */}
        <div className="modal-content">
          {tab === "info" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <div className="k">ENDEREÇO</div>
                <input className="input" placeholder="Ex.: Rua ABC, 123 - Centro"
                  value={form.end} onChange={(e) => set("end", e.target.value)} />
              </div>
              <div>
                <div className="k">TIPO</div>
                <select className="input" value={form.tipo} onChange={(e) => set("tipo", e.target.value)}>
                  {preset.tipos.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <div className="k">SITUAÇÃO</div>
                <select className="input" value={form.situacao} onChange={(e) => set("situacao", e.target.value)}>
                  {preset.situacoes.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <div className="k">FINALIDADE</div>
                <select className="input" value={form.finalidade} onChange={(e) => set("finalidade", e.target.value as any)}>
                  <option>Aluguel</option><option>Venda</option><option>Ambos</option>
                </select>
              </div>

              <div><div className="k">CEP</div><input className="input" placeholder="00000-000" value={form.cep} onChange={(e) => set("cep", e.target.value)} /></div>
              <div><div className="k">NÚMERO</div><input className="input" placeholder="Ex.: 123" value={form.numero} onChange={(e) => set("numero", e.target.value)} /></div>
              <div><div className="k">COMPLEMENTO</div><input className="input" placeholder="Apto / Bloco / Casa" value={form.complemento} onChange={(e) => set("complemento", e.target.value)} /></div>
              <div><div className="k">BAIRRO</div><input className="input" placeholder="Ex.: Centro" value={form.bairro} onChange={(e) => set("bairro", e.target.value)} /></div>

              <div><div className="k">CIDADE</div><input className="input" placeholder="Ex.: São Paulo" value={form.cidade} onChange={(e) => set("cidade", e.target.value)} /></div>
              <div>
                <div className="k">UF</div>
                <select className="input" value={form.uf} onChange={(e) => set("uf", e.target.value)}>
                  {["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"].map(uf => <option key={uf}>{uf}</option>)}
                </select>
              </div>

              <div><div className="k">ÁREA (m²)</div><input className="input" placeholder="Ex.: 120" value={form.area} onChange={(e) => set("area", e.target.value)} /></div>
              <div><div className="k">QUARTOS</div><input className="input" placeholder="Ex.: 3" value={form.quartos} onChange={(e) => set("quartos", e.target.value)} /></div>
              <div><div className="k">BANHEIROS</div><input className="input" placeholder="Ex.: 2" value={form.banheiros} onChange={(e) => set("banheiros", e.target.value)} /></div>
              <div><div className="k">VAGAS</div><input className="input" placeholder="Ex.: 1" value={form.vagas} onChange={(e) => set("vagas", e.target.value)} /></div>

              <div><div className="k">IPTU (R$/mês)</div><input className="input" placeholder="Ex.: 120" value={form.iptu} onChange={(e) => set("iptu", e.target.value)} /></div>
              <div><div className="k">CONDOMÍNIO (R$/mês)</div><input className="input" placeholder="Ex.: 450" value={form.condominio} onChange={(e) => set("condominio", e.target.value)} /></div>
              <div><div className="k">ANO DE CONSTRUÇÃO</div><input className="input" placeholder="Ex.: 2005" value={form.anoConstrucao} onChange={(e) => set("anoConstrucao", e.target.value)} /></div>
              <div><div className="k">DISPONÍVEL A PARTIR DE</div><input className="input" type="date" value={form.disponivelEm} onChange={(e) => set("disponivelEm", e.target.value)} /></div>

              <div style={{ gridColumn: "1 / -1" }}>
                <div className="k">OBSERVAÇÕES</div>
                <textarea className="input" rows={4} placeholder="Notas internas..." value={form.obs} onChange={(e) => set("obs", e.target.value)} />
              </div>
            </div>
          )}

          {tab === "contratos" && (
            <div>
              <div className="k" style={{ marginBottom: 8 }}>
                (Opcional) Integração de contratos vai aqui. Por enquanto, apenas informativo.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><div className="k">NÚMERO DO CONTRATO</div><input className="input" placeholder="Ex.: 2025-001 (opcional)" /></div>
                <div><div className="k">VALOR</div><input className="input" placeholder="Ex.: R$ 2.500,00 (opcional)" /></div>
                <div><div className="k">INÍCIO</div><input className="input" type="date" /></div>
                <div><div className="k">FIM</div><input className="input" type="date" /></div>
              </div>
            </div>
          )}

          {tab === "docs" && (
            <div>
              <div className="k" style={{ marginBottom: 8 }}>Selecione arquivos (PDF/Imagens).</div>
              <input ref={fileDocsRef} type="file" accept=".pdf,image/*" multiple onChange={(e) => setDocs(Array.from(e.target.files ?? []))} />
              <div className="k" style={{ marginTop: 8 }}>{docs.length} arquivo(s) selecionado(s).</div>
            </div>
          )}

          {tab === "fotos" && (
            <div>
              <div className="k" style={{ marginBottom: 10 }}>Adicione até 5 fotos. Clique em cada quadrado para escolher.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
                {Array.from({ length: MAX_SLOTS }).map((_, i) => {
                  const file = fotoSlots[i];
                  const preview = file ? URL.createObjectURL(file) : null;
                  return (
                    <div key={i} style={{
                      position: "relative", width: "100%", aspectRatio: "1/1",
                      border: "1px dashed #cbd5e1", borderRadius: 12, background: "#f8fafc",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden", cursor: "pointer"
                    }}
                      onClick={() => fotoRefs.current[i]?.click()}
                      title={file ? "Trocar foto" : "Selecionar foto"}
                    >
                      {preview ? (
                        <img src={preview} style={{ width: "100%", height: "100%", objectFit: "cover" }} onLoad={() => URL.revokeObjectURL(preview)} />
                      ) : (
                        <div className="k" style={{ textAlign: "center" }}>+ Foto {i + 1}</div>
                      )}

                      {file && (
                        <button className="btn micro" style={{ position: "absolute", top: 8, right: 8 }}
                          onClick={(e) => { e.stopPropagation(); removerFoto(i); }}>
                          Remover
                        </button>
                      )}

                      <input
                        ref={(el: HTMLInputElement | null) => { if (el) fotoRefs.current[i] = el; }}
                        type="file" accept="image/*" hidden
                        onChange={(e) => handleChangeFoto(i, e)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="confirm-actions">
          <button className="btn micro lead" onClick={randomize}>Randomizar (DEBUG)</button>
          <button className="btn micro primary" onClick={salvar}>{imovel ? "Salvar alterações" : "Concluir"}</button>
          <button className="btn micro" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Tela de Detalhe do Imóvel
   ============================================================ */
function ImovelDetailView({
  owner, imovelId, slug
}: {
  owner: Proprietario;
  imovelId: number;
  slug: string;
}) {
  const nav = useNavigate();
  const [imovel, setImovel] = useState<Imovel | null | undefined>(undefined);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const dto = await getImovel(imovelId);
        setImovel(dto);
      } catch (e) {
        console.error(e);
        setImovel(null);
      }
    })();
  }, [imovelId]);

  return (
    <div className="page">
      <style>{css}</style>

      <div className="header">
        <div className="breadcrumb">
          <Link to="/dashboard">Dashboard</Link> /{" "}
          <Link to="/proprietarios">Proprietários</Link> /{" "}
          <Link to={`/proprietarios/${slug}`}>{owner?.nome ?? "Proprietário"}</Link> /{" "}
          <span className="breadcrumb-active">Imóvel</span>
        </div>
        <div />
      </div>

      {imovel === undefined ? (
        <section className="card">
          <div className="body" style={{ color: "#64748b" }}>Carregando...</div>
        </section>
      ) : imovel === null ? (
        <section className="card">
          <div className="body" style={{ color: "#64748b" }}>Imóvel não encontrado.</div>
        </section>
      ) : (
        <section className="card">
          <div className="cardhead">
            <div style={{ flex: 1 }}>
              <div className="backline">
                <button className="backbtn" onClick={() => nav(-1)} title="Voltar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Voltar
                </button>
              </div>
              <h2>{imovel.end || `Imóvel #${imovelId}`}</h2>
              <div style={{ color: "#64748b" }}>
                {imovel.tipo || "-"} · {imovel.situacao || "-"}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="fixedbtn" onClick={() => setEditOpen(true)}>Editar</button>
            </div>
          </div>

          <div className="tabbar">
            <a className="tab active">Informações</a>
            <a className="tab">Documentos</a>
            <a className="tab">Fotos</a>
          </div>

          <div className="body">
            <div className="grid2">
              <div>
                <div className="k">ENDEREÇO</div>
                <div className="v">{imovel.end || "-"}</div>
              </div>
              <div>
                <div className="k">TIPO</div>
                <div className="v">{imovel.tipo || "-"}</div>
              </div>
              <div>
                <div className="k">SITUAÇÃO</div>
                <div className="v">{imovel.situacao || "-"}</div>
              </div>
              <div>
                <div className="k">FINALIDADE</div>
                <div className="v">{imovel.finalidade || "-"}</div>
              </div>

              <div>
                <div className="k">CEP</div>
                <div className="v">{imovel.cep || "-"}</div>
              </div>
              <div>
                <div className="k">NÚMERO</div>
                <div className="v">{imovel.numero || "-"}</div>
              </div>
              <div>
                <div className="k">COMPLEMENTO</div>
                <div className="v">{imovel.complemento || "-"}</div>
              </div>
              <div>
                <div className="k">BAIRRO</div>
                <div className="v">{imovel.bairro || "-"}</div>
              </div>

              <div>
                <div className="k">CIDADE</div>
                <div className="v">{imovel.cidade || "-"}</div>
              </div>
              <div>
                <div className="k">UF</div>
                <div className="v">{imovel.uf || "-"}</div>
              </div>

              <div>
                <div className="k">ÁREA (m²)</div>
                <div className="v">{imovel.area ?? "-"}</div>
              </div>
              <div>
                <div className="k">QUARTOS</div>
                <div className="v">{imovel.quartos ?? "-"}</div>
              </div>
              <div>
                <div className="k">BANHEIROS</div>
                <div className="v">{imovel.banheiros ?? "-"}</div>
              </div>
              <div>
                <div className="k">VAGAS</div>
                <div className="v">{imovel.vagas ?? "-"}</div>
              </div>

              <div>
                <div className="k">IPTU (R$/mês)</div>
                <div className="v">{imovel.iptu ?? "-"}</div>
              </div>
              <div>
                <div className="k">CONDOMÍNIO (R$/mês)</div>
                <div className="v">{imovel.condominio ?? "-"}</div>
              </div>
              <div>
                <div className="k">ANO DE CONSTRUÇÃO</div>
                <div className="v">{imovel.anoConstrucao ?? "-"}</div>
              </div>
              <div>
                <div className="k">DISPONÍVEL A PARTIR DE</div>
                <div className="v">{imovel.disponivelEm || "-"}</div>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <div className="k">OBSERVAÇÕES</div>
                <div className="v">{imovel.obs || "-"}</div>
              </div>
            </div>

            {/* seção de documentos */}
            <div style={{ marginTop: 18 }}>
              <div className="k" style={{ marginBottom: 8 }}>Documentos (PDF/Imagens) — demonstração</div>
              <input className="input" type="file" multiple accept=".pdf,image/*" />
            </div>

            {/* seção de fotos */}
            <div style={{ marginTop: 18 }}>
              <div className="k" style={{ marginBottom: 8 }}>Fotos (pré-visualização) — demonstração</div>
              <div className="thumbgrid">
                {/* placeholders/miniaturas futuras */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="thumb" />
                ))}
              </div>
            </div>
          </div>

          {owner && (
            <AddImovelModal
              open={editOpen}
              onClose={() => setEditOpen(false)}
              ownerName={owner.nome}
              ownerId={owner.id!}
              imovel={imovel}
              onSaved={async () => {
                if (imovel?.id) {
                  const novo = await getImovel(imovel.id);
                  setImovel(novo);
                }
                setEditOpen(false);
              }}
            />
          )}
        </section>
      )}
    </div>
  );
}

/* ============================================================
   Página de Imóveis do Proprietário (lista) — e decide se abre detalhe
   ============================================================ */
export default function ImoveisPage() {
  const { slug } = useParams();
  const nav = useNavigate();
  const location = useLocation() as { state?: { owner?: Proprietario } };

  const [owner, setOwner] = useState<Proprietario | null | undefined>(location.state?.owner ?? undefined);
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [confirm, setConfirm] = useState<{ open: boolean; id?: number }>({ open: false });
  const [addOpen, setAddOpen] = useState(false);

  const ownerId = (() => {
    if (!slug) return undefined;
    const parts = decodeURIComponent(slug).split("-");
    const id = Number(parts[parts.length - 1]);
    return Number.isFinite(id) ? id : undefined;
  })();

  // detecta se é rota de detalhe: /proprietarios/:slug/imoveis/:imovelId
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const match = pathname.match(/\/imoveis\/(\d+)(?:\/)?$/);
  const imovelId = match ? Number(match[1]) : undefined;

  useEffect(() => {
    if (!slug || !ownerId) {
      nav("/proprietarios", { replace: true });
      return;
    }
    (async () => {
      try {
        if (!owner) {
          const dto = await getProprietario(ownerId);
          setOwner(dto);
        }
        setLoading(true);
        const items = await listImoveisByOwner(ownerId);
        setImoveis(items);
      } catch (e) {
        console.error(e);
        setImoveis([]);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, ownerId]);

  // Se há imovelId na rota -> abre tela de detalhe
  if (imovelId && owner) {
    return <ImovelDetailView owner={owner} imovelId={imovelId} slug={slug!} />;
  }

  const filtrados = useMemo(() => {
    const w = q.trim().toLowerCase();
    if (!w) return imoveis;
    return imoveis.filter((i) =>
      (i.end ?? "").toLowerCase().includes(w) ||
      (i.tipo ?? "").toLowerCase().includes(w) ||
      (i.situacao ?? "").toLowerCase().includes(w)
    );
  }, [imoveis, q]);

  async function excluirSelecionado() {
    if (!confirm.id) return;
    try {
      await deleteImovel(confirm.id);
      setImoveis((lst) => lst.filter((i) => i.id !== confirm.id));
    } catch (e: any) {
      alert(`Falha ao excluir imóvel.\n${e?.message ?? e}`);
    } finally {
      setConfirm({ open: false, id: undefined });
    }
  }

  const dadosHref = `/proprietarios/${slug}`;
  const imoveisHref = `/proprietarios/${slug}/imoveis`;

  return (
    <div className="page">
      <style>{css}</style>

      <div className="header">
        <div className="breadcrumb">
          <Link to="/dashboard">Dashboard</Link> /{" "}
          <Link to="/proprietarios">Proprietários</Link> /{" "}
          {owner ? (<><Link to={dadosHref}>{owner.nome}</Link> / <span className="breadcrumb-active">Imóveis</span></>) :
            (<span className="breadcrumb-active">Imóveis</span>)}
        </div>
        <div/>
      </div>

      <section className="card">
        <div className="cardhead">
          <div>
            <div className="backline">
              <button className="backbtn" onClick={() => nav(-1)} title="Voltar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Voltar
              </button>
            </div>
            <h2>{owner ? `Imóveis de ${owner.nome}` : "Imóveis"}</h2>
            <p>Gerencie os imóveis vinculados a este proprietário.</p>
          </div>

          <button className="btn-add" onClick={() => setAddOpen(true)}>Adicionar imóvel</button>
        </div>

        <div className="tabbar">
          <Link to={dadosHref} className="tab">Dados</Link>
          <span className="tab">Documentos</span>
          <Link to={imoveisHref} className="tab active">Imóveis</Link>
        </div>

        <div style={{ padding: "12px 18px" }}>
          <input className="input" placeholder="Buscar por endereço, tipo ou situação" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <div className="tablewrap">
          <table className="table">
            <thead>
              <tr>
                <th>ENDEREÇO</th>
                <th>TIPO</th>
                <th>SITUAÇÃO</th>
                <th style={{ textAlign: "center" }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: 24, textAlign: "center", color: "#64748b" }}>Carregando...</td></tr>
              ) : filtrados.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: 24, textAlign: "center", color: "#64748b" }}>Nenhum imóvel encontrado.</td></tr>
              ) : (
                filtrados.map((i) => (
                  <tr key={i.id}>
                    <td>{i.end || "-"}</td>
                    <td>{i.tipo || "-"}</td>
                    <td>{i.situacao || "-"}</td>
                    <td>
                      <div className="rowact">
                        <Link
                          className="iconbtn"
                          title="Abrir imóvel"
                          to={`${imoveisHref}/${i.id}`}
                          state={{ owner, imovel: i }}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                            <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                        <button className="iconbtn" title="Excluir" onClick={() => setConfirm({ open: true, id: i.id })}>
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

      {confirm.open && (
        <div className="backdrop" onClick={(e) => e.currentTarget === e.target && setConfirm({ open: false })}>
          <div className="small-modal" role="dialog" aria-modal="true">
            <h3 className="confirm-title">Confirmar exclusão</h3>
            <p className="confirm-text">Tem certeza que deseja excluir este imóvel? Essa ação não pode ser desfeita.</p>
            <div className="confirm-actions">
              <button className="btn micro" onClick={() => setConfirm({ open: false })}>Cancelar</button>
              <button className="btn micro primary" onClick={excluirSelecionado}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      {addOpen && owner && ownerId && (
        <AddImovelModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          ownerName={owner.nome}
          ownerId={ownerId}
          onSaved={async () => {
            const items = await listImoveisByOwner(ownerId);
            setImoveis(items);
          }}
        />
      )}
    </div>
  );
}


/* ============================================================
   Página de Detalhe do Imóvel
   ============================================================ */
export function ImovelDetalheView() {
  const { slug, imovelId } = useParams();
  const nav = useNavigate();

  const [imovel, setImovel] = useState<Imovel | null | undefined>(undefined);

  useEffect(() => {
    if (!imovelId) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/imoveis/${imovelId}`);
        if (!res.ok) throw new Error("Erro ao buscar imóvel");
        const dto = await res.json();
        setImovel({ ...dto, end: dto.endereco ?? dto.end ?? null });
      } catch (e) {
        console.error(e);
        setImovel(null);
      }
    })();
  }, [imovelId]);

  if (imovel === undefined) {
    return <div className="p-4">Carregando...</div>;
  }
  if (imovel === null) {
    return <div className="p-4">Imóvel não encontrado.</div>;
  }

  const base = `/proprietarios/${slug}/imoveis/${imovelId}`;
  const isDocs = location.pathname.endsWith("/docs");
  const isFotos = location.pathname.endsWith("/fotos");

  return (
    <div className="page">
      <style>{css}</style>

      <div className="header">
        <div className="breadcrumb">
          <Link to="/dashboard">Dashboard</Link> /{" "}
          <Link to="/proprietarios">Proprietários</Link> /{" "}
          <Link to={`/proprietarios/${slug}/imoveis`}>Imóveis</Link> /{" "}
          <span className="breadcrumb-active">Detalhe</span>
        </div>
        <div />
      </div>

      <section className="card">
        <div className="cardhead">
          <div>
            <div className="backline">
              <button className="backbtn" onClick={() => nav(-1)} title="Voltar">
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
              </button>
            </div>
            <h2>{imovel.end || "Imóvel"}</h2>
            <p style={{ color: "#64748b" }}>{imovel.tipo ?? "-"} · {imovel.situacao ?? "-"}</p>
          </div>
        </div>

        {/* Tabs iguais ao proprietário */}
        <div className="tabbar">
          <Link to={base} className={`tab ${!isDocs && !isFotos ? "active" : ""}`}>
            Informações
          </Link>
          <Link to={`${base}/docs`} className={`tab ${isDocs ? "active" : ""}`}>
            Documentos
          </Link>
          <Link to={`${base}/fotos`} className={`tab ${isFotos ? "active" : ""}`}>
            Fotos
          </Link>
        </div>

        <div className="body">
          {/* Aba Informações */}
          {!isDocs && !isFotos && (
            <div className="grid">
              <div>
                <div className="k">ENDEREÇO</div>
                <div className="v">{imovel.end || "-"}</div>
              </div>
              <div>
                <div className="k">TIPO</div>
                <div className="v">{imovel.tipo || "-"}</div>
              </div>
              <div>
                <div className="k">SITUAÇÃO</div>
                <div className="v">{imovel.situacao || "-"}</div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div className="k">OBSERVAÇÕES</div>
                <div className="v">{imovel.obs || "-"}</div>
              </div>
            </div>
          )}

          {/* Aba Documentos */}
          {isDocs && (
            <div>
              <p className="k">Upload de documentos (PDF/Imagens)</p>
              <input type="file" multiple />
            </div>
          )}

          {/* Aba Fotos */}
          {isFotos && (
            <div>
              <p className="k">Fotos do imóvel</p>
              <div className="thumbgrid">
                {/* depois você pode integrar upload */}
                <div className="k">[upload de fotos aqui]</div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
