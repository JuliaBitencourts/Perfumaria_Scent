import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from '../../service/pedido.service';
import { CarrinhoService, ItemCarrinho } from '../../service/carrinho.service';
import { Pedido } from '../../modelo/pedido';

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
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  produtos: ItemCarrinho[] = [];

  // Ao abrir a página, busca os itens na API (GET)
  ngOnInit() {
    this.carrinhoService.listar().subscribe({
      next: (itens) => {
        this.produtos = itens;
        this.cdr.markForCheck();   // avisa o Angular para redesenhar a tela
      },
      error: () => alert('Erro ao carregar o carrinho.'),
    });
  }

  aumentar(item: ItemCarrinho) {
    if (item.quantidade >= item.estoque) return;
    item.quantidade++;
    this.carrinhoService.alterar(item).subscribe();   // PUT
  }

  diminuir(item: ItemCarrinho) {
    if (item.quantidade <= 1) return;
    item.quantidade--;
    this.carrinhoService.alterar(item).subscribe();   // PUT
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
        // Pedido salvo: esvazia o carrinho na API (DELETE de cada item)
        this.produtos.forEach(p => this.carrinhoService.excluir(p.id!).subscribe());
        this.produtos = [];
        alert(`Pedido ${salvo.id} finalizado com sucesso!`);
        this.router.navigate(['/']);
      },
      error: () => alert('Erro ao finalizar o pedido.'),
    });
  }
}