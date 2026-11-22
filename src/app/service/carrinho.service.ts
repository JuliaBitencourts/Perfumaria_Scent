import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ItemCarrinho {
  id?: string;        // gerado pelo json-server (id do ITEM no carrinho)
  produtoId: string;  // id do PRODUTO (para saber se já está no carrinho)
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  estoque: number;
  quantidade: number;
}

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private readonly API = 'http://localhost:3000/carrinho';

  constructor(private http: HttpClient) {}

  // GET: todos os itens do carrinho
  listar(): Observable<ItemCarrinho[]> {
    return this.http.get<ItemCarrinho[]>(this.API);
  }

  // POST: inclusão
  incluir(item: ItemCarrinho): Observable<ItemCarrinho> {
    return this.http.post<ItemCarrinho>(this.API, item);
  }

  // PUT: alteração (usada para mudar a quantidade)
  alterar(item: ItemCarrinho): Observable<ItemCarrinho> {
    return this.http.put<ItemCarrinho>(`${this.API}/${item.id}`, item);
  }

  // DELETE: exclusão
  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}