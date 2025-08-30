export type Proprietario = {
  id?: number;
  nome: string;
  doc: string;
  email?: string | null;
  tel?: string | null;
  obs?: string | null;
};

export type Aba = "dados" | "imoveis" | "documentos";

/** Resposta paginada do Spring (compatível com seu backend) */
export type PageResp<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
} | T[]; // o backend às vezes pode responder só com array
