import { Component } from '@angular/core';

import { Menu } from './menu/menu';
import { Body } from './body/body';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Menu, Body, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}