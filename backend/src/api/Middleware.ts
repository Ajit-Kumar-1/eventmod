import type { Request, Response, NextFunction } from 'express';
import { clientError } from './CommonResponses.ts';

export default function middleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // const { userId } = req.query;

  // if (!userId) {
  //   clientError(res, 'User ID query parameter is required');
  //   return;
  // }
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  next();
}