import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Carrinho } from './pages/carrinho/carrinho';

@Component({
  imports: [RouterOutlet, Carrinho],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Perfumaria_Scent');
}
