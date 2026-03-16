import { clientError, serverError, successResponse, unauthorizedResponse } from '../CommonResponses.ts';
import pool from '../../db.ts';

export default async function handler(
  req: Record<string, any>,
  res: any,
) {
  const { userId, region } = req.body;

  if (!userId) {
    return clientError(res, 'User ID query parameter is required');
  }
  if (!region) {
    return clientError(res, 'Region query parameter is required');
  }

  try {
    const { rows } = await pool.query('SELECT 1 FROM users WHERE user_id = $1 AND region = $2', [userId, region]);
    if (rows.length === 0) {
      return unauthorizedResponse(res, 'User not found in specified region');
    }

    return successResponse(res, 'Login successful');
  } catch {
    return serverError(res, 'Failed to load users data');
  }
}