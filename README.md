# PokéManager API

API REST para gerenciar um catálogo de pokémons, treinadores e seus times.
Trabalho da disciplina de Projeto de Banco de Dados (UFF - Rio das Ostras).

## Stack

- Node.js 20+ e TypeScript (strict)
- Express 5
- PostgreSQL + Prisma ORM
- Zod para validação
- Axios para consumir a [PokéAPI](https://pokeapi.co)
- Swagger UI (OpenAPI 3.0)
- ESLint + Prettier

## Estrutura

O projeto segue Clean Architecture, separado em camadas:

```
src/
├── domain/          # entidades, regras, erros e contratos (repositórios e gateway)
├── application/     # casos de uso e DTOs de saída
├── infrastructure/  # implementações concretas
│   ├── database/    #   repositórios in-memory e Prisma
│   ├── providers/   #   gateway da PokéAPI
│   └── http/        #   controllers, rotas, schemas Zod, middlewares e docs
├── main/            # composition root, app e server
└── shared/          # AppError, base de todos os erros tratados
prisma/
├── schema.prisma
├── migrations/
└── seed.ts
```

O domínio e os casos de uso só conhecem as interfaces (`IPokemonRepository`, `ITrainerRepository`,
`ICaptureRepository` e `IPokeApiGateway`). Quem escolhe a implementação é o `main/container.ts`.
Na entrega 1 o catálogo rodava com o `InMemoryPokemonRepository`; na entrega 2 ele foi trocado pelo
`PrismaPokemonRepository` sem nenhuma alteração no domínio.

## Banco de dados

Tabelas: `pokemons` (catálogo local), `trainers` e `captures` (pokémons capturados por cada treinador).

- Os tipos são um `ENUM` do Postgres (`pokemon_type`), então tipo inválido não entra nem por fora da API.
- Os atributos base ficam em colunas `SMALLINT` separadas.
- Quando um pokémon é capturado, os dados da PokéAPI são salvos na própria captura. Assim o time
  pode ser listado mesmo se a PokéAPI estiver fora do ar.
- A regra de no máximo 6 pokémons por treinador é validada no caso de uso **e** num trigger
  (`captures_team_size_limit`), que trava a linha do treinador antes de contar. Isso evita que duas
  capturas simultâneas passem do limite.

## Rodando localmente

Pré-requisitos: Node 20+ e Docker (ou um PostgreSQL rodando na máquina).

```bash
npm install
cp .env.example .env

# sobe o Postgres
docker compose up -d

# aplica as migrations e popula o catálogo
npm run db:deploy
npm run db:seed

npm run dev
```

A API sobe em `http://localhost:3333` e a documentação fica em `http://localhost:3333/api/docs`.

## Endpoints

| Método | Rota                                   | Descrição                                      |
| ------ | -------------------------------------- | ---------------------------------------------- |
| GET    | `/api/v1/pokemons`                     | Lista o catálogo (filtros `?type=` e `?name=`) |
| GET    | `/api/v1/pokemons/:id`                 | Busca por id                                   |
| POST   | `/api/v1/pokemons`                     | Cadastra um pokémon                            |
| PUT    | `/api/v1/pokemons/:id`                 | Atualiza (parcial)                             |
| DELETE | `/api/v1/pokemons/:id`                 | Remove                                         |
| GET    | `/api/v1/pokedex/search?name=pikachu`  | Consulta direto na PokéAPI                     |
| POST   | `/api/v1/trainers`                     | Cadastra um treinador                          |
| POST   | `/api/v1/trainers/:trainerId/captures` | Captura um pokémon (máx. 6 no time)            |
| GET    | `/api/v1/trainers/:trainerId/team`     | Lista o time do treinador                      |

Exemplo de captura:

```bash
curl -X POST http://localhost:3333/api/v1/trainers/<trainerId>/captures \
  -H "Content-Type: application/json" \
  -d '{ "pokemonName": "pikachu", "nickname": "Pika" }'
```

### Erros

Todos os erros seguem o mesmo formato, montado pelo middleware global:

```json
{
  "error": "TEAM_FULL",
  "message": "O time já está completo: um treinador pode ter no máximo 6 pokémons"
}
```

Erros de validação (Zod) voltam com `400` e a lista de campos em `details`.

## Scripts

| Script               | O que faz                             |
| -------------------- | ------------------------------------- |
| `npm run dev`        | servidor em modo watch                |
| `npm run build`      | gera o Prisma Client e compila        |
| `npm start`          | roda a versão compilada               |
| `npm run typecheck`  | checagem de tipos                     |
| `npm run lint`       | ESLint                                |
| `npm run format`     | formata o código com Prettier         |
| `npm run db:migrate` | cria/aplica migrations (dev)          |
| `npm run db:deploy`  | aplica as migrations existentes       |
| `npm run db:seed`    | popula o catálogo com alguns pokémons |
| `npm run db:studio`  | abre o Prisma Studio                  |
