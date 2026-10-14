import type { PrismaClient } from '@prisma/client';
import type { Trainer, TrainerProps } from '@domain/entities/Trainer';
import type { ITrainerRepository } from '@domain/repositories/ITrainerRepository';

export class PrismaTrainerRepository implements ITrainerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // o model do Prisma tem o mesmo formato da entidade, então não precisa de mapper
  create(data: TrainerProps): Promise<Trainer> {
    return this.prisma.trainer.create({ data });
  }

  findById(id: string): Promise<Trainer | null> {
    return this.prisma.trainer.findUnique({ where: { id } });
  }

  findByEmail(email: string): Promise<Trainer | null> {
    return this.prisma.trainer.findUnique({ where: { email } });
  }
}
