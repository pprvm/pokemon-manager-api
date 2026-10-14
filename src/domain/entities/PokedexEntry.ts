import type { BaseStats } from '@domain/value-objects/BaseStats';
import type { PokemonType } from '@domain/value-objects/PokemonType';

/** Dados oficiais de uma espécie, como vêm da Pokédex externa (PokéAPI). */
export interface PokedexEntry {
  pokedexNumber: number;
  name: string;
  types: PokemonType[];
  height: number;
  weight: number;
  baseStats: BaseStats;
  abilities: string[];
  spriteUrl: string | null;
}
