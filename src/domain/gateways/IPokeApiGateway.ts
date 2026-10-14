import type { PokedexEntry } from '@domain/entities/PokedexEntry';

export interface IPokeApiGateway {
  /** Retorna null quando o pokémon não existe na Pokédex oficial. */
  findByName(name: string): Promise<PokedexEntry | null>;
}
