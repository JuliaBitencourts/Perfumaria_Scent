
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Produto } from '../../models/produtos';
import { ProdutoService } from '../../services/produtos.service';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crud.html',
  styleUrl: './crud.css'
})
export class Crud implements OnInit {

  nomeAdministrador: string = '';

  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];

  busca: string = '';
  categoriaSelecionada: string = '';
  statusSelecionado: string = '';

  produtoSelecionado: Produto | null = null;

  produtoNovo: boolean = false;

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtoService.listar().subscribe({
      next: (dados) => {
        this.produtos = dados;
        this.filtrarProdutos();
      },
      error: (erro) => {
        console.error('Erro ao carregar produtos:', erro);
        alert('Não foi possível carregar os produtos. Verifique se a API está ligada.');
      }
    });
  }

  definirStatus(estoque: number): string {
    if (estoque === 0) {
      return 'esgotado';
    }

    if (estoque <= 10) {
      return 'estoque-baixo';
    }

    return 'ativo';
  }

  filtrarProdutos(): void {
    this.produtosFiltrados = this.produtos.filter(produto => {

      const correspondeBusca =
        produto.nome.toLowerCase().includes(this.busca.toLowerCase());

      const correspondeCategoria =
        !this.categoriaSelecionada ||
        produto.categoria === this.categoriaSelecionada;

      const correspondeStatus =
        !this.statusSelecionado ||
        produto.status === this.statusSelecionado;

      return correspondeBusca &&
             correspondeCategoria &&
             correspondeStatus;
    });
  }

  alterarProduto(produto: Produto): void {
    this.produtoSelecionado = { ...produto };
    this.produtoNovo = false;
  }

  salvarAlteracao(): void {

    if (!this.produtoSelecionado) {
      return;
    }

    if (!this.produtoSelecionado.nome.trim()) {
      alert('Informe o nome do produto.');
      return;
    }

    this.produtoSelecionado.status =
      this.definirStatus(this.produtoSelecionado.estoque);

    if (this.produtoNovo) {

      const novoProduto = { ...this.produtoSelecionado };
      delete novoProduto.id;

      this.produtoService.cadastrar(novoProduto).subscribe({
        next: () => {
          alert('Produto cadastrado com sucesso!');
          this.produtoSelecionado = null;
          this.produtoNovo = false;
          this.carregarProdutos();
        },
        error: (erro) => {
          console.error(erro);
          alert('Erro ao cadastrar produto.');
        }
      });

    } else {

      if (this.produtoSelecionado.id === undefined) {
        return;
      }

      this.produtoService.atualizar(this.produtoSelecionado.id, this.produtoSelecionado).subscribe({
        next: () => {
          alert('Produto alterado com sucesso!');
          this.produtoSelecionado = null;
          this.carregarProdutos();
        },
        error: (erro) => {
          console.error(erro);
          alert('Erro ao alterar produto.');
        }
      });
    }
  }

  excluirProduto(id: number | string | undefined): void {
  if (id === undefined) {
    alert('ID do produto não encontrado.');
    return;
  }

  const idNumerico = Number(id);

  const confirmar = confirm('Deseja realmente excluir este produto?');

  if (!confirmar) return;

  this.produtoService.excluir(id).subscribe({
    next: () => {
      if (this.produtoSelecionado?.id == id) {
        this.produtoSelecionado = null;
      }

      this.carregarProdutos();
      alert('Produto excluído com sucesso!');
    },
    error: (erro) => {
      console.error('Erro ao excluir produto:', erro);
      alert('Erro ao excluir produto.');
    }
  });
}

  novoProduto(): void {

    const novo: Produto = {
      nome: '',
      categoria: 'perfume',
      preco: 0,
      estoque: 0,
      status: 'esgotado',
      volume: ''
    };

    this.produtoSelecionado = novo;
    this.produtoNovo = true;
  }

  get produtosAtivos(): number {
    return this.produtos.filter(
      produto => produto.status === 'ativo'
    ).length;
  }

  get estoqueBaixo(): number {
    return this.produtos.filter(
      produto => produto.status === 'estoque-baixo'
    ).length;
  }

  get esgotados(): number {
    return this.produtos.filter(
      produto => produto.status === 'esgotado'
    ).length;
  }

  get valorEstoque(): number {
    return this.produtos.reduce(
      (total, produto) =>
        total + (produto.preco * produto.estoque),
      0
    );
  }
}
