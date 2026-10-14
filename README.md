# PokéManager API

API REST para gerenciar um catálogo de pokémons, treinadores e seus times.
Trabalho da disciplina de Projeto de Banco de Dados (UFF - Rio das Ostras).

## Stack

- Node.js 20+ e TypeScript (strict)
- Express 5
- Swagger UI (OpenAPI 3.0)
- ESLint + Prettier

## Estrutura

O projeto segue Clean Architecture, separado em camadas:

```
src/
├── domain/          # entidades, regras e contratos (interfaces). Não depende de nada.
├── application/     # casos de uso
├── infrastructure/  # implementações concretas: repositórios, http, docs
├── main/            # composition root, app e server
└── shared/          # erros base usados pelas outras camadas
```

A ideia é que o domínio e os casos de uso só conheçam a interface `IPokemonRepository`.
Quem decide qual implementação usar é o `main/container.ts`.

## Rodando

```bash
npm install
cp .env.example .env
npm run dev
```

A API sobe em `http://localhost:3333` e a documentação fica em `http://localhost:3333/api/docs`.

Por enquanto os dados ficam em memória (são perdidos ao reiniciar) e o servidor já sobe com
alguns pokémons cadastrados.

## Endpoints

| Método | Rota                   | Descrição                                      |
| ------ | ---------------------- | ---------------------------------------------- |
| GET    | `/api/v1/pokemons`     | Lista o catálogo (filtros `?type=` e `?name=`) |
| GET    | `/api/v1/pokemons/:id` | Busca por id                                   |
| POST   | `/api/v1/pokemons`     | Cadastra um pokémon                            |
| PUT    | `/api/v1/pokemons/:id` | Atualiza (parcial)                             |
| DELETE | `/api/v1/pokemons/:id` | Remove                                         |

## Scripts

| Script              | O que faz                     |
| ------------------- | ----------------------------- |
| `npm run dev`       | servidor em modo watch        |
| `npm run build`     | compila para `dist/`          |
| `npm start`         | roda a versão compilada       |
| `npm run typecheck` | checagem de tipos             |
| `npm run lint`      | ESLint                        |
| `npm run format`    | formata o código com Prettier |
