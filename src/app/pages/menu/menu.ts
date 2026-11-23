
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SessaoService } from '../../service/sessao.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  private router = inject(Router);
  sessao = inject(SessaoService);

  itensMenu = [
    { label: 'Novidades', id: 'novidades' },
    { label: 'Nossa Essência', id: 'nossa-essencia' },
    { label: 'Perfumes', id: 'perfumes' }
  ];

  navegarPara(id: string): void {
    const secao = document.getElementById(id);

    if (secao) {
      secao.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    });
  }

  sair(): void {
    this.sessao.sair();
    this.router.navigate(['/']);
  }
}
