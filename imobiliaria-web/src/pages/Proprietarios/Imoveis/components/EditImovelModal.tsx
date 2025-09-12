// src/pages/Proprietarios/Imoveis/components/EditImovelModal.tsx
// Modal de edição do imóvel com ABAS internas.
// - Abas: Informações, Endereço, Métricas
// - Botão "Concluir" no topo (direita) e "Cancelar" no rodapé
// - Mesmo look&feel do restante do projeto

import { useEffect, useMemo, useState } from "react";

export type Imovel = {
  id?: number;

  // endereço + localização
  end?: string | null;          // alias interno (endereco/end)
  endereco?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  cep?: string | null;

  // meta
  tipo?: string | null;
  finalidade?: string | null;
  situacao?: string | null;
  obs?: string | null;

  // métricas
  area?: number | null;
  quartos?: number | null;
  banheiros?: number | null;
  vagas?: number | null;
  iptu?: number | null;
  condominio?: number | null;
  anoConstrucao?: number | null;
  disponivelEm?: string | null; // yyyy-MM-dd
};

type Props = {
  open: boolean;
  imovel: Imovel;
  ownerId: number;
  ownerName: string;
  onClose: () => void;
  onSaved?: (i: Imovel) => void;
};

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const modalCss = `
.backdrop{
  position:fixed; inset:0; background:rgba(2,6,23,.45);
  display:flex; align-items:center; justify-content:center;
  padding:24px; z-index:60;
}
.modal{
  width:100%; max-width:980px; background:#fff;
  border:1px solid rgba(2,6,23,.06); border-radius:18px;
  box-shadow:0 14px 40px rgba(2,6,23,.12); padding:0; box-sizing:border-box;
}

/* Cabeçalho do modal */
.modalhead{
  display:flex; align-items:center; justify-content:space-between;
  padding:16px 20px; border-bottom:1px solid #e5e7eb;
}
.title{ font-size:18px; font-weight:800; margin:0 }

/* Ações do topo (Concluir) */
.head-actions{ display:flex; gap:10px; align-items:center }
.btn{
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  border-radius:12px; border:1px solid #e2e8f0;
  padding:10px 16px; background:#f8fafc; color:#0f172a;
  font-weight:700; cursor:pointer; font-size:14px; flex:0 0 auto;
  min-width:120px;
}
.btn:hover{ filter:brightness(.98) }
.btn.primary{ background:#0B1321; color:#fff; border-color:transparent }

/* Conteúdo do modal */
.modalbody{ padding:18px 20px }

/* Abas internas */
.tabbar{
  display:flex; gap:8px; padding:0 20px 14px 20px; border-bottom:1px solid #e5e7eb;
}
.tab{
  border:1px solid #e5e7eb; background:#fff; border-radius:999px;
  padding:8px 14px; font-weight:600; font-size:14px; color:#475569;
  cursor:pointer; text-decoration:none; display:inline-flex; align-items:center;
}
.tab:hover{ background:#f1f5f9 }
.tab.active{ background:#0B1321; border-color:#0B1321; color:#fff }

.grid{ display:grid; grid-template-columns:1fr 1fr; gap:12px }
.full{ grid-column:1 / -1 }

.label{ font-size:12px; color:#64748b; margin:8px 0 6px }
.input{
  width:100%; background:#fff; border:1px solid #e2e8f0; border-radius:14px;
  padding:10px 12px; font-size:15px; outline:none;
}
.input:focus{ box-shadow:0 0 0 3px rgba(11,19,33,.22); border-color:#94a3b8 }
textarea.input{ resize:vertical }

/* Rodapé (Cancelar) */
.foot{
  padding:14px 20px;
  border-top:1px solid #e5e7eb;
  display:flex;
  flex-direction:column; /* empilha */
  gap:10px;
}
`;

