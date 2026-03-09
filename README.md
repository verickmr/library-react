# Librarium

Gerenciador de livros e autores construído com React, TypeScript e Ant Design, organizado como monorepo com Turborepo.

---

## Tecnologias

- **Turborepo** — monorepo com pipelines de build e dev
- **React 19 + TypeScript** — interface e tipagem
- **Ant Design** — componentes de UI
- **TanStack Query** — gerenciamento de estado assíncrono e cache
- **Zustand** — estado de UI (modais)
- **localForage** — persistência de dados via IndexedDB
- **Vitest** — testes unitários
- **Storybook** — documentação de componentes
- **Docker + Nginx** — build e deploy com multi-stage

---

## Estrutura

```
library/
├── apps/
│   └── web/                  # Aplicação React (Vite, porta 3000)
├── packages/
│   ├── types/                # @library/types — interfaces Book e Author
│   ├── db/                   # @library/db — instâncias localForage
│   ├── services/             # @library/services — CRUD e testes
│   └── ui/                   # @library/ui — modais e Storybook
├── Dockerfile
├── docker-compose.yml
└── nginx.conf
```

---

## Pré-requisitos

- Node.js 22+
- npm 10+
- Docker (opcional)

---

## Instalação

```bash
git clone <repo-url>
cd library
npm install
```

---

## Desenvolvimento

```bash
# Rodar o app web
npm run dev

# Rodar Storybook
cd packages/ui
npx storybook dev -p 6006

# Rodar testes
npm run test
```

O app estará disponível em `http://localhost:3000`.

---

## Testes

```bash
cd packages/services
npx vitest run
```

8 testes cobrindo as operações CRUD de livros e autores.

---

## Docker

```bash
# Build
docker build -t librarium .

# Subir container
docker compose up
```

O app estará disponível em `http://localhost:8080`.

O build usa multi-stage: Node 22 Alpine compila o projeto e Nginx Alpine serve os arquivos estáticos com suporte a SPA (fallback para `index.html`).

---

## Funcionalidades

- Cadastro, visualização, edição e exclusão de autores
- Cadastro, visualização, edição e exclusão de livros
- Relacionamento entre livros e autores
- Exclusão em cascata — ao deletar um autor, seus livros são removidos
- Dados persistidos no IndexedDB via localForage
- Navegação entre páginas com React Router
