import { Injectable } from '@angular/core';
import { Produto } from '../modelo/produto';

export interface ItemCarrinho {
  produtoId: string;  // id do PRODUTO (identifica o item no carrinho)
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  estoque: number;
  quantidade: number;
}

// O carrinho fica guardado no NAVEGADOR (localStorage), e não na API.
// Assim, nada é gravado no db.json enquanto o cliente monta a compra:
// a API só recebe o pedido quando ele clica em "Finalizar compra".
// O localStorage mantém o carrinho mesmo se a página for recarregada.
@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private readonly CHAVE = 'scent-carrinho';

  // Consulta: itens do carrinho
  listar(): ItemCarrinho[] {
    try {
      const salvo = localStorage.getItem(this.CHAVE);
      return salvo ? JSON.parse(salvo) : [];
    } catch {
      return [];
    }
  }

  // Inclusão: adiciona o produto ou soma 1 na quantidade se ele já estiver no carrinho.
  // Retorna false quando não há mais estoque para adicionar.
  adicionar(produto: Produto): boolean {
    const itens = this.listar();
    const item = itens.find(i => i.produtoId === produto.id);

    if (item) {
      if (item.quantidade >= item.estoque) {
        return false;
      }
      item.quantidade++;
    } else {
      if (produto.estoque <= 0) {
        return false;
      }
      itens.push({
        produtoId: produto.id!,
        nome: produto.nome,
        descricao: `Eau de Parfum · ${produto.volume}`,
        preco: produto.preco,
        imagem: produto.imagem ?? '',
        estoque: produto.estoque,
        quantidade: 1,
      });
    }

    this.salvar(itens);
    return true;
  }

  // Alteração: muda a quantidade de um item
  alterarQuantidade(produtoId: string, quantidade: number): void {
    const itens = this.listar();
    const item = itens.find(i => i.produtoId === produtoId);
    if (item) {
      item.quantidade = quantidade;
      this.salvar(itens);
    }
  }

  // Exclusão: tira um item do carrinho
  remover(produtoId: string): void {
    this.salvar(this.listar().filter(i => i.produtoId !== produtoId));
  }

  // Esvazia o carrinho (depois de finalizar a compra)
  limpar(): void {
    this.salvar([]);
  }

  private salvar(itens: ItemCarrinho[]): void {
    try {
      localStorage.setItem(this.CHAVE, JSON.stringify(itens));
    } catch {
      // Navegador sem acesso ao localStorage: o carrinho vale só até recarregar a página
    }
  }
}
