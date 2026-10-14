import type { PokedexEntryDTO } from '@application/dtos/PokedexEntryDTO';
import { toPokedexEntryDTO } from '@application/dtos/PokedexEntryDTO';
import { normalizePokemonName } from '@domain/entities/Pokemon';
import { PokemonNotFoundInPokedexError } from '@domain/errors/PokedexErrors';
import type { IPokeApiGateway } from '@domain/gateways/IPokeApiGateway';

export class SearchPokedexUseCase {
  constructor(private readonly pokeApi: IPokeApiGateway) {}

  async execute(name: string): Promise<PokedexEntryDTO> {
    const normalized = normalizePokemonName(name);
    const entry = await this.pokeApi.findByName(normalized);
    if (!entry) {
      throw new PokemonNotFoundInPokedexError(normalized);
    }
    return toPokedexEntryDTO(entry);
  }
}
