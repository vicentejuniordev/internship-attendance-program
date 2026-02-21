# Backend – Registro de Frequência de Estágio

API em arquitetura MVC para registro de entrada/saída de estagiários, desacoplada do frontend.

## Código Único do Estagiário

Cada estagiário é identificado por um **código único** no formato **EST-XXXXX** (ex.: `EST-8F3A2`):

- O código é **gerado automaticamente** no cadastro do estagiário (POST /estagiarios).
- É **imutável** e **único** no sistema; substitui login/senha para o registro de frequência.
- O estagiário digita apenas o código na tela de registro; o backend resolve o estagiário pelo código e valida (existência, ativo, regras de entrada/saída no dia).
- O código **não deve ser exposto em URL**; é enviado apenas no body do POST /frequencia.

Estagiários inativos (`ativo: false`) não podem registrar frequência; o código continua existindo mas fica bloqueado para uso.

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

Com isso, as requisições do frontend serão enviadas para essa URL (ex.: `http://localhost:3000/frequencia`, `http://localhost:3000/estagiarios`).

## Endpoints

### POST /estagiarios

Cadastra um novo estagiário. O **código único (EST-XXXXX)** é gerado automaticamente pelo backend.

**Body (JSON):**

- `nome` (string, obrigatório) – Nome completo do estagiário

**Resposta de sucesso (201):**

```json
{
  "estagiario": {
    "id": 1,
    "nome": "Fulano da Silva",
    "codigo": "EST-8F3A2",
    "ativo": true,
    "criado_em": "2026-02-19T12:00:00.000Z"
  }
}
```

O campo `codigo` deve ser entregue ao estagiário para uso no registro de frequência.

### GET /estagiarios

Lista todos os estagiários (para uso administrativo).

**Resposta de sucesso (200):**

```json
{
  "estagiarios": [
    {
      "id": 1,
      "nome": "Fulano da Silva",
      "codigo": "EST-8F3A2",
      "ativo": true,
      "criado_em": "2026-02-19T12:00:00.000Z"
    }
  ]
}
```

### POST /frequencia

Registra entrada ou saída do estagiário. O backend busca o estagiário pelo **código**, valida se está ativo e aplica as regras do dia (uma entrada e uma saída por dia).

**Body (JSON):**

- `codigo` (string, obrigatório) – Código do estagiário (formato EST-XXXXX)
- `tipo` (string, obrigatório) – `"entrada"` ou `"saida"`

**Resposta de sucesso (201):**

```json
{
  "status": "ok",
  "mensagem": "Entrada registrada."
}
```

**Respostas de erro (4xx):** `mensagem` descreve o motivo (ex.: "Código não encontrado.", "Código inativo. Não é possível registrar frequência.", "Já existe entrada registrada para hoje.", "Registre a entrada antes de registrar a saída.").

```json
{
  "mensagem": "Código não encontrado.",
  "message": "Código não encontrado."
}
```

## Persistência

- **`data/estagiarios.json`** – Lista de estagiários (id, nome, codigo, ativo, criado_em). O campo `codigo` é único.
- **`data/frequencias.json`** – Registros de frequência por dia (id, estagiario_id, data, hora_entrada, hora_saida). Um registro por estagiário por dia.

O diretório `data/` e os arquivos são criados automaticamente quando necessário.
