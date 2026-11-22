export interface ItemPedido {
  produtoId: string;
  nome: string;
  preco: number;
  quantidade: number;
}

export interface Pedido {
  id?: string;          // o json-server gera
  clienteId?: string;   // id do cliente logado
  itens: ItemPedido[];
  subtotal: number;
  frete: number;
  total: number;
  data: string;
}