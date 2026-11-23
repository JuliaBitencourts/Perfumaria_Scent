import { Injectable } from '@angular/core';
import { Cliente } from '../modelo/cliente';

// Usuário logado (sem a senha)
export interface UsuarioLogado {
  id: string;
  nome: string;
  email: string;
  admin: boolean;
}

// Guarda quem está logado. "Lembrar de mim" usa o localStorage (continua
// logado ao fechar o navegador); sem ele, usa o sessionStorage (só esta aba).
@Injectable({ providedIn: 'root' })
export class SessaoService {
  static readonly EMAIL_ADMIN = 'admin@scent.com';
  private readonly CHAVE = 'scent-usuario';

  entrar(cliente: Cliente, lembrar: boolean): UsuarioLogado {
    const usuario: UsuarioLogado = {
      id: cliente.id ?? '',
      nome: cliente.nome,
      email: cliente.email,
      admin: cliente.email === SessaoService.EMAIL_ADMIN,
    };
    this.sair();
    const armazenamento = lembrar ? localStorage : sessionStorage;
    armazenamento.setItem(this.CHAVE, JSON.stringify(usuario));
    return usuario;
  }

  sair(): void {
    localStorage.removeItem(this.CHAVE);
    sessionStorage.removeItem(this.CHAVE);
  }

  get usuario(): UsuarioLogado | null {
    const salvo = sessionStorage.getItem(this.CHAVE) ?? localStorage.getItem(this.CHAVE);
    return salvo ? JSON.parse(salvo) : null;
  }

  get ehAdmin(): boolean {
    return this.usuario?.admin === true;
  }
}
