import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Produto, calcularStatus } from '../../modelo/produto';
import { ProdutoService } from '../../service/produto';
import { SessaoService } from '../../service/sessao.service';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [DecimalPipe, FormsModule, RouterLink],
  templateUrl: './crud.html',
  styleUrl: './crud.css'
})
export class Crud implements OnInit {
  private produtoService = inject(ProdutoService);
  private sessao = inject(SessaoService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  nomeAdministrador = '';

  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];

  busca = '';
  categoriaSelecionada = '';
  statusSelecionado = '';

  // Mesmos valores usados no db.json
  categorias = ['Feminino', 'Masculino', 'Unissex'];

  produtoSelecionado: Produto | null = null;
  produtoNovo = false;

  ngOnInit(): void {
    // Área administrativa: só entra quem fez login como administrador
    if (!this.sessao.ehAdmin) {
      this.router.navigate(['/pessoas/login']);
      return;
    }

    this.nomeAdministrador = this.sessao.usuario?.nome ?? '';
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtoService.listar().subscribe({
      next: (dados) => {
        this.produtos = dados;
        this.filtrarProdutos();
        this.cdr.markForCheck();   // avisa o Angular para redesenhar a tela
      },
      error: (erro) => {
        console.error('Erro ao carregar produtos:', erro);
        alert('Não foi possível carregar os produtos. Verifique se a API está ligada.');
      }
    });
  }

  filtrarProdutos(): void {
    const texto = this.busca.toLowerCase();

    this.produtosFiltrados = this.produtos.filter(produto => {
      const correspondeBusca = produto.nome.toLowerCase().includes(texto);

      const correspondeCategoria =
        !this.categoriaSelecionada ||
        produto.categoria === this.categoriaSelecionada;

      const correspondeStatus =
        !this.statusSelecionado ||
        produto.status === this.statusSelecionado;

      return correspondeBusca && correspondeCategoria && correspondeStatus;
    });
  }

  alterarProduto(produto: Produto): void {
    this.produtoSelecionado = { ...produto };
    this.produtoNovo = false;
  }

  novoProduto(): void {
    this.produtoSelecionado = {
      nome: '',
      categoria: 'Unissex',
      preco: 0,
      estoque: 0,
      status: 'esgotado',
      volume: '',
      imagem: '',
      secao: ''
    };
    this.produtoNovo = true;
  }

  cancelar(): void {
    this.produtoSelecionado = null;
    this.produtoNovo = false;
  }

  salvarAlteracao(): void {
    const produto = this.produtoSelecionado;

    if (!produto) {
      return;
    }

    if (!produto.nome.trim()) {
      alert('Informe o nome do produto.');
      return;
    }

    if (produto.preco < 0 || produto.estoque < 0) {
      alert('Preço e estoque não podem ser negativos.');
      return;
    }

    produto.status = calcularStatus(produto.estoque);

    if (this.produtoNovo) {
      const novoProduto = { ...produto };
      delete novoProduto.id;

      this.produtoService.incluir(novoProduto).subscribe({
        next: () => {
          this.cancelar();
          this.carregarProdutos();
          alert('Produto cadastrado com sucesso!');
        },
        error: (erro) => {
          console.error(erro);
          alert('Erro ao cadastrar produto.');
        }
      });
    } else {
      this.produtoService.editar(produto).subscribe({
        next: () => {
          this.cancelar();
          this.carregarProdutos();
          alert('Produto alterado com sucesso!');
        },
        error: (erro) => {
          console.error(erro);
          alert('Erro ao alterar produto.');
        }
      });
    }
  }

  excluirProduto(id: string | undefined): void {
    if (!id || !confirm('Deseja realmente excluir este produto?')) {
      return;
    }

    this.produtoService.excluir(id).subscribe({
      next: () => {
        if (this.produtoSelecionado?.id === id) {
          this.cancelar();
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

  sair(): void {
    this.sessao.sair();
    this.router.navigate(['/']);
  }

  get produtosAtivos(): number {
    return this.produtos.filter(produto => produto.status === 'ativo').length;
  }

  get estoqueBaixo(): number {
    return this.produtos.filter(produto => produto.status === 'estoque-baixo').length;
  }

  get esgotados(): number {
    return this.produtos.filter(produto => produto.status === 'esgotado').length;
  }

  get valorEstoque(): number {
    return this.produtos.reduce(
      (total, produto) => total + (produto.preco * produto.estoque),
      0
    );
  }
}
