// Cards de documentos (Identificação, Comprovante, Outros)
// - Altura do card dinâmica (sem minHeight fixa). Em "Outros", a lista vira scroll.
// - Remove o botão "Anexar" do topo (se um host tentar injetar).
// - "Assinado por ambos": só aparece quando há arquivo. Em "Outros", por arquivo.
// - Identificação/Comprovante com badge "Obrigatório" já no header.

import { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const MAX_OUTROS = 5;

const OUTROS_MAX_CARD_VH = 70;
const OUTROS_LIST_PADDING_RIGHT = 6;

type Kind = "ident" | "resid" | "outro";

type Doc = {
  id: number;
  ownerId: number;
  fileName: string;
  contentType: string;
  size: number;
  uploadedAt: string;
  url: string;
  kind?: Kind;
};

function formatBytes(n?: number) {
  if (!Number.isFinite(n as number)) return "-";
  const u = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let v = n as number;
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${u[i]}`;
}
function formatDateTime(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return isNaN(+d) ? "-" : d.toLocaleString();
}
const breakAll: React.CSSProperties = { wordBreak: "break-word", overflowWrap: "anywhere", whiteSpace: "normal" };

const memStore: Record<number, Doc[]> = {};
let seq = 1;

async function apiList(ownerId: number): Promise<Doc[]> {
  try {
    const r = await fetch(`${API_BASE}/api/v1/proprietarios/${ownerId}/docs`);
    if (!r.ok) throw new Error(String(r.status));
    const arr = await r.json();
    const list: Doc[] = (Array.isArray(arr) ? arr : []).map((d: any) => ({
      id: Number(d.id),
      ownerId: Number(d.ownerId ?? ownerId),
      fileName: String(d.fileName ?? d.name ?? ""),
      contentType: String(d.contentType ?? d.mime ?? "application/octet-stream"),
      size: Number(d.size ?? 0),
      uploadedAt: String(d.uploadedAt ?? new Date().toISOString()),
      url: String(d.url ?? d.link ?? "#"),
      kind: (d.kind as Kind) ?? guessKind(d.fileName),
    }));
    return list.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
  } catch {
    return (memStore[ownerId] ?? []).slice().sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
  }
}
async function apiUpload(ownerId: number, file: File, kind: Kind): Promise<Doc> {
  try {
    const fd = new FormData();
    fd.append("file", file, file.name);
    fd.append("kind", kind);
    const r = await fetch(`${API_BASE}/api/v1/proprietarios/${ownerId}/docs`, { method: "POST", body: fd });
    if (!r.ok) throw new Error(String(r.status));
    const d = await r.json();
    return {
      id: Number(d.id),
      ownerId,
      fileName: String(d.fileName ?? file.name),
      contentType: String(d.contentType ?? file.type ?? "application/octet-stream"),
      size: Number(d.size ?? file.size),
      uploadedAt: String(d.uploadedAt ?? new Date().toISOString()),
      url: String(d.url ?? "#"),
      kind: (d.kind as Kind) ?? kind,
    };
  } catch {
    const id = seq++; const url = URL.createObjectURL(file);
    const doc: Doc = {
      id, ownerId, fileName: file.name,
      contentType: file.type || "application/octet-stream",
      size: file.size, uploadedAt: new Date().toISOString(),
      url, kind,
    };
    memStore[ownerId] = memStore[ownerId] ?? [];
    memStore[ownerId].push(doc);
    return doc;
  }
}
async function apiDelete(ownerId: number, docId: number): Promise<void> {
  try {
    const r = await fetch(`${API_BASE}/api/v1/proprietarios/${ownerId}/docs/${docId}`, { method: "DELETE" });
    if (!r.ok) throw new Error(String(r.status));
  } catch {
    memStore[ownerId] = (memStore[ownerId] ?? []).filter((d) => d.id !== docId);
  }
}

const metaKeySingle = (ownerId: number, kind: Kind) => `owner:${ownerId}:docmeta:single:${kind}`;
const metaKeyFile = (ownerId: number, docId: number) => `owner:${ownerId}:docmeta:file:${docId}`;
function loadCheck(key: string): boolean {
  try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw) === true; } catch {}
  return false;
}
function saveCheck(key: string, v: boolean) {
  try { localStorage.setItem(key, JSON.stringify(!!v)); } catch {}
}

export default function DocumentosTab({
  ownerId,
  attachHeaderButton,
  onLeave,
}: {
  ownerId: number;
  attachHeaderButton?: (openPicker?: (() => void) | null, uploading?: boolean) => void;
  onLeave?: () => void;
}) {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingKind, setUploadingKind] = useState<Kind | null>(null);

  useEffect(() => {
    // @ts-ignore
    attachHeaderButton?.(null, false);
    return () => {
      // @ts-ignore
      attachHeaderButton?.(null, false);
      onLeave?.();
    };
  }, [attachHeaderButton, onLeave]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { setDocs(await apiList(ownerId)); } finally { setLoading(false); }
    })();
  }, [ownerId]);

  const byKind = useMemo(() => {
    const map: Record<Kind, Doc[]> = { ident: [], resid: [], outro: [] };
    docs.forEach((d) => map[(d.kind as Kind) ?? "outro"].push(d));
    return map;
  }, [docs]);

  async function handleFiles(kind: Kind, files: File[]) {
    if (!files?.length) return;
    setUploadingKind(kind);
    try {
      const single = kind !== "outro";
      let toUpload = single ? [files[0]] : files.slice();

      if (!single) {
        const current = byKind.outro.length;
        const remaining = Math.max(0, MAX_OUTROS - current);
        toUpload = toUpload.slice(0, remaining);
        if (remaining === 0) { setUploadingKind(null); return; }
      }

      for (const f of toUpload) {
        const doc = await apiUpload(ownerId, f, kind);
        setDocs((cur) => {
          let next = single ? cur.filter((d) => d.kind !== kind) : cur.slice();
          next.push(doc);
          return next;
        });
      }
    } finally { setUploadingKind(null); }
  }

  async function onDelete(doc: Doc) {
    if (!confirm("Remover este documento?")) return;
    await apiDelete(ownerId, doc.id);
    setDocs((cur) => cur.filter((d) => d.id !== doc.id));
  }

  return (
    <div className="tabcontent">
      {!loading && docs.length === 0 && (
        <div style={{
          border: "1px dashed #e2e8f0", background: "#f8fafc", padding: 12,
          borderRadius: 12, color: "#475569", marginBottom: 18, fontSize: 14,
        }}>
          Nenhum documento anexado até o momento.
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
        }}
      >
        <Bucket
          ownerId={ownerId}
          title="Identificação"
          required
          kind="ident"
          single
          files={byKind.ident}
          busy={uploadingKind === "ident"}
          onUpload={(fs) => handleFiles("ident", fs)}
          onDelete={onDelete}
        />
        <Bucket
          ownerId={ownerId}
          title="Comprovante de residência"
          required
          kind="resid"
          single
          files={byKind.resid}
          busy={uploadingKind === "resid"}
          onUpload={(fs) => handleFiles("resid", fs)}
          onDelete={onDelete}
        />
        <Bucket
          ownerId={ownerId}
          title="Outros"
          kind="outro"
          files={byKind.outro}
          busy={uploadingKind === "outro"}
          onUpload={(fs) => handleFiles("outro", fs)}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

function Bucket(props: {
  ownerId: number;
  title: string;
  required?: boolean;
  kind: Kind;
  single?: boolean;
  files: Doc[];
  busy?: boolean;
  onUpload: (files: File[]) => void;
  onDelete: (doc: Doc) => void;
}) {
  const { ownerId, title, required, kind, single, files, busy, onUpload, onDelete } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const singleFile = single ? files[0] : undefined;
  const hasFile = single ? !!singleFile : files.length > 0;

  const showDropzone = single ? !hasFile : files.length < MAX_OUTROS;

  const singleKey = metaKeySingle(ownerId, kind);
  const [signedSingle, setSignedSingle] = useState<boolean>(() => loadCheck(singleKey));
  useEffect(() => { saveCheck(singleKey, signedSingle); }, [singleKey, signedSingle]);

  const isOutros = kind === "outro";

  return (
    <section
      className="card"
      style={{
        background: "#fff",
        border: "1px solid rgba(2,6,23,.06)",
        borderRadius: 22,
        boxShadow: "0 14px 40px rgba(2,6,23,.08)",
        display: "flex",
        flexDirection: "column",
        padding: 16,
        alignSelf: "start",
        ...(isOutros ? { maxHeight: `${OUTROS_MAX_CARD_VH}vh`, overflow: "hidden" } : {}),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>{title}</div>
        {required && (
          <span
            style={{
              marginLeft: 6, background: "#fff5f5", border: "1px solid #ffe1e1",
              color: "#e11d48", borderRadius: 999, padding: "3px 10px", fontWeight: 800, fontSize: 12,
            }}
          >
            Obrigatório
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0, minHeight: 0, flex: 1 }}>
        {showDropzone && (
          <>
            <Dropzone
              busy={!!busy}
              hint={
                single
                  ? "Selecione um arquivo (enviar outro substituirá o existente)."
                  : `Você pode enviar até ${MAX_OUTROS} arquivos.`
              }
              onPick={() => inputRef.current?.click()}
              onDrop={(fs) => onUpload(fs)}
            />
            <input
              ref={inputRef}
              type="file"
              style={{ display: "none" }}
              accept={"application/pdf,image/*"}
              multiple={!single}
              onChange={(e) => {
                const fs = Array.from(e.target.files || []);
                if (fs.length) onUpload(fs);
                e.currentTarget.value = "";
              }}
            />
          </>
        )}

        <div
          style={{
            marginTop: 14,
            display: "grid",
            gap: 10,
            ...(isOutros
              ? { flex: 1, minHeight: 0, overflowY: "auto", paddingRight: OUTROS_LIST_PADDING_RIGHT }
              : {}),
          }}
        >
          {single ? (
            hasFile ? (
              <FileRow
                doc={singleFile!}
                onDelete={() => onDelete(singleFile!)}
                showCheck={false}
              />
            ) : (
              <EmptyFileRow />
            )
          ) : files.length ? (
            files.map((d) => (
              <FileRow
                key={d.id}
                doc={d}
                onDelete={() => onDelete(d)}
                showCheck
                checkKey={metaKeyFile(ownerId, d.id)}
              />
            ))
          ) : (
            <EmptyFileRow />
          )}
        </div>
      </div>

      {single && hasFile && (
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 400 }}>
            <input
              type="checkbox"
              checked={signedSingle}
              onChange={(e) => setSignedSingle(e.target.checked)}
            />
            <span>Assinado por ambos</span>
          </label>
        </div>
      )}
    </section>
  );
}

function Dropzone({
  onPick, onDrop, busy, hint,
}: { onPick: () => void; onDrop: (files: File[]) => void; busy?: boolean; hint?: string }) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); const files = Array.from(e.dataTransfer.files || []); if (files.length) onDrop(files); }}
      onClick={() => onPick()}
      title="Clique para selecionar arquivos"
      style={{
        border: "2px dashed #cbd5e1", borderRadius: 14, padding: 18, textAlign: "center",
        color: "#64748b", background: "#f8fafc", cursor: "pointer",
      }}
    >
      <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden style={{ marginBottom: 6, display: "inline-block" }}>
        <path d="M4 19h16a1 1 0 001-1v-3" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round"/>
        <path d="M7 10l5-5 5 5" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 5v10" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <div style={{ fontWeight: 700, color: "#0f172a" }}>
        {busy ? "Anexando…" : "Clique para selecionar arquivos"}
      </div>
      <div style={{ fontSize: 12, marginTop: 6 }}>Tipos: PDF, PNG, JPG • Máx: 15 MB</div>
      {hint && <div style={{ fontSize: 12, marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

function FileRow({
  doc, onDelete, showCheck, checkKey,
}: { doc: Doc; onDelete: () => void; showCheck?: boolean; checkKey?: string }) {
  const isPdf = (doc.contentType || "").includes("pdf");
  const isImg = (doc.contentType || "").startsWith("image/");
  const isPreviewable = isPdf || isImg;

  const [signed, setSigned] = useState<boolean>(() => (checkKey ? loadCheck(checkKey) : false));
  useEffect(() => { if (checkKey) saveCheck(checkKey, signed); }, [checkKey, signed]);

  return (
    <div
      style={{
        border: "1px solid #e2e8f0", borderRadius: 14, padding: 12,
        display: "grid", gap: 10,
      }}
      title={`${doc.fileName} — ${formatBytes(doc.size)} — ${formatDateTime(doc.uploadedAt)}`}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <div aria-hidden style={{
            width: 40, height: 40, borderRadius: 12, border: "1px solid #e2e8f0",
            display: "grid", placeItems: "center", background: "#fff", flex: "0 0 40px",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a">
              <path d="M6 3h8l4 4v14H6z" strokeWidth="1.8" />
              <path d="M9 8h6" strokeWidth="1.8" />
              <path d="M9 12h6" strokeWidth="1.8" />
            </svg>
          </div>
          <a
            href={doc.url}
            target={isPreviewable ? "_blank" : undefined}
            rel={isPreviewable ? "noreferrer" : undefined}
            download={!isPreviewable ? doc.fileName : undefined}
            style={{ ...breakAll, color: "#0f172a", fontWeight: 700, fontSize: 14, textDecoration: "underline" }}
          >
            {doc.fileName}
          </a>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href={doc.url} download={doc.fileName} style={btnPrimary} title="Baixar">Baixar</a>
          <button onClick={onDelete} style={btnSoft} title="Excluir">Excluir</button>
        </div>
      </div>

      <div style={{ height: 1, background: "#e2e8f0" }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
        <div style={chipSm}>
          <div style={chipSmLabel}>DATA DE ENVIO</div>
          <div style={chipSmValue}>{formatDateTime(doc.uploadedAt)}</div>
        </div>
        <div style={chipSm}>
          <div style={chipSmLabel}>TAMANHO</div>
          <div style={chipSmValue}>{formatBytes(doc.size)}</div>
        </div>
      </div>

      {showCheck && (
        <div style={{ textAlign: "center" }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 400 }}>
            <input type="checkbox" checked={signed} onChange={(e) => setSigned(e.target.checked)} />
            <span>Assinado por ambos</span>
          </label>
        </div>
      )}
    </div>
  );
}

function EmptyFileRow() {
  return (
    <div style={{ border: "1px dashed #e2e8f0", borderRadius: 14, padding: 12, color: "#64748b" }}>
      Nenhum arquivo enviado.
    </div>
  );
}

const chipSm: React.CSSProperties = {
  display: "inline-flex", flexDirection: "column", gap: 3,
  background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 999,
  padding: "4px 8px", minWidth: 120, textAlign: "center",
};
const chipSmLabel: React.CSSProperties = { fontSize: 9, color: "#64748b", letterSpacing: 0.3 };
const chipSmValue: React.CSSProperties = { fontSize: 11.5, color: "#334155", fontWeight: 600 };

const btnPrimary: React.CSSProperties = {
  display: "inline-flex", alignItems: "center",
  padding: "9px 13px", borderRadius: 12, border: "1px solid transparent",
  background: "#0B1321", color: "#fff", fontWeight: 800, fontSize: 13, textDecoration: "none", cursor: "pointer",
};
const btnSoft: React.CSSProperties = {
  display: "inline-flex", alignItems: "center",
  padding: "10px 14px", borderRadius: 12, border: "1px solid #e2e8f0",
  background: "#f8fafc", color: "#0f172a", fontWeight: 700, cursor: "pointer",
};

function guessKind(name: string | undefined): Kind {
  const n = (name ?? "").toLowerCase();
  if (/(rg|cnh|identidade|id|cpf)/.test(n)) return "ident";
  if (/(resid|endereco|luz|agua)/.test(n)) return "resid";
  return "outro";
}
