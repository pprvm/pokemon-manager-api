import type { PrismaClient } from '@prisma/client';
import type { Capture, CaptureProps } from '@domain/entities/Capture';
import { TeamFullError } from '@domain/errors/CaptureErrors';
import type { ICaptureRepository } from '@domain/repositories/ICaptureRepository';
import { CaptureMapper } from '../mappers/CaptureMapper';

export class PrismaCaptureRepository implements ICaptureRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CaptureProps): Promise<Capture> {
    try {
      const row = await this.prisma.capture.create({ data: CaptureMapper.toPersistence(data) });
      return CaptureMapper.toDomain(row);
    } catch (error) {
      // trigger do banco (migration team_size_trigger) barrou a inserção
      if (error instanceof Error && error.message.includes('TEAM_FULL')) {
        throw new TeamFullError();
      }
      throw error;
    }
  }

  async findByTrainerId(trainerId: string): Promise<Capture[]> {
    const rows = await this.prisma.capture.findMany({
      where: { trainerId },
      orderBy: { capturedAt: 'asc' },
    });
    return rows.map((row) => CaptureMapper.toDomain(row));
  }

  countByTrainerId(trainerId: string): Promise<number> {
    return this.prisma.capture.count({ where: { trainerId } });
  }
}
