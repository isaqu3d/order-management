# 🏥 Order Management API

API REST para gerenciamento de pedidos de laboratórios, desenvolvida com Node.js, TypeScript, Express e MongoDB.

## 📑 Índice

- [🎯 Sobre o Projeto](#-sobre-o-projeto)
- [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [✅ Pré-requisitos](#-pré-requisitos)
- [⚙️ Instalação e Configuração](#️-instalação-e-configuração)
- [▶️ Como Executar](#️-como-executar)
- [🧪 Testando a API](#-testando-a-api)
- [📚 Documentação da API](#-documentação-da-api)
- [🔬 Testes](#-testes)
- [📜 Scripts Disponíveis](#-scripts-disponíveis)

---

## 🎯 Sobre o Projeto

Sistema de gerenciamento de pedidos para laboratórios que permite:

- Autenticação de usuários com JWT
- Criação e gerenciamento de pedidos
- Controle de estados dos pedidos (CREATED, ANALYSIS, COMPLETED)
- Gerenciamento de serviços associados aos pedidos
- Paginação de resultados

---

## 🚀 Tecnologias Utilizadas

### 💻 Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express** - Framework web minimalista
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB

### 🔐 Autenticação & Segurança
- **JWT (jsonwebtoken)** - Autenticação via tokens
- **bcryptjs** - Hash de senhas

### 🛠️ Desenvolvimento
- **tsx** - Execução de TypeScript em desenvolvimento
- **Vitest** - Framework de testes
- **ESLint** - Linter para qualidade de código
- **Prettier** - Formatação de código
- **Docker & Docker Compose** - Containerização

---

## 📁 Estrutura do Projeto

```
src/
├── configs/           # Configurações (database, env)
├── controllers/       # Controladores da aplicação
├── middlewares/       # Middlewares (auth, error handling)
├── models/           # Modelos do Mongoose
├── routes/           # Definição de rotas
├── services/         # Lógica de negócio
├── types/            # Tipos TypeScript
└── server.ts         # Ponto de entrada da aplicação
```

---

## ✅ Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (v20 ou superior)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- Um cliente HTTP para testes (Postman, Insomnia, Yaak, Thunder Client, etc.)

---

## ⚙️ Instalação e Configuração

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/isaqu3d/order-management.git
cd order-management
```

### 2️⃣ Configure as variáveis de ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://seu-usuario:sua-senha@cluster.mongodb.net/database

# JWT Configuration
JWT_SECRET=seu-secret-super-seguro-aqui
JWT_EXPIRES_IN=7d

# Application Configuration
API_PREFIX=/api
```

> **Importante:** Nunca commite o arquivo `.env` no Git. Ele já está no `.gitignore`.

---

## ▶️ Como Executar

### 🐳 Opção 1: Com Docker (Recomendado)

Esta é a forma mais fácil de executar o projeto com todas as dependências.

```bash
# Construir e iniciar os containers
docker compose up --build

# Ou executar em background
docker compose up -d --build
```

A API estará disponível em: `http://localhost:3000/api`

**Para parar os containers:**

```bash
docker compose down
```

**Para visualizar os logs:**

```bash
docker compose logs -f app
```

### 💻 Opção 2: Desenvolvimento Local

Se preferir executar localmente sem Docker:

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento (hot reload)
npm run dev
```

> **Nota:** Você precisará de uma instância do MongoDB rodando localmente ou um MongoDB Atlas configurado.

---

## 🧪 Testando a API

### 1️⃣ Registrar um Usuário e Obter Token

Primeiro, você precisa criar uma conta. O token JWT será retornado automaticamente no registro.

**Endpoint:** `POST http://localhost:3000/api/auth/register`

**Body (JSON):**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta esperada (201 Created):**
```json
{
  "user": {
    "_id": "695271384651d5890f8433de",
    "email": "joao@example.com",
    "createdAt": "2025-12-29T12:00:00.000Z",
    "updatedAt": "2025-12-29T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTUyNzEzODQ2NTFkNTg5MGY4NDMzZGUiLCJpYXQiOjE3NjcwMTIzMzIsImV4cCI6MTc2NzYxNzEzMn0.LiVdE5pBs88BLewrLmfa6ksiebsGBBcXSl66UVnma2g"
}
```

> **✨ Dica:** Copie o `token` retornado. Você precisará dele para criar pedidos!

> **💡 Já tem uma conta?** Faça login em `POST /api/auth/login` com o mesmo formato de body para obter um novo token.

### 2️⃣ Criar um Pedido

Agora você pode criar pedidos. Esta rota requer autenticação.

**Endpoint:** `POST http://localhost:3000/api/orders`

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "lab": "Laboratório ABC",
  "patient": "Maria Santos",
  "customer": "Hospital XYZ",
  "services": [
    {
      "name": "Hemograma Completo",
      "value": 50.00,
      "status": "PENDING"
    },
    {
      "name": "Raio-X Tórax",
      "value": 150.00,
      "status": "PENDING"
    }
  ]
}
```

**Resposta esperada (201 Created):**
```json
{
  "_id": "...",
  "lab": "Laboratório ABC",
  "patient": "Maria Santos",
  "customer": "Hospital XYZ",
  "state": "CREATED",
  "status": "ACTIVE",
  "services": [
    {
      "name": "Hemograma Completo",
      "value": 50,
      "status": "PENDING"
    },
    {
      "name": "Raio-X Tórax",
      "value": 150,
      "status": "PENDING"
    }
  ],
  "createdAt": "2025-12-29T12:00:00.000Z",
  "updatedAt": "2025-12-29T12:00:00.000Z"
}
```

### 3️⃣ Listar Pedidos

**Endpoint:** `GET http://localhost:3000/api/orders`

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Query Parameters (opcionais):**
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10)
- `state` - Filtrar por estado (CREATED, ANALYSIS, COMPLETED)

**Exemplos:**
```
GET /api/orders?page=1&limit=10
GET /api/orders?state=CREATED
GET /api/orders?page=2&limit=5&state=ANALYSIS
```

**Resposta esperada (200 OK):**
```json
{
  "orders": [
    {
      "_id": "...",
      "lab": "Laboratório ABC",
      "patient": "Maria Santos",
      "customer": "Hospital XYZ",
      "state": "CREATED",
      "status": "ACTIVE",
      "services": [...],
      "createdAt": "2025-12-29T12:00:00.000Z",
      "updatedAt": "2025-12-29T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

### 4️⃣ Avançar Estado do Pedido

Muda o estado do pedido para o próximo: CREATED → ANALYSIS → COMPLETED

**Endpoint:** `PATCH http://localhost:3000/api/orders/:id/advance`

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Exemplo:**
```
PATCH /api/orders/6952784c9e6bbf142c1580ce/advance
```

**Resposta esperada (200 OK):**
```json
{
  "_id": "6952784c9e6bbf142c1580ce",
  "lab": "Laboratório ABC",
  "patient": "Maria Santos",
  "customer": "Hospital XYZ",
  "state": "ANALYSIS",
  "status": "ACTIVE",
  "services": [...],
  "createdAt": "2025-12-29T12:00:00.000Z",
  "updatedAt": "2025-12-29T12:05:00.000Z"
}
```

---

## 📚 Documentação da API

### 🔐 Autenticação

Todas as rotas de pedidos (`/api/orders/*`) requerem autenticação via JWT.

**Como autenticar:**
1. Faça login ou registre-se para obter um token
2. Adicione o header `Authorization: Bearer {token}` em todas as requisições protegidas

### 📊 Estados do Pedido

Os pedidos seguem um fluxo de estados:

- `CREATED` - Pedido criado
- `ANALYSIS` - Em análise
- `COMPLETED` - Concluído

### ✔️ Status do Pedido

- `ACTIVE` - Pedido ativo
- `DELETED` - Pedido deletado (soft delete)

### 🔧 Status do Serviço

- `PENDING` - Serviço pendente
- `DONE` - Serviço concluído

### 🌐 Endpoints Disponíveis

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/api/auth/register` | Não | Registrar novo usuário |
| POST | `/api/auth/login` | Não | Fazer login |
| POST | `/api/orders` | Sim | Criar novo pedido |
| GET | `/api/orders` | Sim | Listar pedidos com paginação |
| PATCH | `/api/orders/:id/advance` | Sim | Avançar estado do pedido |

---

## 🔬 Testes

O projeto possui uma suíte completa de testes unitários e de integração para garantir a qualidade e confiabilidade do código.

### 📊 Cobertura de Testes

✅ **31 testes passando**
- 13 testes unitários (order.service.test.ts)
- 18 testes de integração (order.service.integration.test.ts)

**Cobertura atual:** 100% das declarações (Statements) e 88.88% das ramificações (Branches)

### 🎯 O que é testado?

#### ✅ Transições de Estado
- ✓ Transição CREATED → ANALYSIS
- ✓ Transição ANALYSIS → COMPLETED
- ✓ Bloqueio de transição quando COMPLETED (estado final)
- ✓ Bloqueio de transição para pedidos DELETED
- ✓ Validação de fluxo linear (sem pulos de estados)
- ✓ Impossibilidade de transições reversas

#### ✅ Regras de Negócio
- ✓ Pedido deve ter pelo menos um serviço
- ✓ Valor total do pedido deve ser maior que zero
- ✓ Pedido sempre inicia com estado CREATED
- ✓ Pedido sempre inicia com status ACTIVE
- ✓ Impossibilidade de avançar pedidos deletados

#### ✅ Validações de Dados
- ✓ Pedido não encontrado retorna erro
- ✓ Estados e status são independentes
- ✓ Status do serviço não afeta transição do pedido
- ✓ Filtros e paginação funcionam corretamente

### 🚀 Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar testes com interface visual
npm run test:ui

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo watch (observação)
npm test -- --watch
```

### 📋 Exemplo de Saída

```bash
$ npm test

 ✓ src/services/order.service.integration.test.ts (18 tests) 4ms
 ✓ src/services/order.service.test.ts (13 tests) 6ms

 Test Files  2 passed (2)
      Tests  31 passed (31)
   Duration  291ms
```

### 📁 Estrutura dos Testes

```
src/
└── services/
    ├── order.service.ts                    # Serviço principal
    ├── order.service.test.ts               # Testes unitários (com mocks)
    └── order.service.integration.test.ts   # Testes de integração (sem mocks)
```

### 🔄 Testes de Transição de Estados

Os testes garantem que a lógica de transição de estados funciona corretamente:

```
Fluxo válido de estados:
CREATED → ANALYSIS → COMPLETED → [BLOQUEADO]

Transições bloqueadas:
COMPLETED → X (erro: "Order is already in final state")
DELETED → X (erro: "Cannot advance deleted order")
ANALYSIS → CREATED (não permitido - sem transições reversas)
```

### 📊 Cenários de Teste

| Cenário | Esperado | Status |
|---------|----------|--------|
| Avançar de CREATED para ANALYSIS | ✅ Sucesso | Passa |
| Avançar de ANALYSIS para COMPLETED | ✅ Sucesso | Passa |
| Tentar avançar COMPLETED | ❌ Erro | Passa |
| Tentar avançar pedido DELETED | ❌ Erro | Passa |
| Criar pedido sem serviços | ❌ Erro | Passa |
| Criar pedido com valor zero | ❌ Erro | Passa |
| Pedido não encontrado | ❌ Erro | Passa |
| Fluxo completo CREATED→ANALYSIS→COMPLETED | ✅ Sucesso | Passa |

---

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor em modo desenvolvimento com hot reload

# Build
npm run build           # Compila TypeScript para JavaScript

# Produção
npm start               # Inicia servidor em produção (requer build)

# Testes
npm test                # Executa testes com Vitest
npm run test:ui         # Executa testes com interface visual
npm run test:coverage   # Executa testes com cobertura de código

# Qualidade de Código
npm run lint            # Verifica problemas no código
npm run lint:fix        # Corrige problemas automaticamente
npm run format          # Formata código com Prettier
npm run format:check    # Verifica formatação do código
```

---

## 💻 Testando com cURL

Se preferir testar via linha de comando:

```bash
# Registrar usuário (recebe token automaticamente)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"senha123"}'

# Ou fazer login se já tem conta
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"senha123"}'

# Criar pedido (substitua SEU_TOKEN)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "lab":"Lab ABC",
    "patient":"Maria Santos",
    "customer":"Hospital XYZ",
    "services":[
      {"name":"Hemograma","value":50,"status":"PENDING"}
    ]
  }'

# Listar pedidos
curl -X GET http://localhost:3000/api/orders \
  -H "Authorization: Bearer SEU_TOKEN"

# Avançar estado (substitua ID_DO_PEDIDO)
curl -X PATCH http://localhost:3000/api/orders/ID_DO_PEDIDO/advance \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🔧 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | 3000 |
| `NODE_ENV` | Ambiente de execução | development |
| `MONGODB_URI` | URI de conexão do MongoDB | - |
| `JWT_SECRET` | Chave secreta para JWT | - |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | 7d |
| `API_PREFIX` | Prefixo das rotas da API | /api |

---

## ⚠️ Troubleshooting

### Erro: "Cannot POST /api/orders"

- Verifique se o servidor está rodando
- Certifique-se de que está usando o prefixo `/api` na URL
- Reconstrua os containers: `docker compose up --build`

### Erro: "Authorization header missing"

- Você está tentando acessar uma rota protegida sem autenticação
- Faça login e adicione o header `Authorization: Bearer {token}`

### Erro: "Invalid authorization format"

- Verifique se o header está no formato correto: `Bearer {token}`
- Certifique-se de ter um espaço entre "Bearer" e o token

### Erro de conexão com MongoDB

- Verifique se a `MONGODB_URI` está correta no arquivo `.env`
- Se usar MongoDB Atlas, verifique se seu IP está na whitelist
- Certifique-se de que as credenciais estão corretas

---

## 📄 Licença

ISC

---

## 👤 Autor

Desenvolvido por [isaqu3d](https://github.com/isaqu3d)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

**Dúvidas?** Abra uma [issue](https://github.com/isaqu3d/order-management/issues) no GitHub.
