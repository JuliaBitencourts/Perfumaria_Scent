import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Menu } from '../menu/menu';

@Component({
  selector: 'app-carrinho',
  imports: [RouterLink, Menu],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css',
})
export class Carrinho {

}

