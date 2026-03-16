import type { Request, Response } from 'express';

export const Region = {
  ASIA: 'asia',
  EUROPE: 'eu',
  AMERICA: 'us'
} as const;

export type Region = typeof Region[keyof typeof Region];

export const Status = {
  OPEN: 'open',
  CLAIMED: 'claimed',
  ASSIGNED: 'assigned'
} as const;

export type Status = typeof Status[keyof typeof Status];

export type Event = {
  eventId: number;
  region: Region;
  status: Status;
  claimedAt: Date | null;
  claimedBy: string | null;
}

export type User = {
  userId: string;
  region: Region;
}

export const HTTPMethod = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete'
} as const;

export type HTTPMethod = typeof HTTPMethod[keyof typeof HTTPMethod];

export type RouteHandler = (
  req: Request,
  res: Response,
) => void | Promise<void>;

export type Route = {
  method: HTTPMethod;
  path: string;
  handler: RouteHandler;
}