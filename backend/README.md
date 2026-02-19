# Backend – Registro de Frequência de Estágio

API em arquitetura MVC para registro de entrada/saída de estagiários, desacoplada do frontend.

## Requisitos

- Node.js 18+

## Instalação

```bash
cd backend
npm install
```

## Variáveis de ambiente

Copie o arquivo de exemplo e ajuste se necessário:

```bash
cp .env.example .env
```

| Variável     | Descrição                                                                 | Padrão              |
| ------------ | ------------------------------------------------------------------------- | ------------------- |
| `PORT`       | Porta em que o servidor sobe                                              | `3000`              |
| `CORS_ORIGIN`| Origem permitida para CORS (ex.: frontend em dev). Vazio = qualquer origem | `http://localhost:5173` |

## Execução

```bash
# Produção
npm start

# Desenvolvimento (reinicia ao alterar arquivos)
npm run dev
```

O servidor fica disponível em `http://localhost:3000` (ou na porta definida em `PORT`).

## Uso com o frontend

O frontend usa a variável **`VITE_API_URL`** para apontar para esta API. Exemplo no frontend (`.env` ou `.env.local`):

```
VITE_API_URL=http://localhost:3000
```

Com isso, as requisições do frontend serão enviadas para `http://localhost:3000/frequencia`.

## Endpoint

### POST /frequencia

Registra entrada ou saída do estagiário.

**Body (JSON):**

- `codigo` (string, obrigatório) – Código do estagiário
- `tipo` (string, obrigatório) – `"entrada"` ou `"saida"`

**Resposta de sucesso (201):**

```json
{
  "status": "ok",
  "mensagem": "Entrada registrada."
}
```

**Resposta de erro (4xx/5xx):**

```json
{
  "mensagem": "Código inválido.",
  "message": "Código inválido."
}
```

## Persistência

Os registros de frequência são gravados em `data/frequencias.json`. O diretório `data/` é criado automaticamente ao primeiro registro.
