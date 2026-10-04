import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Crud } from './pages/crud/crud';
import { CadastroClientes } from './pages/cadastro-clientes/cadastro-clientes';
import { Carrinho } from './pages/carrinho/carrinho';

export const routes: Routes = [

  {
    path: '',
    component: Home,
    title: 'Home'
  },

  {
    path: 'pessoas/login',
    component: Login,
    title: 'Login'
  },

  {
    path: 'admin/Crud',
    component: Crud,
    title: 'Manutenção Produtos'
  },

  {
    path: 'pessoas/cadastro',
    component: CadastroClientes,
    title: 'Cadastro Clientes'
  },

  {
    path: 'pessoas/carrinho',
    component: Carrinho,
    title: 'Carrinho'
  }

];