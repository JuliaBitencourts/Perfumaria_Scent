import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Crud } from './crud';
import { routes } from '../../app.routes';

describe('Crud', () => {
  let component: Crud;
  let fixture: ComponentFixture<Crud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Crud],
      // Rotas e HTTP de teste (sem chamar a API de verdade)
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Crud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
