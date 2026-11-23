# Scent Perfumaria

Loja de perfumes feita em Angular (Projeto Integrador II), com uma API simulada pelo json-server.

## Como rodar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Suba a API (json-server), que grava os dados em `backend/db.json`:

   ```bash
   npm run api
   ```

   A API fica em `http://localhost:3000` (produtos, clientes, carrinho, pedidos).

3. Em outro terminal, suba o site:

   ```bash
   npm start
   ```

   Abra `http://localhost:4200/`.

Usuário administrador de teste: `admin@scent.com` (senha no `backend/db.json`).

## Deploy no GitHub Pages

```bash
npm run deploy
```

O script compila com `--base-href /Perfumaria_Scent/` e publica a pasta
`dist/Perfumaria_Scent/browser` na branch `gh-pages` com o `angular-cli-ghpages`.

Assim como nas aulas, o site publicado conversa com a API **local**
(`localhost:3000`): para usar o site do GitHub Pages, deixe o `npm run api`
rodando no mesmo computador.

## Testes

```bash
npm test
```
