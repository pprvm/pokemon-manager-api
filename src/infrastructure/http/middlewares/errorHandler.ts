import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '@shared/errors/AppError';

/**
 * Middleware global de erros. Qualquer erro lançado nos controllers/use cases
 * cai aqui (o Express 5 já repassa erros de handlers async).
 */
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
      ...(err.details !== undefined && { details: err.details }),
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Dados da requisição inválidos',
      details: err.issues.map((issue) => ({
        field: issue.path.join('.') || null,
        message: issue.message,
      })),
    });
  }

  // fallback caso duas requisições passem pela checagem do use case ao mesmo tempo
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'CONFLICT', message: 'Registro duplicado' });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Registro não encontrado' });
    }
  }

  // body com JSON mal formado (vem do express.json)
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'INVALID_JSON', message: 'JSON mal formado' });
  }

  console.error(`[${req.method} ${req.originalUrl}]`, err);
  return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Erro interno do servidor' });
}
