import { Region, Status, type User } from '../../Types.ts';
import { clientError, serverError, successResponse, unauthorizedResponse } from '../CommonResponses.ts';
import pool from '../../db.ts';

export default async function handler(
  req: Record<string, any>,
  res: any,
) {
  const { userId, eventId } = req.body;

  if (!eventId) {
    return clientError(res, 'Event ID query parameter is required');
  }

  try {
    const { rows: users } = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);

    if (users.length === 0) {
      return unauthorizedResponse(res);
    }

    const user: User = users[0];
    const region: Region = user.region;

    const { rows: events } = await pool.query('SELECT 1 FROM events WHERE region = $1 AND event_id = $2 AND status = $3 AND claimed_by = $4 AND claimed_at > now() - interval \'15 minutes\'', [region, eventId, Status.CLAIMED, userId]);

    if (events.length === 0) {
      return clientError(res, 'Event not found or cannot be assigned');
    }

    await pool.query('UPDATE events SET status = $1 WHERE event_id = $2', [Status.ASSIGNED, eventId]);

    return successResponse(res, 'Event assigned successfully');
  } catch {
    return serverError(res, 'Failed to update event data');
  }
}