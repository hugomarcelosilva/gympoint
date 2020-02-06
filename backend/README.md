### :information_source: Instruções Back-end

```bash
# instalar PostgreSQL - Banco de dados principal
docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres:11

# instalar Redis - Banco de dados para filas
docker run --name redis -p 6379:6379 -d -t redis:alpine

# nome do banco de dados Posgres
gympoint

# instalar os pacotes e dependências
yarn
```

Faça uma cópia do arquivo .env.example, renomeie para .env e altere as variáveis de acordo com o seu ambiente.

```bash
# criar estrutura do banco de dados Postgres
yarn sequelize db:migrate

# povoar o banco de dados
yarn sequelize db:seed:all

# iniciar servidor da aplicação
yarn dev

# em outro terminal iniciar servidor de email
yarn queue

```
