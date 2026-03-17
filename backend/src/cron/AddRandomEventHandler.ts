import { Region, Status } from '../Types.ts';
import pool from '../db.ts';

const regions = Object.values(Region);

function createRandomEventId() {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1_000_000);
  return `evt_${timestamp}_${randomSuffix}`;
}

function pickRandomRegion() {
  const index = Math.floor(Math.random() * regions.length);
  return regions[index];
}

export default async function addRandomEvent() {
  const eventId = createRandomEventId();
  const region = pickRandomRegion();

  try {
    const result = await pool.query(
      `INSERT INTO events (event_id, region, status, claimed_by, claimed_at)
       VALUES ($1, $2, $3, NULL, NULL)
       ON CONFLICT (event_id) DO NOTHING
       RETURNING event_id`,
      [eventId, region, Status.OPEN],
    );

    if (result.rowCount === 1) {
      console.log(`Random event inserted: ${eventId} (${region})`);
      return;
    }

    console.warn(`Skipped random event insert due to duplicate ID: ${eventId}`);
  } catch {
    console.warn('Failed to insert random event');
  }
}