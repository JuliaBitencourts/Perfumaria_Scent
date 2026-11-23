import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Produto } from '../../../modelo/produto';
import { ProdutoService } from '../../../service/produto';
import { CarrinhoService } from '../../../service/carrinho.service';

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

  private carrinhoService = inject(CarrinhoService);
  private cdr = inject(ChangeDetectorRef);

  constructor(private produtoService: ProdutoService) {}

  ngOnInit() {
    this.produtoService.listar().subscribe({
      next: (produtos) => {
        // Caminho relativo (sem "/" no início) para funcionar no GitHub Pages
        produtos.forEach(p => p.imagem = (p.imagem ?? '').replace(/^\//, ''));
        this.lancamentos = produtos.filter(p => p.secao === 'lancamentos');
        this.perfumes = produtos.filter(p => p.secao === 'perfumes');
        this.cdr.markForCheck();   // avisa o Angular para redesenhar a tela
      },
      error: () => console.error('Não foi possível carregar os produtos. A API está rodando?'),
    });
  }

  adicionar(produto: Produto) {
    // 1) Busca o carrinho na API e procura se esse produto já está nele
    this.carrinhoService.listar().subscribe({
      next: (itens) => {
        const item = itens.find(i => i.produtoId === produto.id);

        if (item) {
          // 2a) Já está: aumenta a quantidade (PUT)
          if (item.quantidade >= item.estoque) {
            alert('Quantidade máxima em estoque atingida.');
            return;
          }
          item.quantidade++;
          this.carrinhoService.alterar(item).subscribe({
            next: () => alert(`${produto.nome} adicionado ao carrinho!`),
            error: () => alert('Erro ao salvar no carrinho.'),
          });
        } else {
          // 2b) Não está: inclui um item novo (POST)
          this.carrinhoService.incluir({
            produtoId: produto.id!,
            nome: produto.nome,
            descricao: `Eau de Parfum · ${produto.volume}`,
            preco: produto.preco,
            imagem: produto.imagem ?? '',
            estoque: produto.estoque,
            quantidade: 1,
          }).subscribe({
            next: () => alert(`${produto.nome} adicionado ao carrinho!`),
            error: () => alert('Erro ao salvar no carrinho.'),
          });
        }
      },
      error: () => alert('Erro ao adicionar ao carrinho. A API está rodando?'),
    });
  }
}
