// pages/Proprietarios/Imoveis/components/EditImovelModal.tsx
// Modal de edição do imóvel: Informações mínimas + Contratos (ADM)

import { useEffect, useMemo, useState } from "react";

/* ===================== Tipos ===================== */
export type Imovel = {
  id?: number;

  // endereço + localização
  end?: string | null;
  endereco?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  cep?: string | null;

  // meta mínimas
  tipo?: string | null;
  finalidade?: string | null;     // Aluguel | Venda | Ambos
  situacao?: string | null;       // Disponível | Locado

  // extra
  iptuInscricao?: string | null;  // Inscrição IPTU
};

type ContratoAdmState = {
  tipoAdministracao: "" | "Garantido" | "Não garantido";
  comissao: string;          // manter string para máscara
  dataInicio: string;        // yyyy-MM-dd
  prazoMeses: string;        // "30"
  dataTermino: string;       // yyyy-MM-dd
  diaRepasse: string;        // "15"
  assinadoPorAmbos: boolean;
  arquivo: File | null;
};

type Props = {
  open: boolean;
  imovel: Imovel;
  ownerId: number;
  ownerName: string;
  onClose: () => void;
  onSaved?: (i: Imovel) => void;
};

/* ===================== Config ===================== */
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

/* ===================== CSS ===================== */
const modalCss = `
.backdrop{
  position:fixed; inset:0; background:rgba(2,6,23,.45);
  display:flex; align-items:center; justify-content:center;
  padding:24px; z-index:60;
}
.modal{
  width:100%; max-width:1060px; background:#fff;
  border:1px solid rgba(2,6,23,.06); border-radius:18px;
  box-shadow:0 14px 40px rgba(2,6,23,.12); padding:0; box-sizing:border-box;
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

.tabbar{ display:flex; gap:8px; padding:0 20px 14px 20px; border-bottom:1px solid #e5e7eb }
.tab{
  border:1px solid #e5e7eb; background:#fff; border-radius:999px;
  padding:8px 14px; font-weight:600; font-size:14px; color:#475569; cursor:pointer;
}
.tab:hover{ background:#f1f5f9 }
.tab.active{ background:#0B1321; border-color:#0B1321; color:#fff }

.modalbody{ padding:18px 20px }
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

/* Cards / upload (mesmo padrão dos docs do proprietário) */
.card{ background:#fff; border:1px solid rgba(2,6,23,.06); border-radius:18px; box-shadow:0 10px 30px rgba(2,6,23,.08) }
.card-h{ display:flex; align-items:center; justify-content:space-between; gap:10px; padding:14px 16px; border-bottom:1px solid #e5e7eb }
.card-h-left{ display:flex; align-items:center; gap:10px }
.badge-req{ background:#fee2e2; color:#b91c1c; font-weight:700; border-radius:999px; font-size:11px; padding:4px 8px }
.card-b{ padding:16px }
.drop{ border:2px dashed #cbd5e1; border-radius:14px; padding:26px; text-align:center; cursor:pointer; background:#f8fafc }
.fileline{ display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 12px; border:1px solid #e2e8f0; border-radius:12px; margin-top:10px; }
.filemeta{ font-size:12px; color:#64748b }
.actions{ display:flex; gap:8px }
.btn.micro{ padding:6px 10px; font-size:12px }
.checkrow{ display:flex; align-items:center; gap:10px; margin-top:12px }
.two-col{ display:grid; grid-template-columns: 1.1fr 1fr; gap:16px }
`;

