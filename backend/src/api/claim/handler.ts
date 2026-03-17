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

  if (!eventId || typeof eventId !== 'string') {
    return clientError(res, 'Event ID body parameter is required');
  }

  try {
    const { rows: users } = await pool.query('SELECT region FROM users WHERE user_id = $1', [userId]);

    if (users.length === 0) {
      return unauthorizedResponse(res);
    }

    const user: User = users[0];
    const region: Region = user.region;

    const claimResult = await pool.query(
      `UPDATE events
       SET status = $1, claimed_by = $2, claimed_at = now()
       WHERE event_id = $3
         AND region = $4
         AND (
           status = $5
           OR (status = $1 AND claimed_at < now() - interval '15 minutes')
         )
       RETURNING 1`,
      [
        Status.CLAIMED,
        userId,
        eventId,
        region,
        Status.OPEN,
      ],
    );

    if (claimResult.rowCount === 0) {
      return clientError(res, 'Event not found or cannot be claimed');
    }

    return successResponse(res, 'Event claimed successfully');
  } catch {
    return serverError(res, 'Failed to update event data');
  }

}