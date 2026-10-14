import { POKEMON_TYPES } from '@domain/value-objects/PokemonType';

const errorResponse = (description: string) => ({
  description,
  content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
});

const trainerIdParam = {
  name: 'trainerId',
  in: 'path',
  required: true,
  schema: { type: 'string', format: 'uuid' },
};

const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer', minimum: 1 },
};

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'PokéManager API',
    version: '0.2.0',
    description:
      'API para gerenciar o catálogo de pokémons, treinadores e seus times. ' +
      'Projeto da disciplina de Projeto de Banco de Dados - UFF.',
  },
  servers: [{ url: '/api/v1' }],
  tags: [
    { name: 'Pokémons', description: 'Catálogo local de espécies' },
    { name: 'Pokédex', description: 'Consulta na PokéAPI oficial' },
    { name: 'Treinadores', description: 'Treinadores, capturas e times' },
  ],
  paths: {
    '/pokemons': {
      get: {
        tags: ['Pokémons'],
        summary: 'Lista os pokémons do catálogo',
        parameters: [
          {
            name: 'type',
            in: 'query',
            required: false,
            schema: { type: 'string', enum: POKEMON_TYPES },
          },
          {
            name: 'name',
            in: 'query',
            required: false,
            description: 'Busca parcial pelo nome',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Lista de pokémons',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Pokemon' } },
              },
            },
          },
          400: errorResponse('Filtro inválido'),
        },
      },
      post: {
        tags: ['Pokémons'],
        summary: 'Cadastra um pokémon manualmente',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/PokemonInput' } },
          },
        },
        responses: {
          201: {
            description: 'Criado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Pokemon' } } },
          },
          409: errorResponse('Nome ou número da pokédex já cadastrado'),
          422: errorResponse('Dados inválidos'),
        },
      },
    },
    '/pokemons/{id}': {
      parameters: [idParam],
      get: {
        tags: ['Pokémons'],
        summary: 'Busca um pokémon pelo id',
        responses: {
          200: {
            description: 'Pokémon encontrado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Pokemon' } } },
          },
          404: errorResponse('Não encontrado'),
        },
      },
      put: {
        tags: ['Pokémons'],
        summary: 'Atualiza os dados de um pokémon',
        description: 'Aceita atualização parcial: só os campos enviados são alterados.',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/PokemonUpdate' } },
          },
        },
        responses: {
          200: {
            description: 'Atualizado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Pokemon' } } },
          },
          404: errorResponse('Não encontrado'),
          409: errorResponse('Conflito de nome/número'),
          422: errorResponse('Dados inválidos'),
        },
      },
      delete: {
        tags: ['Pokémons'],
        summary: 'Remove um pokémon do catálogo',
        responses: { 204: { description: 'Removido' }, 404: errorResponse('Não encontrado') },
      },
    },
    '/pokedex/search': {
      get: {
        tags: ['Pokédex'],
        summary: 'Busca um pokémon direto na PokéAPI',
        parameters: [
          {
            name: 'name',
            in: 'query',
            required: true,
            schema: { type: 'string', example: 'pikachu' },
          },
        ],
        responses: {
          200: {
            description: 'Dados oficiais formatados',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/PokedexEntry' } },
            },
          },
          400: errorResponse('Parâmetro name ausente'),
          404: errorResponse('Não existe na Pokédex'),
          503: errorResponse('PokéAPI indisponível'),
        },
      },
    },
    '/trainers': {
      post: {
        tags: ['Treinadores'],
        summary: 'Cadastra um treinador',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/TrainerInput' } },
          },
        },
        responses: {
          201: {
            description: 'Criado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Trainer' } } },
          },
          400: errorResponse('Dados inválidos'),
          409: errorResponse('E-mail já cadastrado'),
        },
      },
    },
    '/trainers/{trainerId}/captures': {
      parameters: [trainerIdParam],
      post: {
        tags: ['Treinadores'],
        summary: 'Captura um pokémon para o treinador',
        description:
          'Busca os dados oficiais na PokéAPI e salva a captura no time do treinador. ' +
          'O time tem no máximo 6 pokémons.',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CaptureInput' } },
          },
        },
        responses: {
          201: {
            description: 'Capturado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Capture' } } },
          },
          400: errorResponse('Dados inválidos'),
          404: errorResponse('Treinador não encontrado ou pokémon inexistente na Pokédex'),
          422: errorResponse('Time completo (6 pokémons)'),
          503: errorResponse('PokéAPI indisponível'),
        },
      },
    },
    '/trainers/{trainerId}/team': {
      parameters: [trainerIdParam],
      get: {
        tags: ['Treinadores'],
        summary: 'Lista o time atual do treinador',
        responses: {
          200: {
            description: 'Time do treinador',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Team' } } },
          },
          404: errorResponse('Treinador não encontrado'),
        },
      },
    },
  },
  components: {
    schemas: {
      BaseStats: {
        type: 'object',
        required: ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'],
        properties: {
          hp: { type: 'integer', example: 35 },
          attack: { type: 'integer', example: 55 },
          defense: { type: 'integer', example: 40 },
          specialAttack: { type: 'integer', example: 50 },
          specialDefense: { type: 'integer', example: 50 },
          speed: { type: 'integer', example: 90 },
        },
      },
      PokemonInput: {
        type: 'object',
        required: ['pokedexNumber', 'name', 'types', 'height', 'weight', 'baseStats'],
        properties: {
          pokedexNumber: { type: 'integer', example: 25 },
          name: { type: 'string', example: 'pikachu' },
          types: {
            type: 'array',
            minItems: 1,
            maxItems: 2,
            items: { type: 'string', enum: POKEMON_TYPES },
            example: ['electric'],
          },
          height: { type: 'integer', description: 'Em decímetros', example: 4 },
          weight: { type: 'integer', description: 'Em hectogramas', example: 60 },
          baseStats: { $ref: '#/components/schemas/BaseStats' },
          spriteUrl: { type: 'string', nullable: true, format: 'uri' },
        },
      },
      PokemonUpdate: {
        type: 'object',
        description: 'Mesmos campos do cadastro, todos opcionais',
        properties: {
          pokedexNumber: { type: 'integer' },
          name: { type: 'string' },
          types: { type: 'array', items: { type: 'string', enum: POKEMON_TYPES } },
          height: { type: 'integer' },
          weight: { type: 'integer' },
          baseStats: { type: 'object' },
          spriteUrl: { type: 'string', nullable: true },
        },
      },
      Pokemon: {
        allOf: [
          { type: 'object', properties: { id: { type: 'integer', example: 1 } } },
          { $ref: '#/components/schemas/PokemonInput' },
          {
            type: 'object',
            properties: {
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        ],
      },
      PokedexEntry: {
        type: 'object',
        properties: {
          pokedexNumber: { type: 'integer', example: 25 },
          name: { type: 'string', example: 'pikachu' },
          types: { type: 'array', items: { type: 'string' }, example: ['electric'] },
          abilities: { type: 'array', items: { type: 'string' }, example: ['static'] },
          heightInMeters: { type: 'number', example: 0.4 },
          weightInKg: { type: 'number', example: 6 },
          baseStats: { $ref: '#/components/schemas/BaseStatsWithTotal' },
          spriteUrl: { type: 'string', nullable: true },
        },
      },
      BaseStatsWithTotal: {
        allOf: [
          { $ref: '#/components/schemas/BaseStats' },
          { type: 'object', properties: { total: { type: 'integer', example: 320 } } },
        ],
      },
      TrainerInput: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', example: 'Ash Ketchum' },
          email: { type: 'string', format: 'email', example: 'ash@pallet.com' },
        },
      },
      Trainer: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CaptureInput: {
        type: 'object',
        required: ['pokemonName'],
        properties: {
          pokemonName: { type: 'string', example: 'pikachu' },
          nickname: { type: 'string', nullable: true, example: 'Pika' },
        },
      },
      Capture: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          pokedexNumber: { type: 'integer' },
          name: { type: 'string' },
          nickname: { type: 'string', nullable: true },
          types: { type: 'array', items: { type: 'string' } },
          spriteUrl: { type: 'string', nullable: true },
          height: { type: 'integer' },
          weight: { type: 'integer' },
          baseStats: { $ref: '#/components/schemas/BaseStatsWithTotal' },
          capturedAt: { type: 'string', format: 'date-time' },
        },
      },
      Team: {
        type: 'object',
        properties: {
          trainer: {
            type: 'object',
            properties: { id: { type: 'string' }, name: { type: 'string' } },
          },
          size: { type: 'integer', example: 1 },
          maxSize: { type: 'integer', example: 6 },
          pokemons: { type: 'array', items: { $ref: '#/components/schemas/Capture' } },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'POKEMON_NOT_FOUND' },
          message: { type: 'string' },
          details: {},
        },
      },
    },
  },
};
