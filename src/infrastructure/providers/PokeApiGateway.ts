import axios, { type AxiosInstance } from 'axios';
import type { PokedexEntry } from '@domain/entities/PokedexEntry';
import { PokedexUnavailableError } from '@domain/errors/PokedexErrors';
import type { IPokeApiGateway } from '@domain/gateways/IPokeApiGateway';
import type { BaseStats } from '@domain/value-objects/BaseStats';
import type { PokemonType } from '@domain/value-objects/PokemonType';
import { isPokemonType } from '@domain/value-objects/PokemonType';

// Só os campos da resposta de /pokemon/{name} que a gente usa
interface PokeApiPokemonResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  sprites: {
    front_default: string | null;
    other?: { 'official-artwork'?: { front_default: string | null } };
  };
}

const STAT_NAME_MAP: Record<string, keyof BaseStats> = {
  hp: 'hp',
  attack: 'attack',
  defense: 'defense',
  'special-attack': 'specialAttack',
  'special-defense': 'specialDefense',
  speed: 'speed',
};

const CACHE_TTL_MS = 1000 * 60 * 60; // 1h - os dados oficiais praticamente não mudam

export class PokeApiGateway implements IPokeApiGateway {
  private readonly http: AxiosInstance;
  private readonly cache = new Map<string, { value: PokedexEntry; expiresAt: number }>();

  constructor(baseURL: string) {
    this.http = axios.create({ baseURL, timeout: 5000 });
  }

  async findByName(name: string): Promise<PokedexEntry | null> {
    const cached = this.cache.get(name);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    try {
      const { data } = await this.http.get<PokeApiPokemonResponse>(
        `/pokemon/${encodeURIComponent(name)}`,
      );
      const entry = this.toEntry(data);
      this.cache.set(name, { value: entry, expiresAt: Date.now() + CACHE_TTL_MS });
      return entry;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new PokedexUnavailableError();
    }
  }

  private toEntry(data: PokeApiPokemonResponse): PokedexEntry {
    const baseStats: BaseStats = {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
    };
    for (const { stat, base_stat } of data.stats) {
      const key = STAT_NAME_MAP[stat.name];
      if (key) baseStats[key] = base_stat;
    }

    const types = [...data.types]
      .sort((a, b) => a.slot - b.slot)
      .map((t) => t.type.name)
      .filter((t): t is PokemonType => isPokemonType(t));

    return {
      pokedexNumber: data.id,
      name: data.name,
      types,
      height: data.height,
      weight: data.weight,
      baseStats,
      abilities: data.abilities.map((a) => a.ability.name),
      spriteUrl:
        data.sprites.other?.['official-artwork']?.front_default ?? data.sprites.front_default,
    };
  }
}
