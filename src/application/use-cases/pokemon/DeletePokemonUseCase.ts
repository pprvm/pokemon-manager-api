import { PokemonNotFoundError } from '@domain/errors/PokemonErrors';
import type { IPokemonRepository } from '@domain/repositories/IPokemonRepository';

export class DeletePokemonUseCase {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  async execute(id: number): Promise<void> {
    const pokemon = await this.pokemonRepository.findById(id);
    if (!pokemon) {
      throw new PokemonNotFoundError(id);
    }
    await this.pokemonRepository.delete(id);
  }
}
