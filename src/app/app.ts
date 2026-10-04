import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './pages/menu/menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Menu],
  template: `
    <router-outlet></router-outlet>
  `
})
export class App {}




