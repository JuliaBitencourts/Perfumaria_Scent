export interface Produto {
  id?: number | string;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
  status: string;
  volume: string;
}