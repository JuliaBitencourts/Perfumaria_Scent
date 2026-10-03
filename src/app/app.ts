import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Carrinho } from './pages/carrinho/carrinho';
import { Home } from './pages/home/home';
import { Menu } from './pages/home/menu/menu';
import { Body } from './pages/home/body/body';
import { Footer } from './pages/home/footer/footer';

@Component({
  imports: [RouterOutlet, Carrinho, Home, Menu, Body, Footer],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Perfumaria_Scent');
}
