import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Menu } from '../menu/menu';
import { Cliente } from '../../modelo/cliente';
import { ClienteService } from '../../service/cliente.service';
import { SessaoService } from '../../service/sessao.service';

@Component({
  selector: 'app-cadastro-clientes',
  imports: [FormsModule, Menu],
  templateUrl: './cadastro-clientes.html',
  styleUrl: './cadastro-clientes.css',
})
export class CadastroClientes implements OnInit {
  private service = inject(ClienteService);
  private sessao = inject(SessaoService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  clientes: Cliente[] = [];
  cliente: Cliente = this.clienteVazio();
  confirmarSenha = '';
  editando = false;
  salvando = false;
  busca = '';
  mensagem = '';

  // Só o administrador vê (e altera/exclui) a lista de clientes
  get ehAdmin(): boolean {
    return this.sessao.ehAdmin;
  }

  ngOnInit(): void {
    if (this.ehAdmin) {
      this.listar();
    }
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
    this.service.listar().subscribe({
      next: (dados) => {
        this.clientes = dados;
        this.cdr.markForCheck();   // avisa o Angular para redesenhar a tela
      },
      error: () => this.mostrarMensagem('Não foi possível carregar os clientes. A API está rodando?'),
    });
  }

  salvar() {
    const c = this.cliente;

    if (!c.nome || !c.email || !c.cpf || !c.telefone) {
      this.mensagem = 'Preencha nome, e-mail, CPF e telefone.';
      return;
    }

    if (!/^\d{11}$/.test(c.cpf)) {
      this.mensagem = 'O CPF deve ter 11 números.';
      return;
    }

    if (!this.editando && !c.senha) {
      this.mensagem = 'Informe uma senha.';
      return;
    }

    if (c.senha !== this.confirmarSenha) {
      this.mensagem = 'As senhas não são iguais.';
      return;
    }

    // Evita clique duplo enquanto a API responde
    if (this.salvando) {
      return;
    }
    this.salvando = true;

    // Não deixa cadastrar dois clientes com o mesmo e-mail
    this.service.buscarPorEmail(c.email).subscribe({
      next: (existentes) => {
        if (existentes.some(e => e.id !== c.id)) {
          this.salvando = false;
          this.mostrarMensagem('Já existe um cliente com este e-mail.');
          return;
        }

        if (this.editando && c.id) {
          this.service.editar(c).subscribe({
            next: () => {
              this.cancelar();
              this.mostrarMensagem('Cadastro alterado com sucesso.');
              this.listar();
            },
            error: () => this.falhou('Erro ao alterar o cadastro.'),
          });
        } else {
          this.service.cadastrar(c).subscribe({
            next: (salvo) => {
              this.cancelar();

              if (this.ehAdmin) {
                this.mostrarMensagem('Cliente cadastrado com sucesso.');
                this.listar();
              } else {
                // Mesmo fluxo das aulas: avisa e leva para o login
                alert(`Cliente ${salvo.nome} cadastrado com sucesso! Faça seu login.`);
                this.router.navigate(['/pessoas/login']);
              }
            },
            error: () => this.falhou('Erro ao cadastrar o cliente.'),
          });
        }
      },
      error: () => this.falhou('Não foi possível consultar a API. Verifique se o json-server está rodando.'),
    });
  }

  editar(c: Cliente) {
    this.cliente = { ...c };
    this.confirmarSenha = c.senha;
    this.editando = true;
    this.mensagem = '';
  }

  excluir(c: Cliente) {
    if (c.id && confirm('Deseja excluir o cadastro de ' + c.nome + '?')) {
      this.service.excluir(c.id).subscribe({
        next: () => {
          this.mostrarMensagem('Cadastro excluído.');
          this.listar();
        },
        error: () => this.mostrarMensagem('Erro ao excluir o cadastro.'),
      });
    }
  }

  cancelar() {
    this.cliente = this.clienteVazio();
    this.confirmarSenha = '';
    this.editando = false;
    this.salvando = false;
  }

  filtrar() {
    const texto = this.busca.toLowerCase();

    return this.clientes.filter(c =>
      (c.nome ?? '').toLowerCase().includes(texto) ||
      (c.email ?? '').toLowerCase().includes(texto) ||
      (c.cpf ?? '').includes(texto)
    );
  }

  private falhou(mensagem: string) {
    this.salvando = false;
    this.mostrarMensagem(mensagem);
  }

  private mostrarMensagem(mensagem: string) {
    this.mensagem = mensagem;
    this.cdr.markForCheck();
  }
}
