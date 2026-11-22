import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Menu } from '../menu/menu';
import { Cliente } from '../../modelo/cliente';
import { ClienteService } from '../../service/cliente.service';

@Component({
  selector: 'app-cadastro-clientes',
  imports: [FormsModule, Menu],
  templateUrl: './cadastro-clientes.html',
  styleUrl: './cadastro-clientes.css',
})
export class CadastroClientes implements OnInit {

  clientes: Cliente[] = [];
  cliente: Cliente = this.clienteVazio();
  editando = false;
  busca = '';
  mensagem = '';

  constructor(private service: ClienteService) { }

  ngOnInit(): void {
    this.listar();
  }

  clienteVazio(): Cliente {
    return {
      nome: '',
      email: '',
      cpf: '',
      telefone: '',
      endereco: '',
      senha: '',
    };
  }

  listar() {
    this.service.listar().subscribe(dados => {
      this.clientes = dados;
    });
  }

  salvar() {
    const c = this.cliente;

    if (!c.nome || !c.email || !c.cpf || !c.telefone) {
      this.mensagem = 'Preencha nome, e-mail, CPF e telefone.';
      return;
    }

    if (this.editando && c.id) {

      this.service.editar(c).subscribe(() => {
        this.mensagem = 'Cadastro alterado com sucesso.';
        this.listar();
        this.cancelar();
      });

    } else {

      this.service.cadastrar(c).subscribe(() => {
        this.mensagem = 'Cliente cadastrado com sucesso.';
        this.listar();
        this.cancelar();
      });

    }
  }

  editar(c: Cliente) {
    this.cliente = { ...c };
    this.editando = true;
    this.mensagem = '';
  }

  excluir(c: Cliente) {
    if (c.id && confirm('Deseja excluir o cadastro de ' + c.nome + '?')) {

      this.service.excluir(c.id).subscribe(() => {
        this.mensagem = 'Cadastro excluído.';
        this.listar();
      });

    }
  }

  cancelar() {
    this.cliente = this.clienteVazio();
    this.editando = false;
  }

  filtrar() {
    const texto = this.busca.toLowerCase();

    return this.clientes.filter(c =>
      c.nome.toLowerCase().includes(texto) ||
      c.email.toLowerCase().includes(texto) ||
      c.cpf.includes(texto)
    );
  }
}