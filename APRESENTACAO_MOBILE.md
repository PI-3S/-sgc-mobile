# Roteiro de Apresentação — SGC Mobile (Frontend Mobile)
> **Projeto Integrador — SENAC Recife 2026**
> Use este arquivo como guia de fala. Cada seção mapeia um critério da avaliação.

---

## 0. Abertura (30s)

> *"Vou apresentar o módulo mobile do SGC — Sistema de Gestão de Atividades Complementares. É um aplicativo React Native com Expo, escrito em TypeScript, que permite ao aluno fazer login, acompanhar seu progresso, enviar certificados e consultar o histórico de submissões. Ele se comunica com uma API REST hospedada no Vercel."*

---

## 1. Análise do Problema e Escopo

**O problema:**
Alunos precisam registrar horas de atividades complementares manualmente via papel ou e-mail. O processo é lento, sem rastreabilidade e difícil de auditar pela coordenação.

**O escopo do mobile:**
- Autenticação do aluno
- Visualização do progresso (horas aprovadas, pendentes, reprovadas)
- Submissão de certificados com upload de arquivo
- Histórico de submissões com status

**Fora do escopo mobile (está no PWA/backend):**
- Aprovação/reprovação pela coordenação
- Cadastro de regras e cursos
- Relatórios administrativos

---

## 2. Arquitetura do Sistema *(1,5 pts)*

> *"O mobile segue uma arquitetura em camadas clara."*

```
App.tsx (raiz)
  └── AuthProvider (contexto global)
        └── AppNavigator (Stack)
              ├── LoginScreen (não autenticado)
              └── TabNavigator (autenticado)
                    ├── DashboardScreen
                    ├── SubmissaoScreen
                    └── HistoricoScreen
```

**Camadas do projeto:**

| Camada | Pasta | Responsabilidade |
|--------|-------|-----------------|
| Telas | `src/screens/` | Lógica de UI + estado local |
| Componentes | `src/components/` | UI reutilizável, sem regra de negócio |
| Contexto | `src/contexts/` | Estado global (autenticação) |
| Serviços | `src/services/` | Comunicação com API |
| Navegação | `src/navigation/` | Definição de rotas |
| Estilos | `src/styles/` | Design tokens centralizados |
| Tipos | `src/types/` | Interfaces TypeScript |

> *"Cada camada tem uma responsabilidade única. A tela não sabe como fazer uma requisição HTTP — ela chama o serviço. O serviço não sabe nada de navegação. Isso facilita manutenção e teste."*

---

## 3. Integração Mobile ↔ API *(0,5 pts)*

**Arquivo central:** `src/services/api.ts`

**O que foi feito:**
- Wrapper `apiFetch()` que anexa automaticamente o Bearer token de cada requisição
- Wrapper `apiUpload()` para envio de arquivos via FormData (sem sobrescrever o `Content-Type`, pois o browser precisa setar o boundary)
- Tratamento global de **401**: qualquer resposta não autorizada dispara logout automático via callback registrado no AuthContext
- Troca de dados via JSON em todos os endpoints

**Endpoints consumidos pelo mobile:**

| Método | Endpoint | Tela |
|--------|----------|------|
| POST | `/api/auth/login` | Login |
| GET | `/api/dashboard/aluno` | Dashboard |
| GET | `/api/regras?curso_id=...` | Submissão |
| POST | `/api/submissoes` | Submissão |
| POST | `/api/certificados` | Submissão (upload) |
| GET | `/api/submissoes` | Histórico |

**Fluxo de upload em 2 etapas:**
1. Cria o registro da submissão → recebe `id`
2. Faz upload do arquivo com o `id` vinculado

> *"Separamos a criação do registro e o upload em dois passos para garantir rastreabilidade no backend — se o upload falhar, a submissão existe mas sem certificado, e o aluno pode tentar de novo."*

---

## 4. Interface e Usabilidade *(0,5 pts)*

