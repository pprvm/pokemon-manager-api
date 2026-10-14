import { POKEMON_TYPES } from '@domain/value-objects/PokemonType';

const errorResponse = (description: string) => ({
  description,
  content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
});

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
    version: '0.1.0',
    description:
      'API para gerenciar o catálogo de pokémons, treinadores e seus times. ' +
      'Projeto da disciplina de Projeto de Banco de Dados - UFF.',
  },
  servers: [{ url: '/api/v1' }],
  tags: [{ name: 'Pokémons', description: 'Catálogo local de espécies' }],
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
