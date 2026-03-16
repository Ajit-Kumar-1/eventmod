import { Region, Status, type User } from '../../Types.ts';
import { clientError, serverError, unauthorizedResponse } from '../CommonResponses.ts';
import pool from '../../db.ts';

export default async function handler(
  req: Record<string, any>,
  res: any,
) {
  const { userId } = req.query;

  if (!userId) {
    return clientError(res, 'User ID query parameter is required');
  }

  try {
    const { rows: users } = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);

    if (users.length === 0) {
      return unauthorizedResponse(res);
    }

    const user: User = users[0];
    const region: Region = user.region;

    const { rows: open } = await pool.query('SELECT * FROM events WHERE region = $1 AND (status = $2 OR (status = $3 AND NOT claimed_at > now() - interval \'15 minutes\'))', [region, Status.OPEN, Status.CLAIMED]);

    const { rows: claimed } = await pool.query('SELECT * FROM events WHERE region = $1 AND status = $2 AND claimed_by = $3 AND claimed_at > now() - interval \'15 minutes\'', [region, Status.CLAIMED, userId]);

    const { rows: assigned } = await pool.query('SELECT * FROM events WHERE region = $1 AND status = $2 AND claimed_by = $3', [region, Status.ASSIGNED, userId]);

    return res.json({ open, claimed, assigned });
  } catch {
    return serverError(res, 'Failed to load events data');
  }

}