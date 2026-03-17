import type { Request, Response } from 'express';
import { Region } from '../../Types.ts';
import { clientError, serverError, successResponse, unauthorizedResponse } from '../CommonResponses.ts';
import pool from '../../db.ts';

const cache: Record<string, Record<string, boolean>> = {};

export default async function handler(
  req: Request,
  res: Response,
) {
  const { userId, region } = req.body;

  if (cache[userId]?.[region]) {
    return successResponse(res, 'Login successful (cached)');
  }

  if (!userId || typeof userId !== 'string') {
    return clientError(res, 'User ID body parameter is required');
  }

  if (!region || typeof region !== 'string') {
    return clientError(res, 'Region body parameter is required');
  }

  if (!Object.values(Region).includes(region as Region)) {
    return clientError(res, 'Region is invalid');
  }

  try {
    const { rows } = await pool.query('SELECT 1 FROM users WHERE user_id = $1 AND region = $2', [userId, region]);
    if (rows.length === 0) {
      return unauthorizedResponse(res, 'User not found in specified region');
    }

    cache[userId] = cache[userId] || {};
    cache[userId][region] = true;

    return successResponse(res, 'Login successful');
  } catch {
    return serverError(res, 'Failed to load users data');
  }
}