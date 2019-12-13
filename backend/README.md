## Projeto
Gympoint - backend
- Gestão de planos
- Gestão de matrículas
- Checkins
- Pedido de auxílio

## Instalação

Postgres - Banco de dados principal
`docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres`

Redis - Banco de dados para filas
`docker run --name redis -p 6379:6379 -d -t redis:alpine`

Nome do banco de dados Postgres
`gympoint`

Sequelize
`yarn sequelize db:migrate`

Seed
`yarn sequelize db:seed:all`

## **Execução**

Instalar os pacotes e dependências
`yarn`

Iniciar servidor da aplicação
`yarn dev`

Iniciar servidor de email em outro terminal
`yarn queue`
