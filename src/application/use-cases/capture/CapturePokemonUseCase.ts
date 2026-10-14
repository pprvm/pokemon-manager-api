import type { CaptureDTO } from '@application/dtos/CaptureDTO';
import { toCaptureDTO } from '@application/dtos/CaptureDTO';
import { isTeamFull } from '@domain/entities/Capture';
import { normalizePokemonName } from '@domain/entities/Pokemon';
import { TeamFullError } from '@domain/errors/CaptureErrors';
import { PokemonNotFoundInPokedexError } from '@domain/errors/PokedexErrors';
import { TrainerNotFoundError } from '@domain/errors/TrainerErrors';
import type { IPokeApiGateway } from '@domain/gateways/IPokeApiGateway';
import type { ICaptureRepository } from '@domain/repositories/ICaptureRepository';
import type { ITrainerRepository } from '@domain/repositories/ITrainerRepository';

export interface CapturePokemonInput {
  trainerId: string;
  pokemonName: string;
  nickname?: string | null;
}

export class CapturePokemonUseCase {
  constructor(
    private readonly trainerRepository: ITrainerRepository,
    private readonly captureRepository: ICaptureRepository,
    private readonly pokeApi: IPokeApiGateway,
  ) {}

  async execute({ trainerId, pokemonName, nickname }: CapturePokemonInput): Promise<CaptureDTO> {
    const trainer = await this.trainerRepository.findById(trainerId);
    if (!trainer) {
      throw new TrainerNotFoundError(trainerId);
    }

    // checa o limite antes de chamar a API externa, que é a parte mais lenta
    const teamSize = await this.captureRepository.countByTrainerId(trainerId);
    if (isTeamFull(teamSize)) {
      throw new TeamFullError();
    }

    const name = normalizePokemonName(pokemonName);
    const entry = await this.pokeApi.findByName(name);
    if (!entry) {
      throw new PokemonNotFoundInPokedexError(name);
    }

    const capture = await this.captureRepository.create({
      trainerId,
      pokedexNumber: entry.pokedexNumber,
      pokemonName: entry.name,
      nickname: nickname?.trim() || null,
      types: entry.types,
      height: entry.height,
      weight: entry.weight,
      baseStats: entry.baseStats,
      spriteUrl: entry.spriteUrl,
    });

    return toCaptureDTO(capture);
  }
}
