export interface BaseStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export const STAT_KEYS: (keyof BaseStats)[] = [
  'hp',
  'attack',
  'defense',
  'specialAttack',
  'specialDefense',
  'speed',
];

export function totalStats(stats: BaseStats): number {
  return STAT_KEYS.reduce((sum, key) => sum + stats[key], 0);
}
