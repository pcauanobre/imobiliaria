type Imovel = {
  id?: number;
  end?: string | null;
  endereco?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  cep?: string | null;
  tipo?: string | null;
  finalidade?: string | null;
  situacao?: string | null;
  obs?: string | null;
  area?: number | null;
  quartos?: number | null;
  banheiros?: number | null;
  vagas?: number | null;
  iptu?: number | null;
  condominio?: number | null;
  anoConstrucao?: number | null;
  disponivelEm?: string | null;
};

type Props = { imovel: Imovel };

export default function InfoTab({ imovel }: Props) {

  const get = (v?: string | number | null) =>
    v === null || v === undefined || String(v).trim() === "" ? "-" : String(v);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
      <div>
        <Field
          k="ENDEREÇO"
          v={get(imovel.end ?? imovel.endereco)}
        />
        <Field k="BAIRRO" v={get(imovel.bairro)} />
        <Field k="UF" v={get(imovel.uf)} />
        <Field k="SITUAÇÃO" v={get(imovel.situacao)} />
        <Field k="OBSERVAÇÕES" v={get(imovel.obs)} full />
      </div>

      <div>
        <Field k="NÚMERO" v={get(imovel.numero)} />
        <Field k="CIDADE" v={get(imovel.cidade)} />
        <Field k="CEP" v={get(imovel.cep)} />
        <Field k="FINALIDADE" v={get(imovel.finalidade)} />
        <Field k="TIPO" v={get(imovel.tipo)} />
      </div>
    </div>
  );
}

function Field({
  k,
  v,
  full = false,
}: {
  k: string;
  v: string | React.ReactNode
  full?: boolean;
}) {
  return (
    <div style={{ marginBottom: 22, gridColumn: full ? "1 / -1" : undefined }}>
      <div style={{ fontSize: 12, color: "#64748b" }}>{k}</div>
      <div style={{ marginTop: 6, fontSize: 15.5 }}>{v}</div>
    </div>
  );
}