**Telas implementadas:**
- **Login** — formulário com validação, feedback de erro inline, loading no botão
- **Dashboard** — cards com horas aprovadas, pendentes e reprovadas; breakdown por área de atividade
- **Submissão** — seletor de área (dropdown customizado), campos de texto, seleção de arquivo, botão com loading
- **Histórico** — FlatList com status colorido por estado (verde = aprovado, amarelo = pendente, vermelho = reprovado)

**Decisões de UX:**
- `SafeAreaView` em todas as telas (evita sobreposição com notch/barra de status)
- `KeyboardAvoidingView` no login (iOS não esconde o teclado automaticamente)
- `ScrollView` nas telas com muito conteúdo
- Cores semânticas via `getStatusStyle()` no tema: status de submissão sempre consistente
- Confirmação antes de logout (evita sair por acidente)

**Tema visual:**
- Dark theme com paleta azul/verde
- Design tokens centralizados em `src/styles/theme.ts` — se mudar uma cor, muda em todo o app

---

## 5. Organização e Modularização *(1,0 pt)*

**Estrutura de pastas:**
```
src/
├── screens/      ← 4 telas (Login, Dashboard, Submissão, Histórico)
├── components/   ← 4 componentes reutilizáveis
├── contexts/     ← AuthContext (estado global de autenticação)
├── services/     ← api.ts (único ponto de saída HTTP)
├── navigation/   ← AppNavigator + TabNavigator
├── styles/       ← theme.ts (tokens de design)
└── types/        ← index.ts (interfaces TypeScript)
```

**Por que isso importa:**
- Qualquer dev novo no projeto entende em 30 segundos onde fica cada coisa
- Adicionar uma nova tela = criar arquivo em `screens/` + registrar em `TabNavigator`
- Mudar a URL da API = editar 1 constante em `api.ts`

---

## 6. Reuso e Componentização *(2,0 pts)*

> *"Este foi um foco intencional do projeto. Vou mostrar os 4 componentes reutilizáveis:"*

### `Header.tsx`
- Usado em: Dashboard, Submissão, Histórico
- Recebe `title` como prop
- Botão de logout embutido com confirmação
- Sem esse componente, o botão de logout estaria duplicado em 3 telas

### `FormField.tsx`
- Wraps `TextInput` com label, placeholder, suporte a multiline, teclado numérico etc.
- Props: `label`, `value`, `onChangeText`, `keyboardType`, `secureTextEntry`, `autoCapitalize`...
- Usado no Login e na Submissão
- Elimina ~30 linhas de código repetido por campo

### `PrimaryButton.tsx`
- Botão padrão do app: cor de destaque, estado de loading (spinner), estado disabled
- Usado em Login e Submissão
- Garante consistência visual sem código duplicado

### `RegraPicker.tsx`
- Dropdown customizado para seleção de área de atividade
- Sem dependência externa (sem `react-native-picker` ou similar)
- Mostra nome da área + limite de horas
- Toggle abrir/fechar gerenciado internamente

> *"Com esses 4 componentes, as telas ficam limpas — só lógica de negócio. O visual está nos componentes."*

---

## 7. Qualidade e Refatoração do Código *(2,0 pts)*

**TypeScript em todo o projeto:**
- Interfaces para `User`, `Submissao`, `Regra`, `LoginCredentials`
- Props tipadas em todos os componentes
- Retorno de `apiFetch<T>()` é genérico — a tela diz que tipo espera

**Separação de responsabilidades:**
- Tela não faz `fetch` diretamente — chama `apiFetch()`
- `AuthContext` não sabe nada de HTTP além do login — delega ao `api.ts`
- `api.ts` não importa nada de navegação — usa callback para o logout

**Validação centralizada:**
- Submissão valida todos os campos antes de enviar (área, tipo, horas, arquivo)
- Mensagens de erro via `Alert.alert()` padronizado

**Evitou duplicação:**
- Header/logout: 1 componente, 3 telas
- Botão: 1 componente, 2 telas
- Campo de texto: 1 componente, 2 telas
- Token handling: 1 lugar (`api.ts`)

