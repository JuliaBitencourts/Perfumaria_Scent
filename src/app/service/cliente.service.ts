import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../modelo/cliente';

@Injectable({
 providedIn: 'root'
})
export class ClienteService {

 private API = 'http://localhost:3000/clientes';

 constructor(private http: HttpClient) { }

listar(): Observable<Cliente[]> {
 return this.http.get<Cliente[]>(this.API);
 }

cadastrar(cliente: Cliente): Observable<Cliente> {
return this.http.post<Cliente>(this.API, cliente);
 }

editar(cliente: Cliente): Observable<Cliente> {
 return this.http.put<Cliente>(this.API + '/' + cliente.id, cliente);
 }
 excluir(id: string): Observable<any> {
  return this.http.delete(this.API + '/' + id);
}

}