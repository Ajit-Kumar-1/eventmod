import type { Request, Response, NextFunction } from 'express';

export default function middleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  next();
}