**Nomeação consistente:**
- Funções em camelCase descritivo: `carregarRegras`, `selecionarArquivo`, `limparFormulario`, `enviar`
- Arquivos em PascalCase para componentes/telas, camelCase para utils/services

---

## 8. GitHub e Versionamento *(0,5 pts)*

**Workflow adotado:**
```
main ← develop ← feature/<nome>
```

- `main`: produção — só recebe via PR da `develop`
- `develop`: integração — branch base para todos os PRs
- `feature/*`: uma branch por funcionalidade, uma pessoa responsável

**Branches do projeto mobile:**

| Branch | Responsável | Feature |
|--------|------------|---------|
| `feature/navegacao-base` | Everson | Setup Expo + navegação + AuthContext |
| `feature/login` | Everson | Tela de login |
| `feature/submissao-upload` | Erick Allan | Submissão + upload + componentes |
| `feature/progresso-historico` | Maria Clara/Sam | Dashboard + Histórico |
| `feature/historico` | — | Histórico (em andamento) |
| `feature/progresso` | — | Dashboard (em andamento) |

**Boas práticas:**
- Commits atômicos com mensagens descritivas (`feat:`, `fix:`, `chore:`)
- PRs com descrição do que foi feito e checklist de testes
- Revisão antes de merge na `develop`
- Conflitos resolvidos na branch feature, não no `develop`

---

## 9. Boas Práticas e Padrões de Projeto *(0,5 pts)*

**Padrões aplicados:**

| Padrão | Onde |
|--------|------|
| **Provider / Context** | `AuthContext` — estado global sem prop drilling |
| **Custom Hook** | `useAuth()` — encapsula consumo do context |
| **Service Layer** | `api.ts` — abstrai HTTP, token, logout |
| **Controlled Components** | Todos os formulários usam `useState` + `onChangeText` |
| **Compound Components** | `TabNavigator` compõe `Header` + `Screen` por tab |
| **Callback Registration** | `setLogoutCallback()` — desacopla API do contexto de auth |

**Princípios seguidos:**
- **SRP** (Single Responsibility): cada arquivo faz uma coisa
- **DRY** (Don't Repeat Yourself): componentes reutilizáveis eliminam duplicação
- **Separation of Concerns**: tela ≠ serviço ≠ estilo ≠ navegação

---

## 10. Documentação e Apresentação *(0,5 pts)*

- `README.md` no repositório com setup do projeto
- `CLAUDE.md` com contexto técnico do projeto
- Histórico de commits legível com conventional commits
- Código auto-documentado via TypeScript (interfaces servem como documentação)
- Este roteiro (como evidência de organização da apresentação)

---

## Fechamento (30s)

> *"O módulo mobile do SGC entrega autenticação completa com persistência de sessão, integração real com backend via API REST, upload de arquivos em dois passos, e uma arquitetura componentizada e tipada que facilita a colaboração em time. As decisões foram guiadas pelos critérios de reuso, separação de responsabilidades e qualidade de código — que respondem diretamente aos critérios de maior peso na avaliação."*

---

## Pontuação Esperada

| Critério | Pts | Evidência Principal |
|----------|-----|-------------------|
| Análise do problema | 0,0 | — |
| Arquitetura | 1,5 | Camadas, AppNavigator, separação de pastas |
| Integração Mobile/API | 0,5 | `api.ts`, 6 endpoints, upload em 2 etapas |
| Interface e usabilidade | 0,5 | 4 telas, SafeAreaView, tema escuro, status colors |
| Organização e modularização | 1,0 | Estrutura de pastas, 1 responsabilidade por arquivo |
| Reuso e componentização | 2,0 | Header, FormField, PrimaryButton, RegraPicker |
| Qualidade e refatoração | 2,0 | TypeScript, sem duplicação, validação, naming |
| GitHub e versionamento | 0,5 | Branching model, PRs, commits convencionais |
| Boas práticas/padrões | 0,5 | Context, Custom Hook, Service Layer, SRP |
| Documentação | 0,5 | README, commits, TypeScript como docs |
| **TOTAL** | **9,0** | |

---

*Juntar com roteiro do backend e PWA para apresentação completa.*
