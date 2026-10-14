import { AppError } from '@shared/errors/AppError';

export class TrainerNotFoundError extends AppError {
  constructor(id: string) {
    super(`Treinador "${id}" não encontrado`, 404, 'TRAINER_NOT_FOUND');
  }
}

export class EmailAlreadyInUseError extends AppError {
  constructor(email: string) {
    super(`O e-mail ${email} já está em uso`, 409, 'EMAIL_ALREADY_IN_USE');
  }
}
