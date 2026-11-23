import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../service/cliente.service';
import { SessaoService } from '../../service/sessao.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private service = inject(ClienteService);
  private sessao = inject(SessaoService);
  private cdr = inject(ChangeDetectorRef);

  perfil = 'cliente';
  email = '';
  senha = '';
  lembrar = false;
  erro = '';

  entrar() {
    this.erro = '';

    if (!this.email || !this.senha) {
      this.erro = 'Informe o e-mail e a senha.';
      return;
    }

    // Busca só o cliente com esse e-mail, em vez de baixar todos os clientes
    this.service.buscarPorEmail(this.email).subscribe({
      next: (clientes) => {
        const usuario = clientes.find(c => c.senha === this.senha);

        if (!usuario) {
          this.mostrarErro('E-mail ou senha incorretos.');
          return;
        }

        if (this.perfil === 'admin' && usuario.email !== SessaoService.EMAIL_ADMIN) {
          this.mostrarErro('Este usuário não tem acesso de administrador.');
          return;
        }

        this.sessao.entrar(usuario, this.lembrar);
        this.router.navigate([this.perfil === 'admin' ? '/admin/Crud' : '/']);
      },
      error: () => {
        this.mostrarErro('Não foi possível consultar a API. Verifique se o json-server está rodando.');
      }
    });
  }

  // A resposta da API chega depois do clique: avisa o Angular para redesenhar a tela
  private mostrarErro(mensagem: string) {
    this.erro = mensagem;
    this.cdr.markForCheck();
  }
}
