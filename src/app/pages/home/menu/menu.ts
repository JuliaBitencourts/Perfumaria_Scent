import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
 selector: 'app-menu'
,
 standalone: true,
 imports: [RouterLink],
 templateUrl: './menu.html',
 styleUrl: './menu.css'
})
export class Menu {
itensMenu = [
 { label: 'Novidades', link: '/novidades' },
 { label: 'Nossa Essência', link: '/nossa-essencia' },
 { label: 'Perfumes', link: '/perfumes' }
 ]
}
