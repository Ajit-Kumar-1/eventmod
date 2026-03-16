import type { Request, Response } from 'express';
import { Region, Status, type User } from '../../Types.ts';
import { clientError, serverError, successResponse, unauthorizedResponse } from '../CommonResponses.ts';
import pool from '../../db.ts';

export default async function handler(
  req: Request,
  res: Response,
) {
  const { userId, eventId } = req.body;

  if (!userId || typeof userId !== 'string') {
    return clientError(res, 'User ID body parameter is required');
  }

  const parsedEventId = Number(eventId);
  if (!Number.isInteger(parsedEventId)) {
    return clientError(res, 'Event ID body parameter is required');
  }

  try {
    const { rows: users } = await pool.query('SELECT region FROM users WHERE user_id = $1', [userId]);

    if (users.length === 0) {
      return unauthorizedResponse(res);
    }

    const user: User = users[0];
    const region: Region = user.region;

    const acknowledgeResult = await pool.query(
      `UPDATE events
       SET status = $1
       WHERE event_id = $2
         AND region = $3
         AND status = $4
         AND claimed_by = $5
         AND claimed_at > now() - interval '15 minutes'
       RETURNING 1`,
      [Status.ASSIGNED, parsedEventId, region, Status.CLAIMED, userId],
    );

    if (acknowledgeResult.rowCount === 0) {
      return clientError(res, 'Event not found or cannot be assigned');
    }

    return successResponse(res, 'Event assigned successfully');
  } catch {
    return serverError(res, 'Failed to update event data');
  }
}