/* Helpers */
function toNum(v: any): number | null {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function val(v: any) {
  return v === null || v === undefined ? "" : String(v);
}

export default function EditImovelModal({ open, imovel, onClose, onSaved }: Props) {
  // estado controlado
  const [endereco, setEndereco] = useState(imovel.end ?? imovel.endereco ?? "");
  const [numero, setNumero] = useState(imovel.numero ?? "");
  const [complemento, setComplemento] = useState(imovel.complemento ?? "");
  const [bairro, setBairro] = useState(imovel.bairro ?? "");
  const [cidade, setCidade] = useState(imovel.cidade ?? "");
  const [uf, setUf] = useState(imovel.uf ?? "");
  const [cep, setCep] = useState(imovel.cep ?? "");

  const [tipo, setTipo] = useState(imovel.tipo ?? "");
  const [finalidade, setFinalidade] = useState(imovel.finalidade ?? "");
  const [situacao, setSituacao] = useState(imovel.situacao ?? "");
  const [obs, setObs] = useState(imovel.obs ?? "");

  const [area, setArea] = useState(imovel.area ?? ("" as unknown as number));
  const [quartos, setQuartos] = useState(imovel.quartos ?? ("" as unknown as number));
  const [banheiros, setBanheiros] = useState(imovel.banheiros ?? ("" as unknown as number));
  const [vagas, setVagas] = useState(imovel.vagas ?? ("" as unknown as number));
  const [iptu, setIptu] = useState(imovel.iptu ?? ("" as unknown as number));
  const [condominio, setCondominio] = useState(imovel.condominio ?? ("" as unknown as number));
  const [anoConstrucao, setAnoConstrucao] = useState(imovel.anoConstrucao ?? ("" as unknown as number));
  const [disponivelEm, setDisponivelEm] = useState(imovel.disponivelEm ?? "");

  const [saving, setSaving] = useState(false);

  // aba ativa
  const [tab, setTab] = useState<"info" | "end" | "metrics">("info");

  useEffect(() => {
    if (!open) return;
    setEndereco(imovel.end ?? imovel.endereco ?? "");
    setNumero(imovel.numero ?? "");
    setComplemento(imovel.complemento ?? "");
    setBairro(imovel.bairro ?? "");
    setCidade(imovel.cidade ?? "");
    setUf(imovel.uf ?? "");
    setCep(imovel.cep ?? "");
    setTipo(imovel.tipo ?? "");
    setFinalidade(imovel.finalidade ?? "");
    setSituacao(imovel.situacao ?? "");
    setObs(imovel.obs ?? "");
    setArea(imovel.area ?? ("" as unknown as number));
    setQuartos(imovel.quartos ?? ("" as unknown as number));
    setBanheiros(imovel.banheiros ?? ("" as unknown as number));
    setVagas(imovel.vagas ?? ("" as unknown as number));
    setIptu(imovel.iptu ?? ("" as unknown as number));
    setCondominio(imovel.condominio ?? ("" as unknown as number));
    setAnoConstrucao(imovel.anoConstrucao ?? ("" as unknown as number));
    setDisponivelEm(imovel.disponivelEm ?? "");
    setSaving(false);
    setTab("info");
  }, [open, imovel]);

  const canSave = useMemo(() => {
    return (endereco ?? "").trim().length > 0 && !!imovel.id;
  }, [endereco, imovel.id]);

  async function handleSave() {
    if (!canSave || !imovel.id) return;
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
        obs,
        area: toNum(area),
        quartos: toNum(quartos),
        banheiros: toNum(banheiros),
        vagas: toNum(vagas),
        iptu: toNum(iptu),
        condominio: toNum(condominio),
        anoConstrucao: toNum(anoConstrucao),
        disponivelEm: (disponivelEm ?? "") || null,
      };

      const r = await fetch(`${API_BASE}/api/v1/imoveis/${imovel.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);

      const updated: Imovel = await r.json().catch(() => payload);
      onSaved?.({ ...updated, end: updated.endereco ?? updated.end ?? endereco });
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
        {/* Cabeçalho: título + CONCLUIR (topo) */}
        <div className="modalhead">
          <h3 id="edit-imovel-title" className="title">Editar imóvel</h3>
        </div>

        {/* Tabs */}
        <div className="tabbar">
          <button className={`tab ${tab === "info" ? "active" : ""}`} onClick={() => setTab("info")}>
            Informações
          </button>
          <button className={`tab ${tab === "end" ? "active" : ""}`} onClick={() => setTab("end")}>
            Endereço
          </button>
          <button className={`tab ${tab === "metrics" ? "active" : ""}`} onClick={() => setTab("metrics")}>
            Métricas
          </button>
        </div>

        {/* Conteúdo da aba */}
        <div className="modalbody">
          {tab === "info" && (
            <div className="grid">
              <div>
                <div className="label">TIPO</div>
                <input className="input" value={tipo ?? ""} onChange={(e) => setTipo(e.target.value)} />
              </div>

              <div>
                <div className="label">FINALIDADE</div>
                <input className="input" value={finalidade ?? ""} onChange={(e) => setFinalidade(e.target.value)} />
              </div>

              <div>
                <div className="label">SITUAÇÃO</div>
                <input className="input" value={situacao ?? ""} onChange={(e) => setSituacao(e.target.value)} />
              </div>

              <div className="full">
                <div className="label">OBSERVAÇÕES</div>
                <textarea className="input" rows={5} value={obs ?? ""} onChange={(e) => setObs(e.target.value)} />
              </div>
            </div>
          )}

          {tab === "end" && (
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
                <div className="label">CIDADE</div>
                <input className="input" value={cidade ?? ""} onChange={(e) => setCidade(e.target.value)} />
              </div>

              <div>
                <div className="label">UF</div>
                <input className="input" value={uf ?? ""} onChange={(e) => setUf(e.target.value)} />
              </div>

              <div>
                <div className="label">CEP</div>
                <input className="input" value={cep ?? ""} onChange={(e) => setCep(e.target.value)} />
              </div>
            </div>
          )}

          {tab === "metrics" && (
            <div className="grid">
              <div>
                <div className="label">ÁREA (m²)</div>
                <input className="input" value={val(area)} onChange={(e) => setArea(e.target.value as unknown as number)} />
              </div>

              <div>
                <div className="label">QUARTOS</div>
                <input className="input" value={val(quartos)} onChange={(e) => setQuartos(e.target.value as unknown as number)} />
              </div>

              <div>
                <div className="label">BANHEIROS</div>
                <input className="input" value={val(banheiros)} onChange={(e) => setBanheiros(e.target.value as unknown as number)} />
              </div>

              <div>
                <div className="label">VAGAS</div>
                <input className="input" value={val(vagas)} onChange={(e) => setVagas(e.target.value as unknown as number)} />
              </div>

              <div>
                <div className="label">IPTU (R$/mês)</div>
                <input className="input" value={val(iptu)} onChange={(e) => setIptu(e.target.value as unknown as number)} />
              </div>

              <div>
                <div className="label">CONDOMÍNIO (R$/mês)</div>
                <input className="input" value={val(condominio)} onChange={(e) => setCondominio(e.target.value as unknown as number)} />
              </div>

              <div>
                <div className="label">ANO DE CONSTRUÇÃO</div>
                <input className="input" value={val(anoConstrucao)} onChange={(e) => setAnoConstrucao(e.target.value as unknown as number)} />
              </div>

              <div>
                <div className="label">DISPONÍVEL A PARTIR DE</div>
                <input type="date" className="input" value={disponivelEm ?? ""} onChange={(e) => setDisponivelEm(e.target.value)} />
              </div>
            </div>
          )}
        </div>

        {/* Rodapé: CANCELAR (embaixo) */}
        <div className="foot">
          <button
            className="btn primary"
            onClick={handleSave}
            disabled={!canSave || saving}
          >
            {saving ? "Salvando..." : "Concluir"}
          </button>

          <button
            className="btn"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
