// src/pages/Proprietarios/Imoveis/ImovelDetail/tabs/ContratosTab.tsx
// Aba "Contratos" do IMÓVEL
// - Upload do PDF do Contrato ADM (visual igual aos docs do proprietário)
// - Quadro-resumo editável (garantido, comissão, início, prazo/termino, repasse)
// - Checkbox "Assinado por ambos" obrigatório para salvar/upload
// - Log básico (quem/quando) — aqui mockado no front para integração posterior.

import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

/* ================== Tipos ================== */
type LogEntry = {
  ts: string;          // ISO
  user: string;        // ex.: "Você" (mock)
  action: string;      // "Envio", "Atualização do resumo", etc.
  details?: string;
};

type QuadroResumoADM = {
  tipoAdm: "Garantido" | "Não garantido" | "";
  comissao: string;          // "12" (%)
  inicio: string;            // yyyy-MM-dd
  prazoMeses: string;        // "30"
  termino: string;           // yyyy-MM-dd (auto/preenchível)
  repasseDia: string;        // "15"
  assinado: boolean;
};

/* ================== Estilos (copiando o look & feel dos docs do proprietário) ================== */
const css = `
.wrap { display:grid; grid-template-columns: 1fr 1fr; gap:18px }
.card{
  background:#fff; border:1px solid rgba(2,6,23,.06); border-radius:18px;
  box-shadow:0 14px 40px rgba(2,6,23,.08);
}
.card-hd{ padding:16px 18px; border-bottom:1px solid #e5e7eb; display:flex; align-items:center; gap:10px }
.card-hd h3{ margin:0; font-size:16px }
.badge-req{ margin-left:8px; background:#fee2e2; color:#b91c1c; font-weight:700; font-size:11px; padding:3px 8px; border-radius:999px }
.card-bd{ padding:16px 18px }

.drop{
  border:2px dashed #cbd5e1; border-radius:14px; padding:22px; text-align:center; background:#f8fafc;
}
.drop:hover{ background:#f1f5f9 }
.drop input{ display:none }

.file-chip{
  border:1px solid #e5e7eb; border-radius:14px; padding:12px; display:flex; align-items:center; justify-content:space-between; gap:12px;
}
.file-meta{ display:flex; flex-direction:column; gap:6px }
.file-name{ color:#0B1321; font-weight:700; text-decoration:underline; cursor:default }
.file-sub{ display:flex; gap:12px; color:#64748b; font-size:12px }
.kv{ background:#eef2ff; color:#374151; border-radius:12px; padding:6px 10px; }
.actions{ display:flex; gap:10px }
.btn{
  display:inline-flex; align-items:center; justify-content:center; gap:8px; border-radius:12px;
  border:1px solid #e2e8f0; padding:10px 14px; background:#fff; cursor:pointer; font-weight:700;
}
.btn.primary{ background:#0B1321; color:#fff; border-color:#0B1321 }
.btn.danger{ background:#fee2e2; color:#7f1d1d; border-color:#fecaca }

.grid{ display:grid; grid-template-columns:1fr 1fr; gap:12px }
.full{ grid-column:1 / -1 }
.label{ font-size:12px; color:#64748b; margin:8px 0 6px }
.input, .select{
  width:100%; background:#fff; border:1px solid #e2e8f0; border-radius:14px; padding:10px 12px; font-size:15px; outline:none;
}
.input:focus, .select:focus{ box-shadow:0 0 0 3px rgba(11,19,33,.22); border-color:#94a3b8 }

.footer{ display:flex; justify-content:flex-end; gap:10px; padding:14px 18px; border-top:1px solid #e5e7eb; }

.logs{ margin-top:18px }
.log-item{ display:flex; gap:10px; align-items:flex-start; padding:8px 0; border-bottom:1px dashed #e5e7eb }
.log-ts{ font-size:12px; color:#64748b; min-width:145px }
.log-txt{ font-size:14px; color:#0f172a }
.checkbox{ display:flex; align-items:center; gap:8px; margin-top:10px; font-size:14px }
`;

