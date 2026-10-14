import type { Pokemon } from '@domain/entities/Pokemon';
import { PokemonNotFoundError } from '@domain/errors/PokemonErrors';
import type { IPokemonRepository } from '@domain/repositories/IPokemonRepository';

export class GetPokemonByIdUseCase {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  async execute(id: number): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findById(id);
    if (!pokemon) {
      throw new PokemonNotFoundError(id);
    }
    return pokemon;
  }
}
