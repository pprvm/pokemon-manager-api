import type { Capture, CaptureProps } from '@domain/entities/Capture';

export interface ICaptureRepository {
  create(data: CaptureProps): Promise<Capture>;
  findByTrainerId(trainerId: string): Promise<Capture[]>;
  countByTrainerId(trainerId: string): Promise<number>;
}
