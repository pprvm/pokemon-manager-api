import type { Pokemon, PokemonProps } from '@domain/entities/Pokemon';
import { assertValidPokemon, normalizePokemonName } from '@domain/entities/Pokemon';
import { PokemonAlreadyRegisteredError } from '@domain/errors/PokemonErrors';
import type { IPokemonRepository } from '@domain/repositories/IPokemonRepository';

export type CreatePokemonInput = Omit<PokemonProps, 'spriteUrl'> & { spriteUrl?: string | null };

export class CreatePokemonUseCase {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  async execute(input: CreatePokemonInput): Promise<Pokemon> {
    const data: PokemonProps = {
      ...input,
      name: normalizePokemonName(input.name),
      spriteUrl: input.spriteUrl ?? null,
    };

    assertValidPokemon(data);

    if (await this.pokemonRepository.findByName(data.name)) {
      throw new PokemonAlreadyRegisteredError('name', data.name);
    }
    if (await this.pokemonRepository.findByPokedexNumber(data.pokedexNumber)) {
      throw new PokemonAlreadyRegisteredError('pokedexNumber', data.pokedexNumber);
    }

    return this.pokemonRepository.create(data);
  }
}
