// src/pages/Proprietarios/Imoveis/ImovelDetail/tabs/FotosTab.tsx
// Aba "Fotos" do IMÓVEL
// - Dropzone (múltiplos arquivos) no topo
// - Grade de cartões com preview, nome, tamanho, data
// - Ações: Definir capa, Baixar, Excluir
// - Botão "Salvar alterações" para enviar pendentes (mock de API por enquanto)

import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

/* ================== Tipos ================== */
type Photo = {
  id?: string;          // id de backend (quando salvo)
  name: string;
  size: number;
  uploadedAt: string;   // ISO
  url: string;          // objectURL ou URL do backend
  isCover?: boolean;
  pending?: boolean;    // ainda não enviada
};

/* ================== Estilos ================== */
const css = `
.wrap{ display:grid; gap:18px }
.card{
  background:#fff; border:1px solid rgba(2,6,23,.06); border-radius:18px;
  box-shadow:0 14px 40px rgba(2,6,23,.08);
}
.card-hd{ padding:16px 18px; border-bottom:1px solid #e5e7eb; display:flex; align-items:center; gap:10px }
.card-hd h3{ margin:0; font-size:16px }
.card-bd{ padding:16px 18px }

.drop{
  border:2px dashed #cbd5e1; border-radius:14px; padding:22px; text-align:center; background:#f8fafc; cursor:pointer;
}
.drop:hover{ background:#f1f5f9 }
.drop input{ display:none }
.help{ font-size:12px; color:#64748b; margin-top:6px }

.grid{
  display:grid;
  grid-template-columns: repeat( auto-fill, minmax(220px, 1fr) );
  gap:14px;
}

.photo{
  border:1px solid #e5e7eb; border-radius:16px; overflow:hidden; display:flex; flex-direction:column; background:#fff;
}
.thumb{
  position:relative; width:100%; aspect-ratio: 4/3; background:#f1f5f9; overflow:hidden;
}
.thumb img{ width:100%; height:100%; object-fit:cover; display:block }
.cover-badge{
  position:absolute; top:10px; left:10px; background:#0B1321; color:#fff;
  font-size:11px; font-weight:800; padding:4px 8px; border-radius:999px;
}
.pending-badge{
  position:absolute; top:10px; right:10px; background:#fde68a; color:#7c2d12;
  font-size:11px; font-weight:800; padding:4px 8px; border-radius:999px;
}
.meta{ padding:10px 12px; display:flex; flex-direction:column; gap:6px }
.name{ font-weight:700; color:#0f172a; overflow:hidden; text-overflow:ellipsis; white-space:nowrap }
.sub{ display:flex; gap:10px; color:#64748b; font-size:12px; flex-wrap:wrap }
.kv{ background:#eef2ff; color:#374151; border-radius:10px; padding:4px 8px }

.actions{ display:flex; gap:8px; padding:10px 12px 14px }
.btn{
  display:inline-flex; align-items:center; justify-content:center; gap:6px; border-radius:10px;
  border:1px solid #e2e8f0; padding:8px 10px; background:#fff; cursor:pointer; font-weight:700; font-size:13px;
}
.btn:hover{ background:#f8fafc }
.btn.primary{ background:#0B1321; color:#fff; border-color:#0B1321 }
.btn.ghost{ background:#fff }
.btn.danger{ background:#fee2e2; color:#7f1d1d; border-color:#fecaca }

.toolbar{
  display:flex; align-items:center; justify-content:flex-end; gap:10px; padding:6px 0 0;
}
`;

/* ================== Helpers ================== */
function formatSize(bytes: number) {
  if (!Number.isFinite(bytes)) return "-";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}
function nowLocalISODateTime() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
}

/* Mocks de API — troque por chamadas reais quando houver backend */
async function apiUploadPhotos(/*imovelId:number, files: File[]*/) {
  await new Promise((r) => setTimeout(r, 450));
}
async function apiDeletePhoto(/*imovelId:number, photoId:string*/) {
  await new Promise((r) => setTimeout(r, 220));
}
async function apiSetCover(/*imovelId:number, photoId:string*/) {
  await new Promise((r) => setTimeout(r, 180));
}

