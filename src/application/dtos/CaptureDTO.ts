import type { Capture } from '@domain/entities/Capture';
import { MAX_TEAM_SIZE } from '@domain/entities/Capture';
import type { Trainer } from '@domain/entities/Trainer';
import type { BaseStats } from '@domain/value-objects/BaseStats';
import { totalStats } from '@domain/value-objects/BaseStats';

export interface CaptureDTO {
  id: string;
  pokedexNumber: number;
  name: string;
  nickname: string | null;
  types: string[];
  spriteUrl: string | null;
  height: number;
  weight: number;
  baseStats: BaseStats & { total: number };
  capturedAt: Date;
}

export interface TeamDTO {
  trainer: { id: string; name: string };
  size: number;
  maxSize: number;
  pokemons: CaptureDTO[];
}

export function toCaptureDTO(capture: Capture): CaptureDTO {
  return {
    id: capture.id,
    pokedexNumber: capture.pokedexNumber,
    name: capture.pokemonName,
    nickname: capture.nickname,
    types: capture.types,
    spriteUrl: capture.spriteUrl,
    height: capture.height,
    weight: capture.weight,
    baseStats: { ...capture.baseStats, total: totalStats(capture.baseStats) },
    capturedAt: capture.capturedAt,
  };
}

export function toTeamDTO(trainer: Trainer, captures: Capture[]): TeamDTO {
  return {
    trainer: { id: trainer.id, name: trainer.name },
    size: captures.length,
    maxSize: MAX_TEAM_SIZE,
    pokemons: captures.map(toCaptureDTO),
  };
}
