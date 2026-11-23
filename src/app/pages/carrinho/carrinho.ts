import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from '../../service/pedido.service';
import { CarrinhoService, ItemCarrinho } from '../../service/carrinho.service';
import { Pedido } from '../../modelo/pedido';
import { Observable, concat, switchMap } from 'rxjs';
import { Produto, calcularStatus } from '../../modelo/produto';
import { ProdutoService } from '../../service/produto';
import { SessaoService } from '../../service/sessao.service';

import { Menu } from '../menu/menu';

@Component({
  selector: 'app-carrinho',
  imports: [Menu],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css',
})
export class Carrinho implements OnInit {
  private carrinhoService = inject(CarrinhoService);
  private pedidoService = inject(PedidoService);
  private produtoService = inject(ProdutoService);
  private sessao = inject(SessaoService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  produtos: ItemCarrinho[] = [];

  // Ao abrir a página, busca os itens na API (GET)
  ngOnInit() {
    this.carrinhoService.listar().subscribe({
      next: (itens) => {
        // Caminho relativo (sem "/" no início) para funcionar no GitHub Pages
        itens.forEach(i => i.imagem = i.imagem.replace(/^\//, ''));
        this.produtos = itens;
        this.cdr.markForCheck();   // avisa o Angular para redesenhar a tela
      },
      error: () => alert('Erro ao carregar o carrinho.'),
    });
  }

  aumentar(item: ItemCarrinho) {
    if (item.quantidade >= item.estoque) return;
    this.mudarQuantidade(item, +1);
  }

  diminuir(item: ItemCarrinho) {
    if (item.quantidade <= 1) return;
    this.mudarQuantidade(item, -1);
  }

  // PUT: altera a quantidade; se a API falhar, volta ao valor anterior
  private mudarQuantidade(item: ItemCarrinho, delta: number) {
    item.quantidade += delta;
    this.carrinhoService.alterar(item).subscribe({
      error: () => {
        item.quantidade -= delta;
        this.cdr.markForCheck();
        alert('Erro ao alterar a quantidade.');
      },
    });
  }

  excluir(item: ItemCarrinho) {
    this.carrinhoService.excluir(item.id!).subscribe({   // DELETE
      next: () => {
        this.produtos = this.produtos.filter(p => p.id !== item.id);
        this.cdr.markForCheck();
      },
    });
  }

  get subtotal(): number {
    return this.produtos.reduce((soma, p) => soma + p.preco * p.quantidade, 0);
  }

  get frete(): number {
    return this.produtos.length > 0 ? 24.9 : 0;
  }

  get total(): number {
    return this.subtotal + this.frete;
  }

  get parcela(): number {
    return this.total / 6;
  }

  formatar(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  finalizarCompra() {
    if (this.produtos.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    const pedido: Pedido = {
      clienteId: this.sessao.usuario?.id,   // cliente logado (se houver)
      itens: this.produtos.map(p => ({
        produtoId: p.produtoId,
        nome: p.nome,
        preco: p.preco,
        quantidade: p.quantidade,
      })),
      subtotal: this.subtotal,
      frete: this.frete,
      total: this.total,
      data: new Date().toISOString(),
    };

    this.pedidoService.incluir(pedido).subscribe({
      next: (salvo) => {
        // Pedido salvo: para cada item, baixa o estoque e tira do carrinho (DELETE).
        // O concat executa UMA chamada por vez: o json-server grava tudo no mesmo
        // db.json, e gravações simultâneas podiam desfazer umas às outras.
        const operacoes = this.produtos.flatMap(p => [
          this.baixarEstoque(p.produtoId, p.quantidade),
          this.carrinhoService.excluir(p.id!),
        ]);

        concat(...operacoes).subscribe({
          complete: () => {
            this.produtos = [];
            alert(`Pedido ${salvo.id} finalizado com sucesso!`);
            this.router.navigate(['/']);
          },
          error: () => alert(`Pedido ${salvo.id} salvo, mas houve erro ao atualizar o estoque/carrinho.`),
        });
      },
      error: () => alert('Erro ao finalizar o pedido.'),
    });
  }

  // GET do produto e depois PUT com o estoque descontado (e o status recalculado)
  private baixarEstoque(produtoId: string, quantidade: number): Observable<Produto> {
    return this.produtoService.buscarPorId(produtoId).pipe(
      switchMap((produto) => {
        produto.estoque = Math.max(0, produto.estoque - quantidade);
        produto.status = calcularStatus(produto.estoque);
        return this.produtoService.editar(produto);
      })
    );
  }
}