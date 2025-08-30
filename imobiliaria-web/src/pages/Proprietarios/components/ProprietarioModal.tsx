import { useEffect, useMemo, useState } from "react";
import type { Aba, Proprietario } from "../types";
import { cx, formatDoc, randomCPF, randomEmail, randomNome, randomPhone } from "../utils";
import { createProprietario, getProprietario, updateProprietario } from "../api";

type Props = {
  open: boolean;
  onClose: () => void;
  owner?: Proprietario | null; // se tiver id => editar/exibir, se não => criar
  onSaved: () => Promise<void> | void;
};

export default function ProprietarioModal({ open, onClose, owner, onSaved }: Props) {
  const [aba, setAba] = useState<Aba>("dados");
  const [editMode, setEditMode] = useState(!owner?.id); // novo => já em edição
  const [form, setForm] = useState<Proprietario>({
    id: owner?.id,
    nome: owner?.nome ?? "",
    doc: owner?.doc ?? "",
    email: owner?.email ?? "",
    tel: owner?.tel ?? "",
    obs: owner?.obs ?? "",
  });

  useEffect(() => {
    if (!open) return;
    setAba("dados");
    setEditMode(!owner?.id);
    setForm({
      id: owner?.id,
      nome: owner?.nome ?? "",
      doc: owner?.doc ?? "",
      email: owner?.email ?? "",
      tel: owner?.tel ?? "",
      obs: owner?.obs ?? "",
    });

    // tenta pegar detalhes do backend (se tiver id)
    (async () => {
      if (owner?.id) {
        try {
          const dto = await getProprietario(owner.id);
          setForm({
            id: dto.id,
            nome: dto.nome,
            doc: dto.doc,
            email: dto.email ?? "",
            tel: dto.tel ?? "",
            obs: dto.obs ?? "",
          });
        } catch {
          // falhou? segue com dados já passados pela lista
        }
      }
    })();
  }, [open, owner]);

  const isPJ = useMemo(() => (form.doc ?? "").replace(/\D/g, "").length > 11, [form.doc]);

  function setField<K extends keyof Proprietario>(k: K, v: Proprietario[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function randomizeAll() {
    const nome = randomNome();
    setField("nome", nome);
    setField("doc", randomCPF());
    setField("email", randomEmail(nome));
    setField("tel", randomPhone());
    setField("obs", Math.random() < 0.5 ? "Cliente indicado por parceiro." : "");
  }

  async function salvar() {
    if (form.id) await updateProprietario(form);
    else await createProprietario(form);
    await onSaved();
    onClose();
  }

  if (!open) return null;

  return (
    <div className="backdrop" onClick={(e) => e.currentTarget === e.target && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        {/* Cabeçalho */}
        <div className="modalhead">
          <div className="modal-title">
            <button className="xbtn" onClick={onClose} aria-label="Fechar">
              ✕
            </button>
            <div>
              <h3>{form.id ? form.nome : "Novo proprietário"}</h3>
              <div className="modal-sub">
                {form.id
                  ? `${formatDoc(form.doc)} · 0 imóveis`
                  : "Preencha os dados para cadastrar"}
              </div>
            </div>
          </div>
          <button className="xbtn" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="tabbar">
          {(["dados", "imoveis", "documentos"] as const).map((t) => (
            <button
              key={t}
              className={cx("tab", aba === t && "active")}
              onClick={() => setAba(t)}
            >
              {t === "dados" ? "Dados" : t === "imoveis" ? "Imóveis" : "Documentos"}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="modalbody">
          {aba === "dados" && (
            <div className="info-card">
              <div className="infogrid">
                <div>
                  <div className="k">NOME</div>
                  {editMode ? (
                    <input
                      className="input"
                      value={form.nome}
                      onChange={(e) => setField("nome", e.target.value)}
                    />
                  ) : (
                    <div className="v">{form.nome || "-"}</div>
                  )}
                </div>

                <div>
                  <div className="k">CPF/CNPJ</div>
                  {editMode ? (
                    <input
                      className="input"
                      value={form.doc}
                      onChange={(e) => setField("doc", e.target.value)}
                    />
                  ) : (
                    <div className="v">
                      {formatDoc(form.doc)}
                      <span style={{ fontSize: 11, color: "#64748b", marginLeft: 6 }}>
                        {(form.doc || "").replace(/\D/g, "").length > 11 ? "· PJ" : "· PF"}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="k">TELEFONE</div>
                  {editMode ? (
                    <input
                      className="input"
                      value={form.tel ?? ""}
                      onChange={(e) => setField("tel", e.target.value)}
                    />
                  ) : (
                    <div className="v">{form.tel || "-"}</div>
                  )}
                </div>

                <div>
                  <div className="k">E-MAIL</div>
                  {editMode ? (
                    <input
                      className="input"
                      type="email"
                      value={form.email ?? ""}
                      onChange={(e) => setField("email", e.target.value)}
                    />
                  ) : (
                    <div className="v">{form.email || "-"}</div>
                  )}
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <div className="k">OBSERVAÇÕES</div>
                  {editMode ? (
                    <textarea
                      className="input"
                      rows={4}
                      value={form.obs ?? ""}
                      onChange={(e) => setField("obs", e.target.value)}
                    />
                  ) : (
                    <div className="v">{form.obs || "-"}</div>
                  )}
                </div>
              </div>

              {/* Rodapé novo */}
              <div className="editwrap" style={{ justifyContent: "space-between" }}>
                <button className="btn big" onClick={randomizeAll}>
                  Randomizar (DEBUG)
                </button>
                <button className="btn big primary" onClick={salvar}>
                  Concluir
                </button>
              </div>
            </div>
          )}

          {aba === "imoveis" && (
            <div className="info-card">
              <div className="k" style={{ marginBottom: 8 }}>
                Imóveis
              </div>
              <div className="v" style={{ color: "#475569" }}>
                Placeholder — listar/gerenciar imóveis aqui.
              </div>
            </div>
          )}

          {aba === "documentos" && (
            <div className="info-card">
              <div className="k" style={{ marginBottom: 8 }}>
                Documentos
              </div>
              <div className="v" style={{ color: "#475569" }}>
                Placeholder — anexos/documentos do proprietário.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
