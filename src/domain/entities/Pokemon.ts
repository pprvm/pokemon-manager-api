import { InvalidPokemonDataError } from '@domain/errors/PokemonErrors';
import type { BaseStats } from '@domain/value-objects/BaseStats';
import { STAT_KEYS } from '@domain/value-objects/BaseStats';
import type { PokemonType } from '@domain/value-objects/PokemonType';
import { isPokemonType } from '@domain/value-objects/PokemonType';

/** Espécie cadastrada no catálogo local. */
export interface Pokemon {
  id: number;
  pokedexNumber: number;
  name: string;
  types: PokemonType[];
  height: number; // decímetros (mesma unidade da PokéAPI)
  weight: number; // hectogramas
  baseStats: BaseStats;
  spriteUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type PokemonProps = Omit<Pokemon, 'id' | 'createdAt' | 'updatedAt'>;

const MAX_TYPES = 2;
const MAX_STAT_VALUE = 255; // maior valor possível de um atributo base nos jogos

export function normalizePokemonName(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Regras que valem independente de onde o pokémon foi salvo
 * (memória, banco, etc). Lança erro se algo estiver fora do esperado.
 */
export function assertValidPokemon(props: PokemonProps): void {
  const problems: string[] = [];

  if (!props.name || props.name.trim().length === 0) {
    problems.push('name não pode ser vazio');
  }

  if (!Number.isInteger(props.pokedexNumber) || props.pokedexNumber <= 0) {
    problems.push('pokedexNumber deve ser um inteiro positivo');
  }

  if (!Array.isArray(props.types) || props.types.length === 0) {
    problems.push('o pokémon precisa ter pelo menos um tipo');
  } else {
    if (props.types.length > MAX_TYPES) {
      problems.push(`um pokémon tem no máximo ${MAX_TYPES} tipos`);
    }
    const invalid = props.types.filter((t) => !isPokemonType(t));
    if (invalid.length > 0) {
      problems.push(`tipos inválidos: ${invalid.join(', ')}`);
    }
    if (new Set(props.types).size !== props.types.length) {
      problems.push('tipos repetidos');
    }
  }

  if (props.height <= 0 || props.weight <= 0) {
    problems.push('height e weight devem ser maiores que zero');
  }

  for (const key of STAT_KEYS) {
    const value = props.baseStats?.[key];
    if (!Number.isInteger(value) || value < 1 || value > MAX_STAT_VALUE) {
      problems.push(`baseStats.${key} deve estar entre 1 e ${MAX_STAT_VALUE}`);
    }
  }

  if (problems.length > 0) {
    throw new InvalidPokemonDataError(problems);
  }
}
