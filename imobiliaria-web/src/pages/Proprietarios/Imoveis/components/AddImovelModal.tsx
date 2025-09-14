// pages/Proprietarios/Imoveis/components/AddImovelModal.tsx
// Modal de CRIAÇÃO — fonte da verdade (o Edit abre este mesmo layout em modo edição)

import { useEffect, useMemo, useRef, useState } from "react";

/* ===================== Tipos ===================== */
export type Imovel = {
  id?: number;

  // Informações mínimas (o que o cliente pediu)
  end?: string | null;          // alias interno
  endereco?: string | null;     // se preferir, o backend pode usar "endereco"
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  cep?: string | null;

  tipo?: string | null;         // Casa/Apto/etc
  finalidade?: string | null;   // Aluguel | Venda | Ambos
  situacao?: string | null;     // Disponível | Locado

  iptuInscricao?: string | null;

  // Resumo do Contrato ADM (metadados)
  contratoAdm?: {
    tipoAdministracao?: "Garantido" | "Não garantido" | null;
    comissao?: number | null;          // %
    dataInicio?: string | null;        // yyyy-MM-dd
    prazoMeses?: number | null;        // ex.: 30
    dataTermino?: string | null;       // yyyy-MM-dd
    diaRepasse?: number | null;        // ex.: 15
    assinadoPorAmbos?: boolean | null;

    arquivoNome?: string | null;
    arquivoTamanho?: number | null;
    arquivoMime?: string | null;
  } | null;
};

