import type { NextFunction, Request, Response } from 'express';
import { AppError } from '@shared/errors/AppError';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
      ...(err.details !== undefined && { details: err.details }),
    });
  }

  // body com JSON mal formado (vem do express.json)
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'INVALID_JSON', message: 'JSON mal formado' });
  }

  console.error(err);
  return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Erro interno do servidor' });
}
