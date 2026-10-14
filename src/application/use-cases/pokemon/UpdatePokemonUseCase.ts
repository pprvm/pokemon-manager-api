import type { Pokemon, PokemonProps } from '@domain/entities/Pokemon';
import { assertValidPokemon, normalizePokemonName } from '@domain/entities/Pokemon';
import { PokemonAlreadyRegisteredError, PokemonNotFoundError } from '@domain/errors/PokemonErrors';
import type { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import type { BaseStats } from '@domain/value-objects/BaseStats';

// baseStats também pode vir parcial (ex: só { speed: 100 })
export type UpdatePokemonInput = Partial<Omit<PokemonProps, 'baseStats'>> & {
  baseStats?: Partial<BaseStats>;
};

export class UpdatePokemonUseCase {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  async execute(id: number, input: UpdatePokemonInput): Promise<Pokemon> {
    const current = await this.pokemonRepository.findById(id);
    if (!current) {
      throw new PokemonNotFoundError(id);
    }

    const changes: UpdatePokemonInput = { ...input };
    if (changes.name !== undefined) {
      changes.name = normalizePokemonName(changes.name);
    }

    // valida o estado final (atual + alterações), não só o que veio no body
    const merged: PokemonProps = {
      pokedexNumber: changes.pokedexNumber ?? current.pokedexNumber,
      name: changes.name ?? current.name,
      types: changes.types ?? current.types,
      height: changes.height ?? current.height,
      weight: changes.weight ?? current.weight,
      baseStats: { ...current.baseStats, ...changes.baseStats },
      spriteUrl: changes.spriteUrl !== undefined ? changes.spriteUrl : current.spriteUrl,
    };
    assertValidPokemon(merged);

    if (merged.name !== current.name) {
      const sameName = await this.pokemonRepository.findByName(merged.name);
      if (sameName && sameName.id !== id) {
        throw new PokemonAlreadyRegisteredError('name', merged.name);
      }
    }
    if (merged.pokedexNumber !== current.pokedexNumber) {
      const sameNumber = await this.pokemonRepository.findByPokedexNumber(merged.pokedexNumber);
      if (sameNumber && sameNumber.id !== id) {
        throw new PokemonAlreadyRegisteredError('pokedexNumber', merged.pokedexNumber);
      }
    }

    return this.pokemonRepository.update(id, merged);
  }
}