/* ===================== Utils ===================== */
function addMonths(iso: string, months: number): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  d.setMonth(d.getMonth() + months);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function humanKB(size: number) {
  return `${Math.round(size / 1024)} KB`;
}
function humanDateNow() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy}, ${hh}:${min}`;
}

/* ===================== Componente ===================== */
export default function EditImovelModal({ open, imovel, onClose, onSaved }: Props) {
  const [tab, setTab] = useState<"info" | "contratos">("info");

  // ===== estado: informações mínimas =====
  const [endereco, setEndereco] = useState(imovel.end ?? imovel.endereco ?? "");
  const [numero, setNumero] = useState(imovel.numero ?? "");
  const [complemento, setComplemento] = useState(imovel.complemento ?? "");
  const [bairro, setBairro] = useState(imovel.bairro ?? "");
  const [cep, setCep] = useState(imovel.cep ?? "");
  const [cidade, setCidade] = useState(imovel.cidade ?? "");
  const [uf, setUf] = useState(imovel.uf ?? "SP");
  const [tipo, setTipo] = useState(imovel.tipo ?? "Casa");
  const [finalidade, setFinalidade] = useState(imovel.finalidade ?? "Aluguel");
  const [situacao, setSituacao] = useState(imovel.situacao ?? "Disponível");
  const [iptuInscricao, setIptuInscricao] = useState(imovel.iptuInscricao ?? "");

  // ===== estado: contrato ADM (local/visual) =====
  const [contrato, setContrato] = useState<ContratoAdmState>({
    tipoAdministracao: "",
    comissao: "",
    dataInicio: "",
    prazoMeses: "30",
    dataTermino: "",
    diaRepasse: "15",
    assinadoPorAmbos: false,
    arquivo: null,
  });

  const [saving, setSaving] = useState(false);

  // Recarrega quando abre
  useEffect(() => {
    if (!open) return;
    setTab("info");
    setEndereco(imovel.end ?? imovel.endereco ?? "");
    setNumero(imovel.numero ?? "");
    setComplemento(imovel.complemento ?? "");
    setBairro(imovel.bairro ?? "");
    setCep(imovel.cep ?? "");
    setCidade(imovel.cidade ?? "");
    setUf(imovel.uf ?? "SP");
    setTipo(imovel.tipo ?? "Casa");
    setFinalidade(imovel.finalidade ?? "Aluguel");
    setSituacao(imovel.situacao ?? "Disponível");
    setIptuInscricao(imovel.iptuInscricao ?? "");
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
    setSaving(false);
  }, [open, imovel]);

  // calcula término quando muda início/prazo
  useEffect(() => {
    if (contrato.dataInicio && contrato.prazoMeses) {
      const fim = addMonths(contrato.dataInicio, Number(contrato.prazoMeses) || 0);
      setContrato((p) => ({ ...p, dataTermimo: p.dataTermino, dataTermino: fim }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contrato.dataInicio, contrato.prazoMeses]);

  const canSave = useMemo(
    () => (endereco ?? "").trim().length > 0 && !!imovel.id,
    [endereco, imovel.id]
  );

  // ===== upload handlers =====
  function onContratoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setContrato((p) => ({ ...p, arquivo: f }));
  }
  function removerContratoArquivo() {
    setContrato((p) => ({ ...p, arquivo: null }));
  }

  // ===== salvar =====
  async function handleSave() {
    if (!canSave || !imovel.id) return;

    // regra: se houver arquivo/infos de contrato, precisa estar assinado
    const temContrato =
      contrato.arquivo ||
      contrato.tipoAdministracao ||
      contrato.comissao ||
      contrato.dataInicio ||
      contrato.dataTermino;
    if (temContrato && !contrato.assinadoPorAmbos) {
      alert("Marque 'Assinado por ambos' para concluir.");
      return;
    }

    setSaving(true);
    try {
      const payload: Imovel = {
        id: imovel.id,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        uf,
        cep,
        tipo,
        finalidade,
        situacao,
        iptuInscricao,
      };

      const r = await fetch(`${API_BASE}/api/v1/imoveis/${imovel.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);

      // (seu backend de upload do contrato pode ser chamado aqui com FormData)
      // if (contrato.arquivo) { ... }

      const updated: Imovel = await r.json().catch(() => payload);
      onSaved?.({ ...updated, end: updated.endereco ?? updated.end ?? endereco });
      onClose();
    } catch (e) {
      console.error(e);
      alert("Falha ao salvar imóvel.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <style>{modalCss}</style>

      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="edit-imovel-title">
        <div className="modalhead">
          <h3 id="edit-imovel-title" className="title">Editar imóvel</h3>
          <button className="btn" onClick={onClose}>Fechar</button>
        </div>

        <div className="tabbar">
          <button className={`tab ${tab === "info" ? "active" : ""}`} onClick={() => setTab("info")}>Informações</button>
          <button className={`tab ${tab === "contratos" ? "active" : ""}`} onClick={() => setTab("contratos")}>Contratos</button>
        </div>

        <div className="modalbody">
          {/* ===================== Aba: Informações ===================== */}
          {tab === "info" && (
            <div className="grid">
              <div className="full">
                <div className="label">ENDEREÇO</div>
                <input className="input" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
              </div>

              <div>
                <div className="label">NÚMERO</div>
                <input className="input" value={numero ?? ""} onChange={(e) => setNumero(e.target.value)} />
              </div>
              <div>
                <div className="label">COMPLEMENTO</div>
                <input className="input" value={complemento ?? ""} onChange={(e) => setComplemento(e.target.value)} />
              </div>

              <div>
                <div className="label">BAIRRO</div>
                <input className="input" value={bairro ?? ""} onChange={(e) => setBairro(e.target.value)} />
              </div>
              <div>
                <div className="label">CEP</div>
                <input className="input" value={cep ?? ""} onChange={(e) => setCep(e.target.value)} />
              </div>

              <div>
                <div className="label">CIDADE</div>
                <input className="input" value={cidade ?? ""} onChange={(e) => setCidade(e.target.value)} />
              </div>
              <div>
                <div className="label">UF</div>
                <select className="input" value={uf ?? "SP"} onChange={(e) => setUf(e.target.value)}>
                  {["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"].map(uf => <option key={uf}>{uf}</option>)}
                </select>
              </div>

              <div>
                <div className="label">TIPO</div>
                <select className="input" value={tipo ?? ""} onChange={(e) => setTipo(e.target.value)}>
                  {["Casa","Apartamento","Kitnet","Sala Comercial","Terreno","Galpão"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <div className="label">FINALIDADE</div>
                <select className="input" value={finalidade ?? "Aluguel"} onChange={(e) => setFinalidade(e.target.value)}>
                  <option>Aluguel</option><option>Venda</option><option>Ambos</option>
                </select>
              </div>

              <div>
                <div className="label">SITUAÇÃO</div>
                <select className="input" value={situacao ?? "Disponível"} onChange={(e) => setSituacao(e.target.value)}>
                  <option>Disponível</option>
                  <option>Locado</option>
                </select>
              </div>
              <div>
                <div className="label">INSCRIÇÃO IPTU</div>
                <input className="input" value={iptuInscricao ?? ""} onChange={(e) => setIptuInscricao(e.target.value)} />
              </div>
            </div>
          )}

          {/* ===================== Aba: Contratos (ADM) ===================== */}
          {tab === "contratos" && (
            <div className="two-col">
              {/* Card de upload à esquerda */}
              <div className="card">
                <div className="card-h">
                  <div className="card-h-left">
                    <div style={{ fontWeight: 800 }}>Contrato de Administração (ADM)</div>
                    <span className="badge-req">Obrigatório</span>
                  </div>
                </div>
                <div className="card-b">
                  <label className="drop">
                    <input type="file" accept=".pdf,image/*" hidden onChange={onContratoFileChange} />
                    {!contrato.arquivo ? (
                      <div>
                        <div style={{ fontWeight: 700, marginBottom: 6 }}>Clique para selecionar arquivos</div>
                        <div className="k">Tipos: PDF, PNG, JPG · Máx: 15 MB</div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight: 700, marginBottom: 6 }}>Clique para substituir</div>
                        <div className="k">Um arquivo selecionado</div>
                      </div>
                    )}
                  </label>

                  {contrato.arquivo && (
                    <div className="fileline">
                      <div>
                        <div style={{ fontWeight: 700 }}>{contrato.arquivo.name}</div>
                        <div className="filemeta">
                          Enviado em {humanDateNow()} · {humanKB(contrato.arquivo.size)}
                        </div>
                      </div>
                      <div className="actions">
                        <button type="button" className="btn micro" onClick={removerContratoArquivo}>Excluir</button>
                      </div>
                    </div>
                  )}

                  <label className="checkrow">
                    <input
                      type="checkbox"
                      checked={contrato.assinadoPorAmbos}
                      onChange={(e) => setContrato((p) => ({ ...p, assinadoPorAmbos: e.target.checked }))}
                    />
                    <span className="k" style={{ fontSize: 14, color: "#0f172a" }}>Assinado por ambos</span>
                  </label>
                </div>
              </div>

              {/* Quadro-resumo à direita */}
              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div className="label">TIPO DA ADMINISTRAÇÃO</div>
                  <select
                    className="input"
                    value={contrato.tipoAdministracao}
                    onChange={(e) =>
                      setContrato((p) => ({ ...p, tipoAdministracao: e.target.value as ContratoAdmState["tipoAdministracao"] }))
                    }
                  >
                    <option value="">Selecione…</option>
                    <option value="Garantido">Garantido</option>
                    <option value="Não garantido">Não garantido</option>
                  </select>
                </div>
                <div>
                  <div className="label">COMISSÃO (%)</div>
                  <input
                    className="input"
                    placeholder="Ex.: 12"
                    value={contrato.comissao}
                    onChange={(e) => setContrato((p) => ({ ...p, comissao: e.target.value }))}
                  />
                </div>

                <div>
                  <div className="label">DATA DE INÍCIO</div>
                  <input
                    type="date"
                    className="input"
                    value={contrato.dataInicio}
                    onChange={(e) => setContrato((p) => ({ ...p, dataInicio: e.target.value }))}
                  />
                </div>
                <div>
                  <div className="label">PRAZO (MESES)</div>
                  <input
                    className="input"
                    placeholder="Ex.: 30"
                    value={contrato.prazoMeses}
                    onChange={(e) => setContrato((p) => ({ ...p, prazoMeses: e.target.value }))}
                  />
                </div>

                <div>
                  <div className="label">DATA DE TÉRMINO</div>
                  <input
                    type="date"
                    className="input"
                    value={contrato.dataTermino}
                    onChange={(e) => setContrato((p) => ({ ...p, dataTermino: e.target.value }))}
                  />
                </div>
                <div>
                  <div className="label">DIA DO REPASSE AO PROPRIETÁRIO</div>
                  <input
                    className="input"
                    placeholder="Ex.: 15"
                    value={contrato.diaRepasse}
                    onChange={(e) => setContrato((p) => ({ ...p, diaRepasse: e.target.value }))}
                  />
                </div>

                <div className="full k">
                  Obs.: o checkbox “Assinado por ambos” é obrigatório para concluir o upload.
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="foot">
          <button className="btn" onClick={onClose} disabled={saving}>Cancelar</button>
          <button className="btn primary" onClick={handleSave} disabled={!canSave || saving}>
            {saving ? "Salvando..." : "Concluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
