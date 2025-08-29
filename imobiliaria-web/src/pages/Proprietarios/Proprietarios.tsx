import { useMemo, useState } from "react";

/**
 * Usa VITE_API_URL se existir, senão fallback para http://localhost:8080
 * Ex.: crie um .env.development com VITE_API_URL=http://localhost:8080
 */
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

type ProprietarioForm = {
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  celular: string;
  dataNascimento: string; // yyyy-mm-dd
  estadoCivil: string;
  nacionalidade: string;
  profissao: string;
  rendaMensal: number | "";
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  obs: string;
  // campos que normalmente o backend calcula: created_at/updated_at/etc - NÃO vão no form
};

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFrom<T>(arr: T[]) { return arr[randInt(0, arr.length - 1)]; }

function randomCPF(): string {
  const n = Array.from({ length: 9 }, () => randInt(0, 9));
  const d1 =
    ((n[0]*10+n[1]*9+n[2]*8+n[3]*7+n[4]*6+n[5]*5+n[6]*4+n[7]*3+n[8]*2) % 11);
  const dv1 = d1 < 2 ? 0 : 11 - d1;
  const d2 =
    ((n[0]*11+n[1]*10+n[2]*9+n[3]*8+n[4]*7+n[5]*6+n[6]*5+n[7]*4+n[8]*3+dv1*2) % 11);
  const dv2 = d2 < 2 ? 0 : 11 - d2;
  const digits = [...n, dv1, dv2].join("");
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function randomCNPJ(): string {
  const n = Array.from({ length: 12 }, () => randInt(0, 9));
  const w1 = [5,4,3,2,9,8,7,6,5,4,3,2];
  const w2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];
  const d1 = (n.reduce((s, v, i) => s + v * w1[i], 0) % 11);
  const dv1 = d1 < 2 ? 0 : 11 - d1;
  const d2 = ((n.concat(dv1)).reduce((s, v, i) => s + v * w2[i], 0) % 11);
  const dv2 = d2 < 2 ? 0 : 11 - d2;
  const digits = [...n, dv1, dv2].join("");
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

function randomPhone() {
  // (11) 9 8XXX-XXXX
  const ddd = randFrom([11,12,13,19,21,31,41,47,48,61,62,67,71,81,85,98]);
  const first = randFrom([8,9]);
  const rest = randInt(1000, 9999).toString().padStart(4, "0") + "-" + randInt(1000, 9999).toString().padStart(4, "0");
  return `(${ddd}) ${first}${randInt(0,9)}${randInt(0,9)}${randInt(0,9)}-${rest.split("-")[1]}`;
}

function randomCEP() {
  return `${randInt(10000, 99999)}-${randInt(100, 999)}`;
}

function randomNome() {
  const nomes = ["Ana","Breno","Carlos","Daniela","Eduarda","Felipe","Gustavo","Helena","Igor","Júlia","Kauã","Luiza","Marcos","Nathalia","Otávio","Paula","Rafaela","Samuel","Talita","Vitor"];
  const sobrenomes = ["Silva","Souza","Oliveira","Pereira","Lima","Gomes","Costa","Ribeiro","Almeida","Nogueira","Melo","Sales","Carvalho","Barbosa"];
  return `${randFrom(nomes)} ${randFrom(sobrenomes)}`;
}

function randomEmail(nome: string) {
  const slug = nome.toLowerCase().replace(/\s+/g, ".");
  const dom = randFrom(["gmail.com","outlook.com","hotmail.com","yahoo.com.br"]);
  return `${slug}${randInt(1,9999)}@${dom}`;
}

const ESTADOS_CIVIS = ["solteiro(a)","casado(a)","divorciado(a)","viúvo(a)","união estável"];
const PROFISSOES = ["Analista", "Arquiteto", "Advogado", "Engenheiro", "Professor", "Vendedor", "Designer", "Empresário"];

export default function ProprietariosPage() {
  const [form, setForm] = useState<ProprietarioForm>({
    nome: "",
    cpfCnpj: "",
    email: "",
    telefone: "",
    celular: "",
    dataNascimento: "",
    estadoCivil: "",
    nacionalidade: "brasileira",
    profissao: "",
    rendaMensal: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    obs: "",
  });

  const isPJ = useMemo(() => (form.cpfCnpj.replace(/\D/g, "").length > 11), [form.cpfCnpj]);

  function set<K extends keyof ProprietarioForm>(key: K, value: ProprietarioForm[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function randomizeAll() {
    const nome = randomNome();
    const cnpjMode = Math.random() < 0.35;

    const cidade = randFrom(["São Paulo","Rio de Janeiro","Belo Horizonte","Curitiba","Florianópolis","Porto Alegre","Salvador","Recife","Fortaleza","Goiânia"]);
    const estado = randFrom(ESTADOS);

    setForm({
      nome,
      cpfCnpj: cnpjMode ? randomCNPJ() : randomCPF(),
      email: randomEmail(nome),
      telefone: randomPhone(),
      celular: randomPhone(),
      dataNascimento: `${randInt(1965, 2005)}-${String(randInt(1,12)).padStart(2,"0")}-${String(randInt(1,28)).padStart(2,"0")}`,
      estadoCivil: randFrom(ESTADOS_CIVIS),
      nacionalidade: "brasileira",
      profissao: randFrom(PROFISSOES),
      rendaMensal: randInt(2500, 18000),
      cep: randomCEP(),
      logradouro: randFrom(["Rua das Flores","Av. Paulista","Rua XV de Novembro","Rua das Acácias","Rua do Sol","Rua Projetada"]),
      numero: String(randInt(10, 9999)),
      complemento: Math.random() < 0.5 ? "" : `Ap ${randInt(1, 120)}`,
      bairro: randFrom(["Centro","Jardins","Boa Vista","Copacabana","Jardim América","Glória","Estreito","São João"]),
      cidade,
      estado,
      obs: Math.random() < 0.4 ? "Cliente indicado por parceiro." : "",
    });
  }

  async function salvar() {
    try {
      // Monte o payload exatamente como o backend espera:
      const payload = {
        nome: form.nome,
        cpfCnpj: form.cpfCnpj.replace(/\D/g, ""),
        email: form.email,
        telefone: form.telefone,
        celular: form.celular,
        dataNascimento: form.dataNascimento || null,
        estadoCivil: form.estadoCivil || null,
        nacionalidade: form.nacionalidade || null,
        profissao: form.profissao || null,
        rendaMensal: form.rendaMensal === "" ? null : Number(form.rendaMensal),
        endereco: {
          cep: form.cep.replace(/\D/g, ""),
          logradouro: form.logradouro,
          numero: form.numero,
          complemento: form.complemento || null,
          bairro: form.bairro,
          cidade: form.cidade,
          estado: form.estado,
        },
        obs: form.obs || null,
      };

      const res = await fetch(`${API_BASE}/proprietarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // se usa cookie de auth
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const data = await res.json().catch(() => ({}));
      alert("Proprietário salvo com sucesso! 🎉\n\n" + JSON.stringify(data, null, 2));
    } catch (err: any) {
      console.error(err);
      alert("Falha ao salvar proprietário: " + (err?.message ?? "erro desconhecido"));
    }
  }

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Cadastro de Proprietários</h1>
        <div className="flex gap-2">
          <button
            onClick={randomizeAll}
            className="rounded-xl px-4 py-2 border hover:bg-gray-50 transition"
            title="Preencher tudo com dados de teste"
          >
            Randomizar tudo
          </button>
          <button
            onClick={salvar}
            className="rounded-xl px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Salvar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-2xl border p-4">
          <h2 className="font-medium mb-3">Dados pessoais</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Nome completo</label>
              <input className="w-full border rounded-xl px-3 py-2"
                     value={form.nome} onChange={e=>set("nome", e.target.value)} />
            </div>

            <div>
              <label className="text-sm">CPF/CNPJ</label>
              <input className="w-full border rounded-xl px-3 py-2"
                     value={form.cpfCnpj} onChange={e=>set("cpfCnpj", e.target.value)} />
              <p className="text-xs text-gray-500 mt-1">{isPJ ? "Pessoa Jurídica" : "Pessoa Física"}</p>
            </div>

            <div>
              <label className="text-sm">E-mail</label>
              <input className="w-full border rounded-xl px-3 py-2"
                     type="email" value={form.email} onChange={e=>set("email", e.target.value)} />
            </div>

            <div>
              <label className="text-sm">Telefone</label>
              <input className="w-full border rounded-xl px-3 py-2"
                     value={form.telefone} onChange={e=>set("telefone", e.target.value)} />
            </div>

            <div>
              <label className="text-sm">Celular</label>
              <input className="w-full border rounded-xl px-3 py-2"
                     value={form.celular} onChange={e=>set("celular", e.target.value)} />
            </div>

            <div>
              <label className="text-sm">Data de nascimento</label>
              <input className="w-full border rounded-xl px-3 py-2"
                     type="date" value={form.dataNascimento}
                     onChange={e=>set("dataNascimento", e.target.value)} />
            </div>

            <div>
              <label className="text-sm">Estado civil</label>
              <select className="w-full border rounded-xl px-3 py-2"
                      value={form.estadoCivil} onChange={e=>set("estadoCivil", e.target.value)}>
                <option value="">—</option>
                {ESTADOS_CIVIS.map(ec => <option key={ec} value={ec}>{ec}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm">Nacionalidade</label>
              <input className="w-full border rounded-xl px-3 py-2"
                     value={form.nacionalidade} onChange={e=>set("nacionalidade", e.target.value)} />
            </div>

            <div>
              <label className="text-sm">Profissão</label>
              <input className="w-full border rounded-xl px-3 py-2"
                     value={form.profissao} onChange={e=>set("profissao", e.target.value)} />
            </div>

            <div>
              <label className="text-sm">Renda mensal (R$)</label>
              <input className="w-full border rounded-xl px-3 py-2"
                     type="number" min={0} step="100"
                     value={form.rendaMensal === "" ? "" : form.rendaMensal}
                     onChange={e=>set("rendaMensal", e.target.value === "" ? "" : Number(e.target.value))} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border p-4">
          <h2 className="font-medium mb-3">Endereço</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm">CEP</label>
              <input className="w-full border rounded-xl px-3 py-2"
                     value={form.cep} onChange={e=>set("cep", e.target.value)} />
            </div>

            <div>
              <label className="text-sm">Logradouro</label>
              <input className="w-full border rounded-xl px-3 py-2"
                     value={form.logradouro} onChange={e=>set("logradouro", e.target.value)} />
            </div>

            <div>
              <label className="text-sm">Número</label>
              <input className="w-full border rounded-xl px-3 py-2"
                     value={form.numero} onChange={e=>set("numero", e.target.value)} />
            </div>

            <div>
              <label className="text-sm">Complemento</label>
              <input className="w-full border rounded-xl px-3 py-2"
                     value={form.complemento} onChange={e=>set("complemento", e.target.value)} />
            </div>

            <div>
              <label className="text-sm">Bairro</label>
              <input className="w-full border rounded-xl px-3 py-2"
                     value={form.bairro} onChange={e=>set("bairro", e.target.value)} />
            </div>

            <div>
              <label className="text-sm">Cidade</label>
              <input className="w-full border rounded-xl px-3 py-2"
                     value={form.cidade} onChange={e=>set("cidade", e.target.value)} />
            </div>

            <div>
              <label className="text-sm">Estado (UF)</label>
              <select className="w-full border rounded-xl px-3 py-2"
                      value={form.estado} onChange={e=>set("estado", e.target.value)}>
                <option value="">—</option>
                {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label className="text-sm">Observações</label>
            <textarea className="w-full border rounded-xl px-3 py-2"
                      rows={4} value={form.obs} onChange={e=>set("obs", e.target.value)} />
          </div>
        </section>
      </div>
    </div>
  );
}
