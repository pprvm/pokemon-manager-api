import type { Pokemon } from '@domain/entities/Pokemon';
import type { IPokemonRepository, PokemonFilters } from '@domain/repositories/IPokemonRepository';

export class ListPokemonsUseCase {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  async execute(filters: PokemonFilters = {}): Promise<Pokemon[]> {
    return this.pokemonRepository.findAll(filters);
  }
}
