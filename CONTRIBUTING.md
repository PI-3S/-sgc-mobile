# Guia de Contribuição — SGC Mobile

Este documento define os padrões obrigatórios do projeto. Todos os integrantes devem seguir antes de abrir um PR.

---

## Fluxo de branches

```
main ← develop ← feature/sua-branch
```

- **Nunca** faça push direto na `main` ou `develop`
- Trabalhe sempre na sua `feature/`
- Ao terminar, abra PR para `develop` e peça revisão de 1 colega

---

## Estilo visual

O app mobile segue o tema do sistema web. **Nunca use cores hardcoded** — sempre importe do tema:

```ts
import { colors, spacing, radius, fontSize, getStatusStyle } from '../styles/theme';

// ✅ Correto
backgroundColor: colors.card

// ❌ Errado
backgroundColor: '#1a1a2e'
```

### Cores principais

| Token | Cor | Uso |
|-------|-----|-----|
| `colors.primary` | Azul escuro | Fundo geral, textos de destaque |
| `colors.accent` | Azul médio | Botões primários |
| `colors.accentGreen` | Verde | Sucesso, aprovado |
| `colors.error` | Vermelho | Erro, reprovado |
| `colors.warning` | Amarelo | Pendente, correção |
| `colors.textPrimary` | Branco suave | Texto principal |
| `colors.textSecondary` | Cinza | Texto secundário |

### Badges de status

```ts
const { bg, text } = getStatusStyle(submissao.status);

<View style={{ backgroundColor: bg, borderRadius: radius.full, paddingHorizontal: spacing.sm }}>
  <Text style={{ color: text }}>{submissao.status}</Text>
</View>
```

---

## Padrões de código

### 1. Ordem dos hooks — OBRIGATÓRIO

```ts
// ✅ useCallback SEMPRE antes do useEffect que o usa
const loadData = useCallback(async () => {
  // ...
}, []);

useEffect(() => {
  loadData();
}, [loadData]);

// ❌ Errado — causa erro de inicialização
useEffect(() => {
  loadData(); // erro!
}, [loadData]);
const loadData = useCallback(...);
```

### 2. Mapeamento de campos da API — use fallbacks

```ts
// ✅ Sempre múltiplos fallbacks
const nome = item.nome || item.nome_aluno || item.aluno?.nome || '—';
const horas = item.horas || item.carga_horaria_solicitada || 0;

// ❌ Nunca acesse campo diretamente sem fallback
const nome = item.nome; // pode quebrar
```

### 3. Chamadas à API — sempre use apiFetch

```ts
import { apiFetch } from '../services/api';

// ✅ Correto — token é adicionado automaticamente
const dados = await apiFetch('/api/submissoes');

// ❌ Errado — não usar fetch direto
fetch('https://back-end-banco-five.vercel.app/api/submissoes');
```

### 4. Autenticação — sempre use useAuth

```ts
import { useAuth } from '../contexts/AuthContext';

const { user, signOut } = useAuth();
```

---

## Estrutura de pastas

```
src/
  screens/      → uma tela por arquivo (LoginScreen, DashboardScreen...)
  components/   → componentes reutilizáveis
  contexts/     → AuthContext e outros contextos
  services/     → api.ts e serviços externos
  styles/       → theme.ts (cores, espaçamentos)
  types/        → interfaces TypeScript
```

---

## Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Componentes / Telas | PascalCase | `LoginScreen`, `SubmissaoCard` |
| Funções | camelCase | `loadSubmissoes`, `handleSubmit` |
| Variáveis | camelCase | `totalHoras`, `isLoading` |
| Arquivos de tela | PascalCase + Screen | `HistoricoScreen.tsx` |
| Arquivos de componente | PascalCase | `StatusBadge.tsx` |
| Arquivos de serviço | camelCase | `api.ts` |

---

## Checklist antes do PR

- [ ] O app abre sem erros no Expo Go
- [ ] Usei `colors` do `theme.ts` (sem cores hardcoded)
- [ ] `useCallback` está antes do `useEffect` que depende dele
- [ ] Campos da API têm fallbacks (`|| '—'`)
- [ ] Chamadas à API usam `apiFetch`
- [ ] Sem `console.log` esquecido no código
