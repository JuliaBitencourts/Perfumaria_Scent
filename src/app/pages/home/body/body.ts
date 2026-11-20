import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Produto } from '../../../modelo/produto';
import { ProdutoService } from '../../../service/produto';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './body.css',
  templateUrl: './body.html',
})
export class Body implements OnInit {
  lancamentos: Produto[] = [];
  perfumes: Produto[] = [];

  constructor(private produtoService: ProdutoService) {}

  ngOnInit() {
    this.produtoService.listar().subscribe(produtos => {
      this.lancamentos = produtos.filter(p => p.secao === 'lancamentos');
      this.perfumes = produtos.filter(p => p.secao === 'perfumes');
    });
  }

  // Ponto de ligação com o carrinho (a ser implementado por quem faz essa parte)
  adicionar(produto: Produto) {}
}