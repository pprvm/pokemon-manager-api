import type { Pokemon, PokemonProps } from '@domain/entities/Pokemon';
import type { PokemonType } from '@domain/value-objects/PokemonType';

export interface PokemonFilters {
  type?: PokemonType;
  name?: string;
}

export interface IPokemonRepository {
  findAll(filters?: PokemonFilters): Promise<Pokemon[]>;
  findById(id: number): Promise<Pokemon | null>;
  findByName(name: string): Promise<Pokemon | null>;
  findByPokedexNumber(pokedexNumber: number): Promise<Pokemon | null>;
  create(data: PokemonProps): Promise<Pokemon>;
  update(id: number, data: Partial<PokemonProps>): Promise<Pokemon>;
  delete(id: number): Promise<void>;
}
