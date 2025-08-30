/* utilitários visuais e dados fake */
export function cx(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

export function formatDoc(doc?: string | null) {
  const d = (doc ?? "").replace(/\D/g, "");
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  return doc ?? "-";
}

export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function randFrom<T>(arr: T[]) { return arr[randInt(0, arr.length - 1)]; }

export function randomCPF(): string {
  const n = Array.from({ length: 9 }, () => randInt(0, 9));
  const d1 = (n[0]*10+n[1]*9+n[2]*8+n[3]*7+n[4]*6+n[5]*5+n[6]*4+n[7]*3+n[8]*2)%11;
  const dv1 = d1 < 2 ? 0 : 11 - d1;
  const d2 = (n[0]*11+n[1]*10+n[2]*9+n[3]*8+n[4]*7+n[5]*6+n[6]*5+n[7]*4+n[8]*3+dv1*2)%11;
  const dv2 = d2 < 2 ? 0 : 11 - d2;
  return [...n, dv1, dv2].join("").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
export function randomPhone() {
  const ddd = randFrom([11,21,31,41,47,61,71,81]);
  return `(${ddd}) 9${randInt(1000,9999)}-${randInt(1000,9999)}`;
}
export function randomNome() {
  const nomes = ["Ana","Carlos","Felipe","Helena","Igor","Júlia","Marcos","Otávio","Paula","Rafaela"];
  const sobrenomes = ["Silva","Souza","Oliveira","Pereira","Lima","Gomes","Costa","Almeida"];
  return `${randFrom(nomes)} ${randFrom(sobrenomes)}`;
}
export function randomEmail(nome: string) {
  const slug = nome.toLowerCase().replace(/\s+/g, ".");
  const dom = randFrom(["gmail.com","outlook.com","hotmail.com"]);
  return `${slug}${randInt(1,9999)}@${dom}`;
}
