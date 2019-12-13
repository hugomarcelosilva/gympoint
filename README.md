<h1 align="center">
  <img alt="Gympoint" title="Gympoint" src=".github/logo.png" width="200px" />
</h1>

<h3 align="center">
  Desafio final Gympoint: back-end, front-end web e mobile
</h3>

<p align = "center">
<a href="https://www.codefactor.io/repository/github/hugo-marcelo/challenge-gympoint"><img src="https://www.codefactor.io/repository/github/hugo-marcelo/challenge-gympoint/badge" alt="CodeFactor" /></a>
<img alt = "Última confirmação do Github" src = "https://img.shields.io/github/last-commit/hugo-marcelo/challenge-gympoint">
<img alt = "Idioma principal do GitHub" src = "https://img.shields.io/github/languages/top/hugo-marcelo/challenge-gympoint">
<img alt = "GitHub" src = "https://img.shields.io/github/license/hugo-marcelo/challenge-gympoint.svg">
<a href="https://www.codacy.com/manual/hugo-marcelo/challenge-gympoint?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=hugo-marcelo/challenge-gympoint&amp;utm_campaign=Badge_Grade"><img src="https://api.codacy.com/project/badge/Grade/147d0b2836734c79b7ee5ea035f065b4"/></a>
</p>  

## :gear:  Back-end

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
---
## :computer: Front-end

### :information_source: Instruções Front-end

```bash
#instalar os pacotes e dependências
yarn

# iniciar a aplicação web
yarn start
```

---
## :iphone: Mobile

### :information_source: Instruções Mobile (iOS)
```bash
#instalar os pacotes e dependências
yarn

# iniciar o aplicativo no emulador do iOS
yarn ios
```

### :information_source: Instruções Mobile (Android)
```bash
#instalar os pacotes e dependências
yarn
```
Alterar a variável baseURL em `/src/services/api.js` colocando o ip local ou do emulador

```bash
# inicializar a aplicação web
yarn android
```

### :warning: Troubleshooting
Caso dê erro para encontrar o SDK do Android só criar o arquivo local.properties na pasta /android com o seguinte comando
`sdk.dir = [caminho do sdk]`

```bash
Ex: /Users/admin/Library/Android/sdk
```

---
## :memo: Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
## :clap: Obrigado

[Rocketseat](https://rocketseat.com.br/) pelo bootcamp!
