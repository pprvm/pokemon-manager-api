import type { Trainer } from '@domain/entities/Trainer';
import { EmailAlreadyInUseError } from '@domain/errors/TrainerErrors';
import type { ITrainerRepository } from '@domain/repositories/ITrainerRepository';

export interface CreateTrainerInput {
  name: string;
  email: string;
}

export class CreateTrainerUseCase {
  constructor(private readonly trainerRepository: ITrainerRepository) {}

  async execute(input: CreateTrainerInput): Promise<Trainer> {
    const email = input.email.trim().toLowerCase();

    if (await this.trainerRepository.findByEmail(email)) {
      throw new EmailAlreadyInUseError(email);
    }

    return this.trainerRepository.create({ name: input.name.trim(), email });
  }
}
