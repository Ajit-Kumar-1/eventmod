import { Region, Status, type User } from '../../Types.ts';
import { clientError, unauthorizedResponse } from '../CommonResponses.ts';
import pool from '../../db.ts';

export default async function handler(
  req: Record<string, any>,
  res: any,
) {
  const { userId, status } = req.query;

  if (!userId) {
    return clientError(res, 'User ID query parameter is required');
  }

  if (!status) {
    return clientError(res, 'Status query parameter is required');
  }

  const { rows: users } = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);

  if (users.length === 0) {
    return unauthorizedResponse(res);
  }

  const user: User = users[0];
  const region: Region = user.region;

  if (status === Status.OPEN) {
    const { rows } = await pool.query('SELECT * FROM events WHERE region = $1 AND (status = $2 OR (status = $3 AND NOT claimed_at > now() - interval \'15 minutes\'))', [region, Status.OPEN, Status.CLAIMED]);
    return res.json(rows);
  }

  if (status === Status.CLAIMED) {
    const { rows } = await pool.query('SELECT * FROM events WHERE region = $1 AND status = $2 AND claimed_by = $3 AND claimed_at > now() - interval \'15 minutes\'', [region, Status.CLAIMED, userId]);
    return res.json(rows);
  }

  if (status === Status.ASSIGNED) {
    const { rows } = await pool.query('SELECT * FROM events WHERE region = $1 AND status = $2 AND claimed_by = $3', [region, Status.ASSIGNED, userId]);
    return res.json(rows);
  }

  return clientError(res, 'Invalid status query parameter');

}