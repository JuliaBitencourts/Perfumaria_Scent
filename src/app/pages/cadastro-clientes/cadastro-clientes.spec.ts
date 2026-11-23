import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CadastroClientes } from './cadastro-clientes';
import { routes } from '../../app.routes';

describe('CadastroClientes', () => {
  let component: CadastroClientes;
  let fixture: ComponentFixture<CadastroClientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroClientes],
      // Rotas e HTTP de teste (sem chamar a API de verdade)
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroClientes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
