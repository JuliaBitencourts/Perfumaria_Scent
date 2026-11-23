import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../modelo/produto';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private readonly API = 'http://localhost:3000/produtos';

  constructor(private http: HttpClient) {}

  // GET: consulta
  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.API);
  }

  buscarPorId(id: string): Observable<Produto> {
    return this.http.get<Produto>(`${this.API}/${id}`);
  }

  // POST: inclusão
  incluir(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.API, produto);
  }

  // PUT: alteração
  editar(produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.API}/${produto.id}`, produto);
  }

  // DELETE: exclusão
  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
