import { useEffect, useState } from "react";
import { proprietariosCss } from "./styles";
import { formatDoc } from "./utils";
import type { Proprietario } from "./types";
import { deleteProprietario, listProprietarios } from "./api";
import ProprietarioModal from "./components/ProprietarioModal";
import ConfirmDeleteDialog from "./components/ConfirmDeleteDialog";

export default function ProprietariosPage() {
  const [owners, setOwners] = useState<Proprietario[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  // modais
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOwner, setModalOwner] = useState<Proprietario | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<number | null>(null);

  async function carregar() {
    setLoading(true);
    try {
      const data = await listProprietarios();
      setOwners(data);
    } catch (e) {
      console.error(e);
      alert("Falha ao carregar proprietários.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  const filtrados = owners.filter((o) => {
    const w = q.trim().toLowerCase();
    if (!w) return true;
    return (o.nome ?? "").toLowerCase().includes(w) || (o.doc ?? "").includes(w);
  });

  return (
    <div className="page">
      <style>{proprietariosCss}</style>

      {/* breadcrumb alinhado à esquerda */}
      <div className="header">
        <div className="breadcrumb">
          Dashboard/<br />
          <span className="breadcrumb-active">Proprietarios</span>
        </div>
        <div />
      </div>

      {/* busca centralizada */}
      <div className="searchwrap">
        <input
          className="input"
          placeholder="Buscar por nome ou CPF/CNPJ"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* lista */}
      <section className="card">
        <div className="cardhead">
          <div>
            <h2>Proprietários</h2>
            <p>Gerencie dados, documentos e vínculos com imóveis.</p>
          </div>
          <button
            className="btn micro primary"
            style={{ padding: "10px 18px" }} // aqui aumenta o padding só desse botão
            onClick={() => { setModalOwner(null); setModalOpen(true); }}
          >
            Adicionar proprietário
          </button>
        </div>

        <div className="tablewrap">
          <table className="table">
            <thead>
              <tr>
                <th>NOME</th>
                <th>CPF/CNPJ</th>
                <th>E-MAIL</th>
                <th>TELEFONE</th>
                <th>OBSERVAÇÕES</th>
                <th style={{ textAlign: "center" }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: 24, textAlign: "center", color: "#64748b" }}>Carregando...</td></tr>
              ) : filtrados.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 24, textAlign: "center", color: "#64748b" }}>Nenhum proprietário encontrado.</td></tr>
              ) : (
                filtrados.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <button className="btn micro" onClick={() => { setModalOwner(o); setModalOpen(true); }}>
                        {o.nome}
                      </button>
                    </td>
                    <td>{formatDoc(o.doc)}</td>
                    <td>{o.email || "-"}</td>
                    <td>{o.tel || "-"}</td>
                    <td>{o.obs || "-"}</td>
                    <td style={{ textAlign: "center" }}>
                      <div className="rowact" style={{ justifyContent: "center" }}>
                        <button
                          className="iconbtn"
                          title="Detalhes"
                          onClick={() => { setModalOwner(o); setModalOpen(true); }}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                            <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button
                          className="iconbtn danger"
                          title="Excluir"
                          onClick={() => { setToDelete(o.id!); setConfirmOpen(true); }}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M9 6v12m6-12v12M10 6l1-2h2l1 2M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14" />
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

      {/* modal de cadastro/edição/detalhes */}
      <ProprietarioModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        owner={modalOwner ?? undefined}
        onSaved={carregar}
      />

      {/* confirmação de exclusão */}
      <ConfirmDeleteDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          if (!toDelete) return;
          await deleteProprietario(toDelete);
          setConfirmOpen(false);
          setToDelete(null);
          await carregar();
          alert("🗑️ Excluído com sucesso.");
        }}
      />
    </div>
  );
}
