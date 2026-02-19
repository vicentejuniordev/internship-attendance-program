# internship-attendance-program

Um software web para fazer a frequência de estágios de maneira simples e rápida.

## Estrutura

- **frontend/** – Aplicação React (Vite) para registro de entrada/saída
- **backend/** – API em Node.js (Express, MVC) que persiste os registros

## Integração backend + frontend

### 1. Backend

```bash
cd backend
cp .env.example .env   # opcional: ajustar PORT ou CORS_ORIGIN
npm install
npm run dev
```

O servidor sobe em **http://localhost:3000** (ou na porta definida em `PORT`).

### 2. Frontend

```bash
cd frontend
cp .env.example .env  # opcional: só necessário se o backend não estiver em localhost:3000
npm install
npm run dev
```

O frontend sobe em **http://localhost:5173**.

### 3. Como ficam conectados

- **Com proxy (recomendado em dev):** Se você **não** definir `VITE_API_URL` no frontend, o Vite redireciona as chamadas de `/frequencia` para `http://localhost:3000`. Basta deixar o backend rodando na porta 3000.
- **Com URL explícita:** Defina no `frontend/.env`: `VITE_API_URL=http://localhost:3000`. O frontend passará a chamar a API diretamente (o backend já permite CORS para `http://localhost:5173` via `CORS_ORIGIN` no `.env` do backend).

Depois disso, abra http://localhost:5173, informe um código e use "Registrar Entrada" ou "Registrar Saída" para testar a integração.
