import { Status } from '../Types.ts';
import pool from '../db.ts';

export default async function resetExpired() {
  try {
    const expiredResult = await pool.query(
      `WITH expired AS (
        UPDATE events
        SET status = $1, claimed_by = NULL, claimed_at = NULL
        WHERE status = $2
          AND claimed_at <= now() - interval '15 minutes'
        RETURNING 1
      )
      SELECT COUNT(*)::int AS expired_count FROM expired`,
      [Status.OPEN, Status.CLAIMED],
    );

    const statsResult = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE status = $1 AND claimed_at > now() - interval '15 minutes')::int AS claimed_count,
        COUNT(*) FILTER (WHERE status = $2)::int AS assigned_count
      FROM events`,
      [Status.CLAIMED, Status.ASSIGNED],
    );

    const expiredCount = expiredResult.rows[0]?.expired_count ?? 0;
    const claimedCount = statsResult.rows[0]?.claimed_count ?? 0;
    const assignedCount = statsResult.rows[0]?.assigned_count ?? 0;

    console.log('Expired claims: ', expiredCount);
    console.log('Active claims: ', claimedCount);
    console.log('Total assigned: ', assignedCount);
    console.log('Event statuses updated');
  } catch {
    console.warn('Failed to update event data');
  }
}