/* ===================== Helpers ===================== */
const toNull = (s?: string | null) => {
  const t = (s ?? "").trim();
  return t ? t : null;
};
const toNum = (s?: string | null | number) => {
  if (typeof s === "number") return Number.isFinite(s) ? s : null;
  const t = (s ?? "").trim();
  return t ? Number(t) : null;
};
function addMonths(iso: string, months: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setMonth(d.getMonth() + months);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* ===================== API ===================== */
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function createImovel(ownerId: number, body: any): Promise<Imovel> {
  const res = await fetch(`${API_BASE}/api/v1/proprietarios/${ownerId}/imoveis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  const dto = await res.json();
  return { ...dto, end: dto.endereco ?? dto.end ?? null };
}

/* ===================== CSS (harmonizado com EditImovelModal) ===================== */
const css = `
.backdrop{
  position:fixed; inset:0; background:rgba(2,6,23,.45);
  display:flex; align-items:center; justify-content:center;
  padding:24px; z-index:60;
}
.modal{
  width:100%; max-width:980px; background:#fff;
  border:1px solid rgba(2,6,23,.06); border-radius:18px;
  box-shadow:0 14px 40px rgba(2,6,23,.12);
  box-sizing:border-box;
}
.modalhead{ display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid #e5e7eb }
.title{ font-size:18px; font-weight:800; margin:0 }
.btn{
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  border-radius:12px; border:1px solid #e2e8f0;
  padding:10px 16px; background:#f8fafc; color:#0f172a; font-weight:700; cursor:pointer; font-size:14px;
}
.btn:hover{ filter:brightness(.98) }
.btn.primary{ background:#0B1321; color:#fff; border-color:transparent }
.btn.micro{ padding:8px 12px; font-size:13px }

.tabbar{ display:flex; gap:8px; padding:0 20px 14px 20px; border-bottom:1px solid #e5e7eb }
.tab{
  border:1px solid #e5e7eb; background:#fff; border-radius:999px;
  padding:8px 14px; font-weight:600; font-size:14px; color:#475569; cursor:pointer;
}
.tab:hover{ background:#f1f5f9 }
.tab.active{ background:#0B1321; border-color:#0B1321; color:#fff }

.modalbody{ padding:18px 20px; max-height:62vh; overflow:auto }
.grid{ display:grid; grid-template-columns:1fr 1fr; gap:12px }
.full{ grid-column:1 / -1 }
.label{ font-size:12px; color:#64748b; margin:8px 0 6px }
.input{
  width:100%; background:#fff; border:1px solid #e2e8f0; border-radius:14px;
  padding:10px 12px; font-size:15px; outline:none;
}
.input:focus{ box-shadow:0 0 0 3px rgba(11,19,33,.22); border-color:#94a3b8 }
.foot{ padding:14px 20px; border-top:1px solid #e5e7eb; display:flex; gap:10px; justify-content:flex-end }
.k{ font-size:12px; color:#64748b; margin:8px 0 6px }

/* Cards de upload (mesmo padrão dos docs do proprietário) */
.card{
  background:#fff; border:1px solid rgba(2,6,23,.06); border-radius:18px;
  box-shadow:0 10px 30px rgba(2,6,23,.08);
}
.card-h{ display:flex; align-items:center; gap:10px; padding:14px 16px; border-bottom:1px solid #e5e7eb }
.badge-req{ background:#fee2e2; color:#b91c1c; font-weight:700; border-radius:999px; font-size:11px; padding:4px 8px }
.card-b{ padding:16px }
.drop{
  border:2px dashed #cbd5e1; border-radius:14px; padding:26px; text-align:center; cursor:pointer; background:#f8fafc;
}
.checkrow{ display:flex; align-items:center; gap:10px; margin-top:12px }
`;

/* ===================== Componente ===================== */
export default function AddImovelModal({
  open, onClose, ownerName, ownerId, onSaved,
}: {
  open: boolean;
  onClose: () => void;
  ownerName: string;
  ownerId: number;
  onSaved?: (i: Imovel) => void | Promise<void>;
}) {
  const [tab, setTab] = useState<"info" | "contratos" | "fotos">("info");

  // Info
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("SP");
  const [tipo, setTipo] = useState("Casa");
  const [finalidade, setFinalidade] = useState<"Aluguel" | "Venda" | "Ambos">("Aluguel");
  const [situacao, setSituacao] = useState<"Disponível" | "Locado">("Disponível");
  const [iptuInscricao, setIptuInscricao] = useState("");

  // Contrato ADM
  const [contrato, setContrato] = useState({
    tipoAdministracao: "" as "" | "Garantido" | "Não garantido",
    comissao: "",
    dataInicio: "",
    prazoMeses: "30",
    dataTermino: "",
    diaRepasse: "15",
    assinadoPorAmbos: false,
    arquivo: null as File | null,
  });

  // Fotos (pré-visualização)
  const MAX_SLOTS = 5;
  const [fotos, setFotos] = useState<(File | null)[]>(Array(MAX_SLOTS).fill(null));
  const fotoRefs = useRef<Array<HTMLInputElement | null>>([]);

  // abre/limpa
  useEffect(() => {
    if (!open) return;
    setTab("info");
    setEndereco("");
    setNumero("");
    setComplemento("");
    setBairro("");
    setCep("");
    setCidade("");
    setUf("SP");
    setTipo("Casa");
    setFinalidade("Aluguel");
    setSituacao("Disponível");
    setIptuInscricao("");
    setContrato({
      tipoAdministracao: "",
      comissao: "",
      dataInicio: "",
      prazoMeses: "30",
      dataTermino: "",
      diaRepasse: "15",
      assinadoPorAmbos: false,
      arquivo: null,
    });
    setFotos(Array(MAX_SLOTS).fill(null));
  }, [open]);

  // calcula término
  useEffect(() => {
    if (contrato.dataInicio && contrato.prazoMeses) {
      setContrato((p) => ({ ...p, dataTermimo: undefined } as any));
      const fim = addMonths(contrato.dataInicio, Number(contrato.prazoMeses) || 0);
      setContrato((p) => ({ ...p, dataTermino: fim }));
    }
  }, [contrato.dataInicio, contrato.prazoMeses]);

  const ownerBadge = useMemo(() => (ownerName || "Proprietário").trim() || "Proprietário", [ownerName]);

  // salvar
  async function salvar() {
    if (!endereco.trim()) { alert("Informe o endereço."); setTab("info"); return; }
    if (!contrato.assinadoPorAmbos) { alert("Marque “Assinado por ambos” no contrato ADM."); setTab("contratos"); return; }

    const payload: Imovel = {
      end: toNull(endereco),
      numero: toNull(numero),
      complemento: toNull(complemento),
      bairro: toNull(bairro),
      cidade: toNull(cidade),
      uf: toNull(uf),
      cep: toNull(cep),
      tipo: toNull(tipo),
      finalidade: toNull(finalidade),
      situacao: toNull(situacao),
      iptuInscricao: toNull(iptuInscricao),
      contratoAdm: {
        tipoAdministracao: (contrato.tipoAdministracao || null) as any,
        comissao: toNum(contrato.comissao),
        dataInicio: toNull(contrato.dataInicio),
        prazoMeses: toNum(contrato.prazoMeses),
        dataTermino: toNull(contrato.dataTermino),
        diaRepasse: toNum(contrato.diaRepasse),
        assinadoPorAmbos: contrato.assinadoPorAmbos,
        arquivoNome: contrato.arquivo?.name ?? null,
        arquivoTamanho: contrato.arquivo?.size ?? null,
        arquivoMime: contrato.arquivo?.type ?? null,
      },
    };

    try {
      const created = await createImovel(ownerId, payload);
      await onSaved?.(created);
      onClose();
    } catch (e: any) {
      alert(`Falha ao salvar imóvel.\n${e?.message ?? e}`);
    }
  }

  function setFoto(i: number, f: File | null) {
    setFotos((arr) => { const cp = arr.slice(); cp[i] = f; return cp; });
  }

  if (!open) return null;

  return (
    <div className="backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <style>{css}</style>

      <div className="modal" role="dialog" aria-modal="true">
        <div className="modalhead">
          <h3 className="title">Adicionar imóvel • <span style={{ color:"#64748b", fontWeight:700 }}>{ownerBadge}</span></h3>
          <div style={{ display:"flex", gap:8 }}>
            <button className="btn" onClick={onClose}>Fechar</button>
          </div>
        </div>

        <div className="tabbar">
          <button className={`tab ${tab==="info"?"active":""}`} onClick={()=>setTab("info")}>Informações</button>
          <button className={`tab ${tab==="contratos"?"active":""}`} onClick={()=>setTab("contratos")}>Contratos</button>
          <button className={`tab ${tab==="fotos"?"active":""}`} onClick={()=>setTab("fotos")}>Fotos</button>
        </div>

        <div className="modalbody">
          {/* ====== INFO ====== */}
          {tab === "info" && (
            <div className="grid">
              <div className="full">
                <div className="label">ENDEREÇO</div>
                <input className="input" placeholder="Ex.: Rua ABC, 123 - Centro" value={endereco} onChange={(e)=>setEndereco(e.target.value)} />
              </div>

              <div>
                <div className="label">NÚMERO</div>
                <input className="input" placeholder="Ex.: 123" value={numero} onChange={(e)=>setNumero(e.target.value)} />
              </div>
              <div>
                <div className="label">COMPLEMENTO</div>
                <input className="input" placeholder="Apto / Bloco / Casa" value={complemento} onChange={(e)=>setComplemento(e.target.value)} />
              </div>

              <div>
                <div className="label">BAIRRO</div>
                <input className="input" placeholder="Ex.: Centro" value={bairro} onChange={(e)=>setBairro(e.target.value)} />
              </div>
              <div>
                <div className="label">CEP</div>
                <input className="input" placeholder="00000-000" value={cep} onChange={(e)=>setCep(e.target.value)} />
              </div>

              <div>
                <div className="label">CIDADE</div>
                <input className="input" placeholder="Ex.: São Paulo" value={cidade} onChange={(e)=>setCidade(e.target.value)} />
              </div>
              <div>
                <div className="label">UF</div>
                <select className="input" value={uf} onChange={(e)=>setUf(e.target.value)}>
                  {["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"].map(u=> <option key={u}>{u}</option>)}
                </select>
              </div>

              <div>
                <div className="label">TIPO</div>
                <select className="input" value={tipo} onChange={(e)=>setTipo(e.target.value)}>
                  {["Casa","Apartamento","Kitnet","Sala Comercial","Terreno","Galpão"].map(t=> <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <div className="label">FINALIDADE</div>
                <select className="input" value={finalidade} onChange={(e)=>setFinalidade(e.target.value as any)}>
                  <option>Aluguel</option><option>Venda</option><option>Ambos</option>
                </select>
              </div>

              <div>
                <div className="label">SITUAÇÃO</div>
                <select className="input" value={situacao} onChange={(e)=>setSituacao(e.target.value as any)}>
                  <option>Disponível</option><option>Locado</option>
                </select>
              </div>
              <div>
                <div className="label">INSCRIÇÃO IPTU (opcional)</div>
                <input className="input" placeholder="Ex.: 123.456.789-0" value={iptuInscricao} onChange={(e)=>setIptuInscricao(e.target.value)} />
              </div>

              <div className="full">
                <div className="label">OBSERVAÇÕES</div>
                <textarea className="input" rows={4} placeholder="Notas internas…" />
              </div>
            </div>
          )}

          {/* ====== CONTRATOS (ADM) ====== */}
          {tab === "contratos" && (
            <div className="grid">
              {/* Upload */}
              <div className="card full">
                <div className="card-h">
                  <div style={{ fontWeight: 800 }}>Contrato de Administração (ADM)</div>
                  <span className="badge-req">Obrigatório</span>
                </div>
                <div className="card-b">
                  <label className="drop">
                    <input type="file" accept=".pdf,image/*" hidden
                           onChange={(e)=>setContrato(p=>({ ...p, arquivo: e.target.files?.[0] ?? null }))} />
                    {contrato.arquivo ? (
                      <div>
                        <div style={{ fontWeight:700, marginBottom:6 }}>{contrato.arquivo.name}</div>
                        <div className="k">{(contrato.arquivo.size/1024).toFixed(0)} KB</div>
                        <div className="k" style={{ marginTop:8 }}>Clique para substituir</div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight:700, marginBottom:6 }}>Clique para selecionar arquivos</div>
                        <div className="k">Tipos: PDF, PNG, JPG · Máx: 15 MB</div>
                      </div>
                    )}
                  </label>

                  <label className="checkrow">
                    <input type="checkbox"
                           checked={contrato.assinadoPorAmbos}
                           onChange={(e)=>setContrato(p=>({ ...p, assinadoPorAmbos: e.target.checked }))} />
                    <span className="k" style={{ fontSize:14, color:"#0f172a" }}>Assinado por ambos</span>
                  </label>
                </div>
              </div>

              {/* Quadro resumo */}
              <div className="grid full" style={{ gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <div className="label">TIPO DA ADMINISTRAÇÃO</div>
                  <select className="input" value={contrato.tipoAdministracao} onChange={(e)=>setContrato(p=>({ ...p, tipoAdministracao: e.target.value as any }))}>
                    <option value="">Selecione…</option>
                    <option value="Garantido">Garantido</option>
                    <option value="Não garantido">Não garantido</option>
                  </select>
                </div>
                <div>
                  <div className="label">COMISSÃO (%)</div>
                  <input className="input" placeholder="Ex.: 12" value={contrato.comissao} onChange={(e)=>setContrato(p=>({ ...p, comissao: e.target.value }))} />
                </div>

                <div>
                  <div className="label">DATA DE INÍCIO</div>
                  <input type="date" className="input" value={contrato.dataInicio} onChange={(e)=>setContrato(p=>({ ...p, dataInicio: e.target.value }))} />
                </div>
                <div>
                  <div className="label">PRAZO (MESES)</div>
                  <input className="input" placeholder="Ex.: 30" value={contrato.prazoMeses} onChange={(e)=>setContrato(p=>({ ...p, prazoMeses: e.target.value }))} />
                </div>

                <div>
                  <div className="label">DATA DE TÉRMINO</div>
                  <input type="date" className="input" value={contrato.dataTermino} onChange={(e)=>setContrato(p=>({ ...p, dataTermino: e.target.value }))} />
                </div>
                <div>
                  <div className="label">DIA DO REPASSE AO PROPRIETÁRIO</div>
                  <input className="input" placeholder="Ex.: 15" value={contrato.diaRepasse} onChange={(e)=>setContrato(p=>({ ...p, diaRepasse: e.target.value }))} />
                </div>

                <div className="full k">Obs.: o checkbox “Assinado por ambos” é obrigatório para concluir o upload.</div>
              </div>
            </div>
          )}

          {/* ====== FOTOS ====== */}
          {tab === "fotos" && (
            <div>
              <div className="k" style={{ marginBottom:10 }}>Adicione até 5 fotos (pré-visualização).</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10 }}>
                {Array.from({ length: MAX_SLOTS }).map((_, i) => {
                  const file = fotos[i];
                  const preview = file ? URL.createObjectURL(file) : null;
                  return (
                    <div key={i}
                         style={{ position:"relative", width:"100%", aspectRatio:"1/1", border:"1px dashed #cbd5e1",
                                  borderRadius:12, background:"#f8fafc", display:"flex", alignItems:"center",
                                  justifyContent:"center", overflow:"hidden", cursor:"pointer" }}
                         onClick={()=>fotoRefs.current[i]?.click()}>
                      {preview ? (
                        <img src={preview} style={{ width:"100%", height:"100%", objectFit:"cover" }}
                             onLoad={()=>preview && URL.revokeObjectURL(preview)} />
                      ) : (
                        <div className="k">+ Foto {i+1}</div>
                      )}
                      {file && (
                        <button className="btn micro" style={{ position:"absolute", top:8, right:8 }}
                                onClick={(e)=>{ e.stopPropagation(); setFoto(i,null); }}>
                          Remover
                        </button>
                      )}
                      <input ref={(el)=>{ if (el) (fotoRefs.current[i]=el); }} type="file" accept="image/*" hidden
                             onChange={(e)=>setFoto(i, e.target.files?.[0] ?? null)} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="foot">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn primary" onClick={salvar}>Concluir</button>
        </div>
      </div>
    </div>
  );
}
