import type { TeamDTO } from '@application/dtos/CaptureDTO';
import { toTeamDTO } from '@application/dtos/CaptureDTO';
import { TrainerNotFoundError } from '@domain/errors/TrainerErrors';
import type { ICaptureRepository } from '@domain/repositories/ICaptureRepository';
import type { ITrainerRepository } from '@domain/repositories/ITrainerRepository';

export class GetTrainerTeamUseCase {
  constructor(
    private readonly trainerRepository: ITrainerRepository,
    private readonly captureRepository: ICaptureRepository,
  ) {}

  async execute(trainerId: string): Promise<TeamDTO> {
    const trainer = await this.trainerRepository.findById(trainerId);
    if (!trainer) {
      throw new TrainerNotFoundError(trainerId);
    }

    const captures = await this.captureRepository.findByTrainerId(trainerId);
    return toTeamDTO(trainer, captures);
  }
}
