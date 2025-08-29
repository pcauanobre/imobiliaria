import { useEffect, useRef, useState, type FormEvent } from "react";
import "../layout.css";
import { useAuth } from "../../../hooks/useAuth";

type Props = { onClose: () => void };

export default function ProfileModal({ onClose }: Props) {
  const { user, setUser } = useAuth();
  const [nome, setNome] = useState(user?.nome ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function onPickFile() { fileRef.current?.click(); }
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setUser({
      ...(user ?? { id: 0, role: "ATENDENTE" as const, nome: "", email: "" }),
      nome, email
    });
    onClose();
  }

  return (
    <section className="modal-backdrop" onClick={(e)=> e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-head">
          <h3 id="modal-title" className="modal-title">Editar perfil</h3>
          <button className="icon-btn" aria-label="Fechar" onClick={onClose}>✕</button>
        </div>

        <form className="modal-body" onSubmit={onSubmit}>
          <div style={{ display:"grid", gridTemplateColumns:"140px 1fr", gap:16, alignItems:"center" }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ position:"relative", width:110, height:110, margin:"0 auto", borderRadius:"50%", overflow:"hidden", border:"1px solid #e2e8f0" }}>
                <img
                  src={preview ?? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=220&h=220&auto=format&fit=facearea&facepad=2"}
                  alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }}
                />
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={onFileChange} />
              <button type="button" className="btn muted" style={{ marginTop:10 }} onClick={onPickFile}>Trocar foto</button>
            </div>

            <div style={{ display:"grid", gap:10 }}>
              <label className="label" htmlFor="nome">Nome</label>
              <input id="nome" className="input" value={nome} onChange={e=>setNome(e.target.value)} />

              <label className="label" htmlFor="email" style={{ marginTop:8 }}>E-mail</label>
              <input id="email" type="email" className="input" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn muted" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn primary">Salvar</button>
          </div>
        </form>
      </div>
    </section>
  );
}
