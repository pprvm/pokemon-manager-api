import type { PokedexEntry } from '@domain/entities/PokedexEntry';
import type { BaseStats } from '@domain/value-objects/BaseStats';
import { totalStats } from '@domain/value-objects/BaseStats';

export interface PokedexEntryDTO {
  pokedexNumber: number;
  name: string;
  types: string[];
  abilities: string[];
  heightInMeters: number;
  weightInKg: number;
  baseStats: BaseStats & { total: number };
  spriteUrl: string | null;
}

// A PokéAPI usa decímetros e hectogramas; aqui já devolvemos em metros e kg
export function toPokedexEntryDTO(entry: PokedexEntry): PokedexEntryDTO {
  return {
    pokedexNumber: entry.pokedexNumber,
    name: entry.name,
    types: entry.types,
    abilities: entry.abilities,
    heightInMeters: entry.height / 10,
    weightInKg: entry.weight / 10,
    baseStats: { ...entry.baseStats, total: totalStats(entry.baseStats) },
    spriteUrl: entry.spriteUrl,
  };
}
