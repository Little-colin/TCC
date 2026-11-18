# Rivals Arena

Projeto web para organizar campeonatos e equipes de esports. Inclui páginas de hub, TV, ranking, campeonatos e uma área de rede social. O backend oferece cadastro e login de usuários, além de operações para campeonatos, equipes e jogadores.

## Requisitos

- Node.js e npm
- MySQL

## Executar localmente

1. Instale as dependências:

	```bash
	npm install
	```

2. Crie o banco e as tabelas executando `banco.sql` no MySQL.

3. Crie um arquivo `.env` na raiz do projeto com as configurações:

	```env
	DB_NAME=tcc
	DB_USER=seu_usuario
	DB_PASSWORD=sua_senha
	DB_HOST=localhost
	DB_PORT=3306
	JWT_SECRET=defina_uma_chave_secreta
	```

4. Inicie o servidor:

	```bash
	npm start
	```

5. Acesse `http://localhost:3000/index.html`.

Atualmente, a rota `http://localhost:3000/` exibe uma mensagem de teste. As credenciais do `.env` não devem ser publicadas no repositório.

## API

- `POST /usuarios`: cria uma conta.
- `POST /login`: autentica um usuário e retorna um token.
- `/campeonatos`, `/times` e `/jogadores`: permitem listar, cadastrar e excluir registros. Essas rotas exigem o token de autenticação no cabeçalho `Authorization: Bearer <token>`.

## Publicação na Vercel

O arquivo `vercel.json` encaminha as requisições para o servidor em `src/app.js`. Configure as mesmas variáveis do `.env` nas configurações do projeto na Vercel e deixe o banco MySQL acessível pelo serviço. Na Vercel, as tabelas devem estar criadas previamente; o servidor não sincroniza o schema automaticamente.