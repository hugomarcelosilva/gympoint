## Projeto
Gympoint - App

## Demo
Vídeo de demonstração do aplicativo na pasta /demo

## Instalação

Antes deve seguir o processo de instalação e execução no [Projeto back-end](https://github.com/hugo-marcelo/node-gympoint)

## **Execução (iOS)**

Instalar os pacotes e dependências
`yarn`

Iniciar o aplicativo no emulador do iOS
`yarn ios`

## **Execução (Android)**

Instalar os pacotes e dependências
`yarn`

Alterar a variável baseURL em `/src/services/api.js` colocando o ip local ou do emulador

Iniciar o aplicativo no emulador do Android
`yarn android`

### Troubleshooting

Caso dê erro para encontrar o SDK do Android só criar o arquivo local.properties na pasta /android com o seguinte comando
`sdk.dir = [caminho do sdk]`
Ex: /Users/admin/Library/Android/sdk
