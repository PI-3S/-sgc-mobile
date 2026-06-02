# API do SGC Mobile

Base URL: `https://back-end-banco-five.vercel.app`

Todas as rotas (exceto login) exigem o header:
```
Authorization: Bearer {token}
```

O `apiFetch` em `src/services/api.ts` já adiciona o token automaticamente. Use-o em todas as rotas exceto login e upload de certificado.

---

## Autenticação

### POST /api/auth/login

⚠️ Use `fetch` direto aqui — ainda não tem token.

**Body:**
```json
{ "email": "joao@email.com", "senha": "joao123" }
```

**Resposta:**
```json
{
  "token": "string",
  "refreshToken": "string",
  "usuario": {
    "uid": "string",
    "nome": "string",
    "email": "string",
    "perfil": "aluno",
    "curso_id": "string | null",
    "matricula": "string | null"
  }
}
```

Após receber, salve no AsyncStorage:
```ts
await AsyncStorage.setItem('token', data.token)
await AsyncStorage.setItem('user', JSON.stringify(data.usuario))
```

**Credenciais de teste:**
| Email | Senha |
|-------|-------|
| joao@email.com | joao123 |

---

## Dashboard do Aluno

### GET /api/dashboard/aluno

Use `apiFetch`:
```ts
const dados = await apiFetch('/api/dashboard/aluno')
```

**Resposta:**
```json
{
  "metricas": {
    "total_submissoes": 10,
    "pendentes": 2,
    "aprovadas": 7,
    "reprovadas": 1,
    "total_horas_aprovadas": 120,
    "carga_horaria_minima": 200,
    "progresso_percentual": 60,
    "horas_por_area": [
      { "area": "Extensão", "horas": 40, "limite": 60 },
      { "area": "Pesquisa", "horas": 80, "limite": 100 }
    ]
  }
}
```

> Fallback: o campo `metricas` pode não existir — acesse direto se necessário.

---

## Submissões

### GET /api/submissoes

```ts
const dados = await apiFetch('/api/submissoes')
```

**Resposta:**
```json
{
  "submissoes": [
    {
      "id": "string",
      "status": "pendente | aprovado | reprovado | correcao",
      "data_envio": "2026-05-01T10:00:00Z",
      "tipo": "string",
      "carga_horaria_solicitada": 20,
      "descricao": "string | null",
      "observacao": "string | null"
    }
  ]
}
```

> Para badges coloridos use `getStatusStyle(item.status)` de `src/styles/theme.ts`

---

### POST /api/submissoes

```ts
const sub = await apiFetch('/api/submissoes', {
  method: 'POST',
  body: {
    regra_id: 'id-da-regra',
    tipo: 'Extensão',
    descricao: 'Participação em evento',
    carga_horaria_solicitada: 20
  }
})
// sub.id → use para o upload do certificado
```

**Resposta:**
```json
{ "id": "string" }
```

---

## Certificados

### POST /api/certificados

⚠️ Use `fetch` direto — precisa de FormData, não JSON.

```ts
const token = await AsyncStorage.getItem('token')

const formData = new FormData()
formData.append('submissao_id', submissaoId)
formData.append('arquivo', {
  uri: arquivo.uri,
  name: arquivo.name,
  type: arquivo.mimeType || 'application/pdf'
} as any)

const res = await fetch('https://back-end-banco-five.vercel.app/api/certificados', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + token },
  // NÃO coloque Content-Type — o fetch define sozinho para FormData
  body: formData
})
```

**Limite:** 4 MB  
**Formatos aceitos:** PDF, JPG, PNG  
**Resposta:** status 2xx = sucesso

---

## Regras (áreas disponíveis)

### GET /api/regras

```ts
const { user } = useAuth()
const dados = await apiFetch('/api/regras?curso_id=' + user.curso_id)
```

**Resposta:**
```json
{
  "regras": [
    {
      "id": "string",
      "area": "Extensão",
      "limite_horas": 60,
      "exige_comprovante": true,
      "curso_id": "string"
    }
  ]
}
```

---

## Resumo de endpoints mobile

| Método | Rota | Card | Como chamar |
|--------|------|------|-------------|
| POST | `/api/auth/login` | Card 2 | `fetch` direto |
| GET | `/api/dashboard/aluno` | Card 3 | `apiFetch` |
| GET | `/api/submissoes` | Card 4 | `apiFetch` |
| POST | `/api/submissoes` | Card 5 | `apiFetch` |
| GET | `/api/regras?curso_id=` | Card 5 | `apiFetch` |
| POST | `/api/certificados` | Card 6 | `fetch` direto (FormData) |
