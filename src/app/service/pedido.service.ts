import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../modelo/pedido';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly API = 'http://localhost:3000/pedidos';
  constructor(private http: HttpClient) {}

  incluir(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.API, pedido);   // POST = inclusão
  }

  listar(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.API);
  }
}