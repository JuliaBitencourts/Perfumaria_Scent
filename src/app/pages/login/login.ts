import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);

  perfil = 'cliente';
  email = '';
  senha = '';
  erro = '';

  entrar() {
    this.erro = '';

    if (this.perfil === 'admin') {
      if (this.email === 'admin@scent.com' && this.senha === '1234') {
        this.router.navigate(['/crud']);
      } else {
        this.erro = 'E-mail ou senha incorretos.';
      }
    }
  }
}