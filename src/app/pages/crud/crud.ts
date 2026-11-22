import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
  status: string;
  volume: string;
}

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crud.html',
  styleUrl: './crud.css'
})

export class Crud {

   nomeAdministrador: string = '';

  produtos: Produto[] = [

    {
      id: 1,
      nome: 'Fragrância Saint',
      categoria: 'perfume',
      preco: 199.90,
      estoque: 25,
      status: 'ativo',
      volume: '100 ml'
    },

    {
      id: 2,
      nome: 'Essência Floral',
      categoria: 'colonia',
      preco: 149.90,
      estoque: 8,
      status: 'estoque-baixo',
      volume: '100 ml'
    },

    {
      id: 3,
      nome: 'Íris de Seda',
      categoria: 'perfume',
      preco: 579.00,
      estoque: 0,
      status: 'esgotado',
      volume: '100 ml'
    }

  ];


  produtosFiltrados: Produto[] = [];

  busca: string = '';
  categoriaSelecionada: string = '';
  statusSelecionado: string = '';

  produtoSelecionado: Produto | null = null;


  constructor() {
    this.produtosFiltrados = [...this.produtos];
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
        produto.nome
          .toLowerCase()
          .includes(this.busca.toLowerCase());

      const correspondeCategoria =
        !this.categoriaSelecionada ||
        produto.categoria === this.categoriaSelecionada;

      const correspondeStatus =
        !this.statusSelecionado ||
        produto.status === this.statusSelecionado;

      return (
        correspondeBusca &&
        correspondeCategoria &&
        correspondeStatus
      );

    });

  }


  alterarProduto(produto: Produto): void {

    this.produtoSelecionado = {
      ...produto
    };

  }

  salvarAlteracao(): void {

    if (!this.produtoSelecionado) {
      return;
    }

    this.produtoSelecionado.status =
      this.definirStatus(
        this.produtoSelecionado.estoque
      );


    const index = this.produtos.findIndex(
      produto =>
        produto.id === this.produtoSelecionado!.id
    );


    if (index !== -1) {

      this.produtos[index] = {
        ...this.produtoSelecionado
      };

      this.filtrarProdutos();

      alert('Produto alterado com sucesso!');

    }

  }

  excluirProduto(id: number): void {

    const confirmar = confirm(
      'Deseja realmente excluir este produto?'
    );


    if (!confirmar) {
      return;
    }


    this.produtos = this.produtos.filter(
      produto => produto.id !== id
    );

    if (this.produtoSelecionado?.id === id) {
      this.produtoSelecionado = null;
    }


    this.filtrarProdutos();

  }

  novoProduto(): void {

    const novo: Produto = {

      id: this.gerarNovoId(),

      nome: 'Novo Produto',

      categoria: 'perfume',

      preco: 0,

      estoque: 0,

      status: 'esgotado',

      volume: ''

    };


    this.produtos.push(novo);


    this.produtoSelecionado = {
      ...novo
    };


    this.filtrarProdutos();

  }


  gerarNovoId(): number {

    if (this.produtos.length === 0) {
      return 1;
    }


    return Math.max(
      ...this.produtos.map(
        produto => produto.id
      )
    ) + 1;

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