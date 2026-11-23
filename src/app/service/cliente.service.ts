import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../modelo/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private readonly API = 'http://localhost:3000/clientes';

  constructor(private http: HttpClient) { }

  // GET: consulta
  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.API);
  }

  // GET com filtro: busca só os clientes com esse e-mail (login e cadastro)
  buscarPorEmail(email: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.API, { params: { email } });
  }

  // POST: inclusão
  cadastrar(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.API, cliente);
  }

  // PUT: alteração
  editar(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.API}/${cliente.id}`, cliente);
  }

  // DELETE: exclusão
  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
