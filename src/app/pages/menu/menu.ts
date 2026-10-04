import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  itensMenu = [
    { label: 'Novidades', id: 'novidades' },
    { label: 'Nossa Essência', id: 'nossa-essencia' },
    { label: 'Perfumes', id: 'perfumes' }
  ];

  constructor(private router: Router) {}

  navegarPara(id: string): void {
    const secao = document.getElementById(id);

    if (secao) {
      secao.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    });
  }
}