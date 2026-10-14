import type { Trainer, TrainerProps } from '@domain/entities/Trainer';

export interface ITrainerRepository {
  create(data: TrainerProps): Promise<Trainer>;
  findById(id: string): Promise<Trainer | null>;
  findByEmail(email: string): Promise<Trainer | null>;
}
