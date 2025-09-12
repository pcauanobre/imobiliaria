// pages/Proprietarios/Imoveis/components/AddImovelModal.tsx
// Modal de CRIAÇÃO/EDIÇÃO DE IMÓVEL com overlay e ABAS.

import { useEffect, useRef, useState } from "react";

/* ============================================================
   Tipos
   ============================================================ */
export type Imovel = {
  id?: number;
  end?: string | null;
  tipo?: string | null;
  situacao?: string | null;
  obs?: string | null;

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
const toNum  = (s?: string | null) => { const t = (s ?? "").trim(); return t ? Number(t) : null; };

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

/* ============================================================
   CSS embutido (igual aos outros modais)
   ============================================================ */
const modalCss = `
.backdrop{
  position:fixed; inset:0; background:rgba(2,6,23,.45);
  display:flex; align-items:center; justify-content:center;
  padding:24px; z-index:70;
}
.small-modal{
  width:100%; max-width:980px; background:#fff;
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
  display:flex; justify-content:flex-end; gap:10px; margin-top:18px;
}
.confirm-actions .btn{ flex:0 0 auto; min-width:140px; width:auto !important; }
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

/* Tabs */
.modal-tabs{ display:flex; gap:8px; margin:6px 0 12px }
.modal-tab{
  border:1px solid #e2e8f0; background:#fff; color:#475569;
  border-radius:999px; padding:8px 14px; font-size:14px; font-weight:600; cursor:pointer;
}
.modal-tab:hover{ background:#f1f5f9 }
.modal-tab.active{ background:#0B1321; color:#fff; border-color:#0B1321 }

.modal-content{ max-height:62vh; overflow:auto; padding-right:2px }
`;

/* ============================================================
   Componente
   ============================================================ */
export default function AddImovelModal({
  open, onClose, ownerName, onSaved, ownerId, imovel,
}: {
  open: boolean;
  onClose: () => void;
  ownerName: string;
  ownerId: number;
  onSaved: () => Promise<void> | void;
  imovel?: Imovel; // edição se vier
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

      // (Opcional) uploads de docs/fotos aqui, se o backend tiver endpoints.
      await onSaved();
      onClose();
    } catch (e: any) {
      alert(`Falha ao salvar imóvel.\n${e?.message ?? e}`);
    }
  }

  return (
    <div className="backdrop" onClick={(e) => e.currentTarget === e.target && onClose()}>
      <style>{modalCss}</style>
      <div className="small-modal" role="dialog" aria-modal="true">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <h3 className="confirm-title" style={{ margin: 0 }}>
            {imovel ? "Editar imóvel" : "Adicionar imóvel"} •
          </h3>
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
                (Opcional) Integração de contratos pode ser ligada depois. Campos apenas ilustrativos.
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
                        <img src={preview} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                             onLoad={() => URL.revokeObjectURL(preview)} />
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
