import { MAX_TEAM_SIZE } from '@domain/entities/Capture';
import { AppError } from '@shared/errors/AppError';

export class TeamFullError extends AppError {
  constructor() {
    super(
      `O time já está completo: um treinador pode ter no máximo ${MAX_TEAM_SIZE} pokémons`,
      422,
      'TEAM_FULL',
    );
  }
}
