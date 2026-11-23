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
    // O carrinho fica no navegador: nada é gravado na API aqui.
    // A API só recebe o pedido quando o cliente finaliza a compra.
    if (this.carrinhoService.adicionar(produto)) {
      alert(`${produto.nome} adicionado ao carrinho!`);
    } else {
      alert('Quantidade máxima em estoque atingida.');
    }
  }
}
