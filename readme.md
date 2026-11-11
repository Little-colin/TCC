# Rivals Arena

Rivals Arena é um hub para a comunidade competitiva de jogos eletrônicos. O site reúne conteúdo sobre e-sports e oferece uma área de gerenciamento para usuários cadastrarem campeonatos, equipes e jogadores.

## O que o site oferece

### Páginas

- **Início (`/index.html`)**: apresentação do projeto e da comunidade.
- **TV (`/tv.html`)**: notícias e conteúdo de e-sports.
- **Campeonatos (`/campeonatos.html`)**: cards informativos e acesso à criação de campeonatos.
- **Ranking (`/ranking.html`)**: tabela de exemplo preenchida no navegador.
- **Criar conta (`/criar-conta.html`) e login (`/login.html`)**: cadastro e autenticação.
- **Gerenciamento (`/criar.html`)**: área autenticada para campeonatos, equipes e jogadores.

Notícias, cards e ranking são atualmente conteúdo estático/demonstrativo. Não há integração para partidas, placares ou resultados.

### Área de gerenciamento

Depois de entrar, o usuário pode:

- Criar, listar e excluir seus campeonatos.
- Cadastrar equipes com nome, tag única e URL opcional de logo.
- Selecionar jogadores cadastrados para associar a uma equipe.
- Cadastrar, listar e excluir jogadores.
- Consultar as equipes e jogadores associados à sua conta.

As rotas protegidas usam um token JWT. As senhas são armazenadas com hash bcrypt. O token de login expira após oito horas.

## Tecnologias

- Node.js e Express
- HTML, CSS e JavaScript no frontend
- MySQL e Sequelize
- bcrypt para hash de senhas
- JSON Web Token (JWT) para autenticação

## Organização do código

```text
public/
  *.html                  Páginas do site
  style.css               Estilos
  js/                     Scripts do navegador
  img/                    Imagens
src/
  app.js                  Configuração do Express e registro das rotas
  server.js               Conexão, sincronização do banco e início do servidor
  config/
    database.js           Instância Sequelize e conexão MySQL
    associations.js       Relações entre modelos
  routes/                 Métodos e caminhos HTTP
  controllers/            Validação HTTP e formatação das respostas
  repositories/           Consultas, transações e persistência
  models/                 Modelos Sequelize
  middlewares/auth.js     Verificação do token JWT
banco.sql                 Criação do banco e das tabelas MySQL
```

O fluxo do backend é: **rota → controlador → repositório → modelo/Sequelize → MySQL**. O controlador cuida da requisição e da resposta HTTP; o repositório concentra as operações de persistência. `app.js` configura o Express sem iniciar uma conexão com o banco; `server.js` prepara as associações, conecta e inicia o servidor.

## Requisitos

- Node.js e npm instalados.
- MySQL em execução.
- Um usuário MySQL com permissão para criar e usar o banco `tcc`.

## Instalação e execução

1. Abra um terminal na raiz do projeto e instale as dependências:

   ```bash
   npm install
   ```

2. Crie o banco e suas tabelas executando [`banco.sql`](./banco.sql) no MySQL Workbench ou em outro cliente MySQL. O script seleciona/cria o banco `tcc`.

3. Crie `.env` na raiz do projeto:

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=seu_usuario_mysql
   DB_PASSWORD=sua_senha_mysql
   DB_NAME=tcc
   JWT_SECRET=um_segredo_longo_e_aleatorio
   ```

   Use os dados da sua instalação MySQL. Não publique nem compartilhe o `.env`, pois ele contém credenciais e o segredo usado para assinar tokens.

4. Inicie o servidor:

   ```bash
   node src/server.js
   ```

5. Acesse [http://localhost:3000](http://localhost:3000).

Na inicialização, o Sequelize autentica a conexão e executa `sequelize.sync()` para criar tabelas ausentes. O banco, porém, precisa ser criado antes; use `banco.sql`. `sync()` não substitui migrações para alterações futuras de esquema.

## API HTTP

O Express serve os arquivos de `public/` e a API na mesma origem. Todas as rotas abaixo são relativas a `http://localhost:3000`.

### Conta e autenticação

| Método | Rota | Proteção | Uso |
|---|---|---|---|
| `POST` | `/usuarios` | Pública | Cadastra usuário com `nome`, `email` e `senha`. |
| `POST` | `/login` | Pública | Recebe `email` e `senha`; retorna um token JWT. |

### Campeonatos

| Método | Rota | Proteção | Uso |
|---|---|---|---|
| `GET` | `/campeonatos` | JWT | Lista campeonatos do usuário autenticado. |
| `POST` | `/campeonatos` | JWT | Cria campeonato. Campos: `nome_campeonato`, `data_inicio`; opcionais: `descricao`, `max_times`, `data_fim`, `status`, `formato`. |
| `DELETE` | `/campeonatos/:id` | JWT | Exclui campeonato do usuário autenticado. |

O servidor define `id_organizador` pelo token; não é necessário enviá-lo no corpo.

### Equipes

| Método | Rota | Proteção | Uso |
|---|---|---|---|
| `GET` | `/times` | JWT | Lista as equipes do usuário, incluindo os jogadores associados. |
| `POST` | `/times` | JWT | Cria equipe com `nome_time`, `tag_time`, `logo` opcional e `ids_jogadores` opcional. |
| `DELETE` | `/times/:id` | JWT | Exclui uma equipe do usuário e seus vínculos com jogadores. |

O servidor define `id_capitao` pelo token e valida que os jogadores selecionados foram cadastrados pelo mesmo usuário.

### Jogadores

| Método | Rota | Proteção | Uso |
|---|---|---|---|
| `GET` | `/jogadores` | JWT | Lista jogadores cadastrados pelo usuário. |
| `POST` | `/jogadores` | JWT | Cadastra jogador com `nome_jogador`. |
| `DELETE` | `/jogadores/:id` | JWT | Exclui jogador do usuário e seus vínculos com equipes. |

Envie o token nas rotas protegidas pelo cabeçalho:

```http
Authorization: Bearer <token>
```

## Banco de dados

[`banco.sql`](./banco.sql) define o banco `tcc` e estas tabelas:

- `Usuarios`: contas, e-mail único e hash da senha.
- `Campeonatos`: dados do campeonato e identificador do organizador.
- `Times`: nome, tag única, logo e identificador do capitão.
- `jogadores`: nome do jogador e usuário que o cadastrou.
- `time_jogadores`: tabela de associação entre equipes e jogadores.

Um jogador pode estar associado a mais de uma equipe. A API limita a seleção aos jogadores cadastrados pelo usuário que está criando a equipe.

## Limitações conhecidas

- Notícias, conteúdo da TV, cards e ranking não são carregados da API.
- Ainda não existem rotas nem tabelas para partidas, placares e resultados.
- O script `npm test` do `package.json` é apenas um placeholder; ainda não há testes automatizados configurados.