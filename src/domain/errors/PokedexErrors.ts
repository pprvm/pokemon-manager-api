import { AppError } from '@shared/errors/AppError';

export class PokemonNotFoundInPokedexError extends AppError {
  constructor(name: string) {
    super(`"${name}" não existe na Pokédex oficial`, 404, 'POKEDEX_ENTRY_NOT_FOUND');
  }
}

export class PokedexUnavailableError extends AppError {
  constructor() {
    super(
      'Não foi possível consultar a PokéAPI no momento. Tente novamente.',
      503,
      'POKEDEX_UNAVAILABLE',
    );
  }
}
