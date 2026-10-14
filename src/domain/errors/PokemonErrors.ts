import { AppError } from '@shared/errors/AppError';

export class PokemonNotFoundError extends AppError {
  constructor(identifier: number | string) {
    super(`Pokémon "${identifier}" não encontrado no catálogo`, 404, 'POKEMON_NOT_FOUND');
  }
}

export class PokemonAlreadyRegisteredError extends AppError {
  constructor(field: 'name' | 'pokedexNumber', value: string | number) {
    super(`Já existe um pokémon com ${field} = ${value}`, 409, 'POKEMON_ALREADY_REGISTERED');
  }
}

export class InvalidPokemonDataError extends AppError {
  constructor(problems: string[]) {
    super('Dados do pokémon inválidos', 422, 'INVALID_POKEMON_DATA', problems);
  }
}
