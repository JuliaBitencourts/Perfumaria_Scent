import { Component } from '@angular/core';
@Component({
 selector: 'app-menu'
,
 standalone: true,
 imports: [],
 templateUrl: './menu.html'
,
 styleUrl: './menu.css'
})
export class Menu {
itensMenu = [
 { label: 'Inicio', link: '' },
 { label: 'Clientes', link: '/clientes' },
 { label: 'Sobre', link: '/sobre' }
 ]
}