/* ================== Helpers ================== */
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
// TODO: ligar endpoints reais quando disponíveis
async function uploadADMContract(/*imovelId: number, file: File, payload: QuadroResumoADM*/) {
  await new Promise(r => setTimeout(r, 400));
}
async function deleteADMContract(/*imovelId: number*/) {
  await new Promise(r => setTimeout(r, 250));
}
function formatSize(bytes: number) {
  if (!Number.isFinite(bytes)) return "-";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}
function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,19).replace("T"," ");
}

/* ================== Componente ================== */
export default function ContratosTab() {
  const { imovelId } = useParams();

  // Upload
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedAt, setUploadedAt] = useState<string | null>(null);

  // Quadro resumo
  const [resumo, setResumo] = useState<QuadroResumoADM>({
    tipoAdm: "",
    comissao: "",
    inicio: "",
    prazoMeses: "30",
    termino: "",
    repasseDia: "15",
    assinado: false,
  });

  // Logs
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const canSave = useMemo(() => {
    const hasFile = !!file;
    const okResumo =
      !!resumo.tipoAdm &&
      !!resumo.comissao &&
      !!resumo.inicio &&
      (!!resumo.prazoMeses || !!resumo.termino) &&
      !!resumo.repasseDia &&
      !!resumo.assinado;
    return hasFile && okResumo;
  }, [file, resumo]);

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      setUploadedAt(todayISO());
      setLogs((l) => [{ ts: new Date().toISOString(), user: "Você", action: "Envio", details: f.name }, ...l]);
    }
  }

  function limparArquivo() {
    setFile(null);
    if (fileInput.current) fileInput.current.value = "";
    setLogs((l) => [{ ts: new Date().toISOString(), user: "Você", action: "Exclusão do arquivo" }, ...l]);
  }

  function onChangeResumo<K extends keyof QuadroResumoADM>(k: K, v: QuadroResumoADM[K]) {
    setResumo((p) => {
      const next = { ...p, [k]: v };
      // calcula término se houver prazoMeses e início
      if ((k === "prazoMeses" || k === "inicio") && next.prazoMeses && next.inicio) {
        const m = Number(next.prazoMeses);
        if (Number.isFinite(m)) {
          const d = new Date(next.inicio + "T00:00:00");
          d.setMonth(d.getMonth() + m);
          next.termino = d.toISOString().slice(0, 10);
        }
      }
      return next;
    });
  }

  async function salvar() {
    if (!canSave) {
      alert("Preencha o quadro-resumo e marque 'Assinado por ambos'.");
      return;
    }
    try {
      // const id = Number(imovelId);
      // await uploadADMContract(id, file!, resumo);
      await uploadADMContract();
      setLogs((l) => [{ ts: new Date().toISOString(), user: "Você", action: "Atualização do resumo/contrato" }, ...l]);
      alert("Contrato salvo com sucesso.");
    } catch (e: any) {
      alert("Falha ao salvar contrato.");
    }
  }

  async function excluirContrato() {
    try {
      // await deleteADMContract(Number(imovelId));
      await deleteADMContract();
      limparArquivo();
      alert("Contrato excluído.");
    } catch {
      alert("Falha ao excluir.");
    }
  }

  return (
    <div>
      <style>{css}</style>

      <div className="wrap">
        {/* ==== Coluna 1: Upload do Contrato ADM ==== */}
        <section className="card">
          <div className="card-hd">
            <h3>Contrato de Administração (ADM)</h3>
            <span className="badge-req">Obrigatório</span>
          </div>
          <div className="card-bd" style={{ display: "grid", gap: 12 }}>
            {!file && (
              <label className="drop" htmlFor="file-adm">
                <div style={{ fontWeight: 800, marginBottom: 6 }}>Clique para selecionar arquivos</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Tipos: PDF, PNG, JPG • Máx: 15 MB
                </div>
                <input
                  id="file-adm"
                  ref={fileInput}
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={onPickFile}
                />
              </label>
            )}

            {file && (
              <div className="file-chip">
                <div className="file-meta">
                  <div className="file-name">{file.name}</div>
                  <div className="file-sub">
                    <span className="kv">DATA DE ENVIO: {uploadedAt ?? "-"}</span>
                    <span className="kv">TAMANHO: {formatSize(file.size)}</span>
                  </div>
                </div>
                <div className="actions">
                  <button className="btn" onClick={() => file && window.open(URL.createObjectURL(file), "_blank")}>
                    Baixar
                  </button>
                  <button className="btn danger" onClick={excluirContrato}>
                    Excluir
                  </button>
                </div>
              </div>
            )}

            <label className="checkbox">
              <input
                type="checkbox"
                checked={resumo.assinado}
                onChange={(e) => onChangeResumo("assinado", e.target.checked)}
              />
              Assinado por ambos
            </label>
          </div>

          <div className="footer">
            <button className="btn primary" onClick={salvar} disabled={!canSave}>
              Salvar contrato
            </button>
          </div>
        </section>

        {/* ==== Coluna 2: Quadro Resumo do ADM ==== */}
        <section className="card">
          <div className="card-hd">
            <h3>Quadro resumo do contrato ADM</h3>
          </div>
          <div className="card-bd">
            <div className="grid">
              <div>
                <div className="label">TIPO DA ADMINISTRAÇÃO</div>
                <select
                  className="select"
                  value={resumo.tipoAdm}
                  onChange={(e) => onChangeResumo("tipoAdm", e.target.value as any)}
                >
                  <option value="">Selecione…</option>
                  <option>Garantido</option>
                  <option>Não garantido</option>
                </select>
              </div>

              <div>
                <div className="label">COMISSÃO (%)</div>
                <input
                  className="input"
                  placeholder="Ex.: 12"
                  value={resumo.comissao}
                  onChange={(e) => onChangeResumo("comissao", e.target.value)}
                />
              </div>

              <div>
                <div className="label">DATA DE INÍCIO</div>
                <input
                  type="date"
                  className="input"
                  value={resumo.inicio}
                  onChange={(e) => onChangeResumo("inicio", e.target.value)}
                />
              </div>

              <div>
                <div className="label">PRAZO (MESES)</div>
                <input
                  className="input"
                  placeholder="Ex.: 30"
                  value={resumo.prazoMeses}
                  onChange={(e) => onChangeResumo("prazoMeses", e.target.value)}
                />
              </div>

              <div>
                <div className="label">DATA DE TÉRMINO</div>
                <input
                  type="date"
                  className="input"
                  value={resumo.termino}
                  onChange={(e) => onChangeResumo("termino", e.target.value)}
                />
              </div>

              <div>
                <div className="label">DIA DO REPASSE AO PROPRIETÁRIO</div>
                <input
                  className="input"
                  placeholder="Ex.: 15"
                  value={resumo.repasseDia}
                  onChange={(e) => onChangeResumo("repasseDia", e.target.value)}
                />
              </div>

              <div className="full" style={{ fontSize: 12, color: "#64748b" }}>
                Observação: o checkbox “Assinado por ambos” é <b>obrigatório</b> para concluir o upload. Sem ele, um alerta deve ser mantido no sistema.
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ==== Log ==== */}
      <section className="card logs">
        <div className="card-hd">
          <h3>Log</h3>
        </div>
        <div className="card-bd">
          {logs.length === 0 && <div style={{ color:"#64748b", fontSize:14 }}>Sem atividades registradas.</div>}
          {logs.map((l, i) => (
            <div className="log-item" key={i}>
              <div className="log-ts">{new Date(l.ts).toLocaleString()}</div>
              <div className="log-txt">
                <b>{l.user}</b> — {l.action}
                {l.details ? ` • ${l.details}` : ""}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