/* ================== Componente ================== */
export default function FotosTab() {
  const { imovelId } = useParams();
  const pickRef = useRef<HTMLInputElement | null>(null);

  // Lista local (pode iniciar vazia; quando ligar no backend, carregue aqui)
  const [photos, setPhotos] = useState<Photo[]>([]);

  const hasPending = useMemo(() => photos.some((p) => p.pending), [photos]);
  const canSave = hasPending;

  function openPicker() {
    pickRef.current?.click();
  }

  function handleFiles(files?: FileList | null) {
    if (!files || files.length === 0) return;
    const arr = Array.from(files).slice(0, 50); // limite generoso
    const mapped = arr.map<Photo>((f) => ({
      name: f.name,
      size: f.size,
      uploadedAt: nowLocalISODateTime(),
      url: URL.createObjectURL(f),
      pending: true,
    }));
    setPhotos((prev) => [...mapped, ...prev]);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
    // permite escolher o mesmo arquivo novamente
    if (pickRef.current) pickRef.current.value = "";
  }

  async function saveAll() {
    try {
      const pendings = photos.filter((p) => p.pending);
      if (pendings.length === 0) return;
      // const id = Number(imovelId);
      // await apiUploadPhotos(id, ???) — quando integrar, precisaremos guardar File; por ora, só confirmamos.
      await apiUploadPhotos();
      // marca como salvas
      setPhotos((list) =>
        list.map((p, idx) =>
          p.pending
            ? {
                ...p,
                pending: false,
                id: p.id ?? `ph_${Date.now()}_${idx}`,
              }
            : p
        )
      );
      alert("Fotos enviadas.");
    } catch {
      alert("Falha ao enviar fotos.");
    }
  }

  async function removePhoto(i: number) {
    try {
      const ph = photos[i];
      if (ph.id && !ph.pending) {
        // await apiDeletePhoto(Number(imovelId), ph.id);
        await apiDeletePhoto();
      }
      URL.revokeObjectURL(ph.url);
      setPhotos((list) => list.filter((_, idx) => idx !== i));
    } catch {
      alert("Falha ao excluir.");
    }
  }

  async function setAsCover(i: number) {
    try {
      const ph = photos[i];
      if (ph.id && !ph.pending) {
        // await apiSetCover(Number(imovelId), ph.id);
        await apiSetCover();
      }
      setPhotos((list) =>
        list.map((p, idx) => ({ ...p, isCover: idx === i }))
      );
    } catch {
      alert("Falha ao definir capa.");
    }
  }

  return (
    <div className="wrap">
      <style>{css}</style>

      {/* Upload / Dropzone */}
      <section className="card">
        <div className="card-hd">
          <h3>Adicionar fotos do imóvel</h3>
        </div>
        <div className="card-bd">
          <div
            className="drop"
            onClick={openPicker}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
            }}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 6 }}>
              Clique para selecionar arquivos ou arraste e solte aqui
            </div>
            <div className="help">Tipos: PNG, JPG • Tamanho máx. recomendado: 15 MB por foto</div>
            <input
              ref={pickRef}
              type="file"
              accept="image/*"
              multiple
              onChange={onInputChange}
            />
          </div>

          <div className="toolbar">
            <button className="btn primary" onClick={saveAll} disabled={!canSave}>
              Salvar alterações
            </button>
          </div>
        </div>
      </section>

      {/* Grade de fotos */}
      <section className="card">
        <div className="card-hd">
          <h3>Galeria</h3>
        </div>
        <div className="card-bd">
          {photos.length === 0 ? (
            <div style={{ color: "#64748b", fontSize: 14 }}>
              Nenhuma foto adicionada ainda.
            </div>
          ) : (
            <div className="grid">
              {photos.map((p, i) => (
                <div className="photo" key={p.id ?? p.url}>
                  <div className="thumb">
                    <img src={p.url} alt={p.name} />
                    {p.isCover && <span className="cover-badge">Capa</span>}
                    {p.pending && <span className="pending-badge">Pendente</span>}
                  </div>
                  <div className="meta">
                    <div className="name" title={p.name}>{p.name}</div>
                    <div className="sub">
                      <span className="kv">{formatSize(p.size)}</span>
                      <span className="kv">{p.uploadedAt}</span>
                    </div>
                  </div>
                  <div className="actions">
                    <button
                      className="btn"
                      onClick={() => {
                        const w = window.open(p.url, "_blank");
                        // nada
                      }}
                    >
                      Baixar
                    </button>
                    <button
                      className="btn ghost"
                      onClick={() => setAsCover(i)}
                      disabled={p.isCover}
                      title="Definir como capa"
                    >
                      Capa
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => removePhoto(i)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
