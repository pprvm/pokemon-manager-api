/**
 * Erro base da aplicação. Tudo que for "esperado" (regra de negócio,
 * recurso não encontrado, conflito...) deve estender essa classe para
 * o middleware conseguir devolver o status correto.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 400, code = 'APP_ERROR', details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
