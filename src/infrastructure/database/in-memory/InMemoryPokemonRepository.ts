import type { Pokemon, PokemonProps } from '@domain/entities/Pokemon';
import { PokemonNotFoundError } from '@domain/errors/PokemonErrors';
import type { IPokemonRepository, PokemonFilters } from '@domain/repositories/IPokemonRepository';

export class InMemoryPokemonRepository implements IPokemonRepository {
  private items: Pokemon[] = [];
  private nextId = 1;

  constructor(initialData: PokemonProps[] = []) {
    for (const data of initialData) {
      this.insert(data);
    }
  }

  findAll(filters: PokemonFilters = {}): Promise<Pokemon[]> {
    let result = this.items;

    if (filters.type) {
      const type = filters.type;
      result = result.filter((p) => p.types.includes(type));
    }
    if (filters.name) {
      const term = filters.name.toLowerCase();
      result = result.filter((p) => p.name.includes(term));
    }

    const sorted = [...result].sort((a, b) => a.pokedexNumber - b.pokedexNumber);
    return Promise.resolve(sorted.map(clone));
  }

  findById(id: number): Promise<Pokemon | null> {
    const found = this.items.find((p) => p.id === id);
    return Promise.resolve(found ? clone(found) : null);
  }

  findByName(name: string): Promise<Pokemon | null> {
    const found = this.items.find((p) => p.name === name);
    return Promise.resolve(found ? clone(found) : null);
  }

  findByPokedexNumber(pokedexNumber: number): Promise<Pokemon | null> {
    const found = this.items.find((p) => p.pokedexNumber === pokedexNumber);
    return Promise.resolve(found ? clone(found) : null);
  }

  create(data: PokemonProps): Promise<Pokemon> {
    return Promise.resolve(clone(this.insert(data)));
  }

  update(id: number, data: Partial<PokemonProps>): Promise<Pokemon> {
    const index = this.items.findIndex((p) => p.id === id);
    const current = this.items[index];
    if (!current) {
      return Promise.reject(new PokemonNotFoundError(id));
    }

    const updated: Pokemon = {
      ...current,
      ...data,
      baseStats: { ...current.baseStats, ...data.baseStats },
      updatedAt: new Date(),
    };
    this.items[index] = updated;
    return Promise.resolve(clone(updated));
  }

  delete(id: number): Promise<void> {
    this.items = this.items.filter((p) => p.id !== id);
    return Promise.resolve();
  }

  private insert(data: PokemonProps): Pokemon {
    const now = new Date();
    const pokemon: Pokemon = { ...data, id: this.nextId++, createdAt: now, updatedAt: now };
    this.items.push(pokemon);
    return pokemon;
  }
}

// evita que quem chamou altere o objeto guardado na "tabela" por referência
function clone(pokemon: Pokemon): Pokemon {
  return { ...pokemon, types: [...pokemon.types], baseStats: { ...pokemon.baseStats } };
}
