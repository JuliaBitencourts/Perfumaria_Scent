import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Cliente {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  endereco: string;
  cidade: string;
  uf: string;
  novidades: boolean;
}

@Component({
  selector: 'app-cadastro-clientes',
  imports: [FormsModule],
  templateUrl: './cadastro-clientes.html',
  styleUrl: './cadastro-clientes.css',
})
export class CadastroClientes {
  clientes: Cliente[] = [];
  cliente: Cliente = this.clienteVazio();
  editando = false;
  busca = '';
  mensagem = '';

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const salvo = localStorage.getItem('clientes');
      if (salvo) {
        this.clientes = JSON.parse(salvo);
      }
    }
  }

  clienteVazio(): Cliente {
    return {
      id: 0,
      nome: '',
      email: '',
      cpf: '',
      telefone: '',
      endereco: '',
      cidade: '',
      uf: '',
      novidades: false,
    };
  }

  gravar() {
    localStorage.setItem('clientes', JSON.stringify(this.clientes));
  }

  salvar() {
    const c = this.cliente;

    if (!c.nome || !c.email || !c.cpf || !c.telefone) {
      this.mensagem = 'Preencha nome, e-mail, CPF e telefone.';
      return;
    }

    if (this.editando) {
      const posicao = this.clientes.findIndex((x) => x.id === c.id);
      this.clientes[posicao] = { ...c };
      this.mensagem = 'Cadastro alterado com sucesso.';
    } else {
      c.id = Date.now();
      this.clientes.push({ ...c });
      this.mensagem = 'Cliente cadastrado com sucesso.';
    }

    this.gravar();
    this.cancelar();
  }

  editar(c: Cliente) {
    this.cliente = { ...c };
    this.editando = true;
    this.mensagem = '';
  }

  excluir(c: Cliente) {
    if (confirm('Deseja excluir o cadastro de ' + c.nome + '?')) {
      this.clientes = this.clientes.filter((x) => x.id !== c.id);
      this.gravar();
      this.mensagem = 'Cadastro excluído.';
    }
  }

  cancelar() {
    this.cliente = this.clienteVazio();
    this.editando = false;
  }

  filtrar() {
    const texto = this.busca.toLowerCase();
    return this.clientes.filter(
      (c) =>
        c.nome.toLowerCase().includes(texto) ||
        c.email.toLowerCase().includes(texto) ||
        c.cpf.includes(texto),
    );
  }
}