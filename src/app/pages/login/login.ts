import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../service/cliente.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private service = inject(ClienteService);

  private readonly EMAIL_ADMIN = 'admin@scent.com';

  perfil = 'cliente';
  email = '';
  senha = '';
  erro = '';

  entrar() {
    this.erro = '';

    this.service.listar().subscribe({
      next: (clientes) => {
        const usuario = clientes.find(
          c => c.email === this.email && c.senha === this.senha
        );

        if (!usuario) {
          this.erro = 'E-mail ou senha incorretos.';
          return;
        }

        if (this.perfil === 'admin') {
          if (usuario.email === this.EMAIL_ADMIN) {
            this.router.navigate(['admin/Crud']);
          } else {
            this.erro = 'Este usuário não tem acesso de administrador.';
          }
        } else {
          this.router.navigate(['/']);
        }
      },
      error: () => {
        this.erro = 'Não foi possível consultar a API. Verifique se o json-server está rodando.';
      }
    });
  }
}