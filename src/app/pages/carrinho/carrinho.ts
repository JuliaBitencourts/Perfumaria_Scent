import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { PedidoService } from '../../service/pedido.service';
import { Pedido } from '../../modelo/pedido';

import { Menu } from '../menu/menu';

@Component({
  selector: 'app-carrinho',
  imports: [RouterLink, Menu],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css',
})
export class Carrinho {
  produtos = [
    { id: 1, nome: 'Âmbar Noturno', descricao: 'Eau de Parfum · 75 ml', preco: 689, quantidade: 1, imagem: '/ambar-noturno.webp' },
    { id: 2, nome: 'Íris de Seda', descricao: 'Eau de Parfum · 50 ml', preco: 579, quantidade: 1, imagem: '/Produto.png' },
  ];

  excluir(id: number) {
    this.produtos = this.produtos.filter(p => p.id !== id);
  }

  aumentar(id: number) {
    const produto = this.produtos.find(p => p.id === id);
    if (produto) produto.quantidade++;
  }

  diminuir(id: number) {
    const produto = this.produtos.find(p => p.id === id);
    if (produto && produto.quantidade > 1) produto.quantidade--;
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

  private pedidoService = inject(PedidoService);
  private router = inject(Router);

  finalizarCompra() {
    if (this.produtos.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    const pedido: Pedido = {
      itens: this.produtos.map(p => ({
        produtoId: String(p.id),
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
        alert(`Pedido ${salvo.id} finalizado com sucesso!`);
        this.produtos = [];
        this.router.navigate(['/']);
      },
      error: () => alert('Erro ao finalizar o pedido.'),
    });
  }
}