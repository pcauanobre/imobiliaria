// pages/Proprietarios/Detail/tabs/DadosTab.tsx
// Exibe os dados do proprietário em grade (somente visualização).

type Proprietario = {
  id?: number;
  nome: string | null | undefined;
  doc: string | null | undefined;
  email?: string | null;
  tel?: string | null;
  obs?: string | null;
  // extras podem vir no objeto mas não são obrigatórios no tipo
  // endereco?: string | null;
  // estadoCivil?: string | null;
  // ocupacao?: string | null;
};

type Props = {
  owner: Proprietario;
};

function formatDoc(doc?: string | null) {
  const d = (doc ?? "").replace(/\D/g, "");
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  return doc ?? "-";
}
const safe = (v?: string | null) => (v && String(v).trim() ? String(v) : "-");

export default function DadosTab({ owner }: Props) {
  // Campos extras podem não existir no back ainda — lemos via "any"
  const extra = owner as any;
  const estadoCivil = safe(extra?.estadoCivil);
  const ocupacao = safe(extra?.ocupacao);
  const endereco = safe(extra?.endereco); // Rua + número em um campo único

  return (
    <div className="grid">
      <div>
        <div className="k">NOME</div>
        <div className="v">{safe(owner?.nome as any)}</div>
      </div>

      <div>
        <div className="k">CPF/CNPJ</div>
        <div className="v">{formatDoc(owner?.doc as any)}</div>
      </div>

      <div>
        <div className="k">E-MAIL</div>
        <div className="v">{safe(owner?.email)}</div>
      </div>

      <div>
        <div className="k">TELEFONE</div>
        <div className="v">{safe(owner?.tel)}</div>
      </div>

      <div>
        <div className="k">ESTADO CIVIL</div>
        <div className="v">{estadoCivil}</div>
      </div>

      <div>
        <div className="k">OCUPAÇÃO</div>
        <div className="v">{ocupacao}</div>
      </div>

      <div className="full">
        <div className="k">ENDEREÇO (rua e número)</div>
        <div className="v">{endereco}</div>
      </div>

      <div className="full">
        <div className="k">OBSERVAÇÕES</div>
        <div className="v">{safe(owner?.obs)}</div>
      </div>
    </div>
  );
}
