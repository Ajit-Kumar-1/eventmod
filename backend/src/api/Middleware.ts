import type { Request, Response, NextFunction } from 'express';
import { clientError } from './CommonResponses.ts';

export function corsMiddleware(req: Request, res: Response, next: NextFunction): void {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}

export function checkUserIdParam(req: Request, res: Response, next: NextFunction): void {
  const { userId } = req.query;

  if (!userId) {
    clientError(res, 'User ID query parameter is required');
    return;
  }

  next();
};