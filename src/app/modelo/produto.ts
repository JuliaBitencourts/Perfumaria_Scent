export interface Produto {
  id?: string;          // o json-server gera na inclusão
  nome: string;
  categoria: string;    // Feminino | Masculino | Unissex
  preco: number;
  volume: string;
  estoque: number;
  status: string;       // ativo | estoque-baixo | esgotado
  imagem?: string;      // caminho relativo, ex: imagens/cedro08.png
  secao?: string;       // lancamentos | perfumes (seção da Home)
}

// Regra única de status, usada no CRUD e ao finalizar um pedido
export function calcularStatus(estoque: number): string {
  if (estoque <= 0) {
    return 'esgotado';
  }
  if (estoque <= 10) {
    return 'estoque-baixo';
  }
  return 'ativo';
}
