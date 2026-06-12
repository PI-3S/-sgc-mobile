# SGC Mobile — Sistema de Gestão de Atividades Complementares

App mobile do SGC, desenvolvido com **Expo + React Native + TypeScript** como parte do Projeto Integrador do SENAC Recife 2026.

---

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI: `npm install -g expo-cli`
- App **Expo Go** no celular (iOS ou Android)

---

## Como rodar

```bash
# 1. Clone o repositório
git clone https://github.com/PI-3S/sgc-mobile.git
cd sgc-mobile

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npx expo start
```

Escaneie o QR code com o Expo Go para abrir no celular.

---

## Estrutura de branches

| Branch | Responsável | Descrição |
|--------|-------------|-----------|
| `main` | — | Produção. Nunca recebe push direto. |
| `develop` | — | Desenvolvimento integrado. Base para features. |
| `feature/navegacao-base` | Everson | Setup Expo + navegação + logout |
| `feature/login` | Pessoa 2 | Tela de login |
| `feature/progresso-historico` | Pessoa 3 | Dashboard + histórico |
| `feature/submissao-upload` | Pessoa 4 | Submissão + upload de certificado |

---

## Fluxo de trabalho

```
main ← develop ← feature/sua-branch
```

1. **Nunca** fazer push direto na `main` ou `develop`
2. Sempre trabalhar na sua branch `feature/`
3. Quando terminar, abrir **Pull Request → develop**
4. Pedir revisão de **1 colega** antes do merge
5. Após aprovação, o merge é feito na `develop`

---

## Backend

A API do sistema está em: `https://back-end-banco-five.vercel.app`

Consulte `docs/API.md` para referência completa dos endpoints.

---

## Equipe

| Nome | Branch | GitHub |
|------|--------|--------|
| Everson José | feature/navegacao-base | — |
|  Everson josé | feature/login | — |
| Maria clara barbosa / Sam ferreira | feature/progresso-historico | — |
| Erick allan | feature/submissao-upload | — |
