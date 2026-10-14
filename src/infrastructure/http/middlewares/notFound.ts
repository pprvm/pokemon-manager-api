import type { Request, Response } from 'express';

export function notFound(req: Request, res: Response) {
  res
    .status(404)
    .json({ error: 'ROUTE_NOT_FOUND', message: `Rota ${req.method} ${req.path} não existe` });
}
