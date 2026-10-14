import type { BaseStats } from '@domain/value-objects/BaseStats';
import type { PokemonType } from '@domain/value-objects/PokemonType';

/** Tamanho máximo do time ativo de um treinador (regra dos jogos). */
export const MAX_TEAM_SIZE = 6;

export interface Capture {
  id: string;
  trainerId: string;
  pokedexNumber: number;
  pokemonName: string;
  nickname: string | null;
  types: PokemonType[];
  height: number;
  weight: number;
  baseStats: BaseStats;
  spriteUrl: string | null;
  capturedAt: Date;
}

export type CaptureProps = Omit<Capture, 'id' | 'capturedAt'>;

export function isTeamFull(currentTeamSize: number): boolean {
  return currentTeamSize >= MAX_TEAM_SIZE;
}
