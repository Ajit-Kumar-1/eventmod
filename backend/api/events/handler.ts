import fs from 'fs';
import { Status, type Event, type User } from '../../data/Types.ts';

export default function handler(
  req: Record<string, any>,
  res: any,
) {
  const { user_id, region } = req.query;

  if (!region) {
    return res.status(400).json({ error: 'Region query parameter is required' });
  }
  if (!user_id) {
    return res.status(400).json({ error: 'User ID query parameter is required' });
  }

  fs.readFile('./data/events.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load events data' });
    }

    const events: Event[] = JSON.parse(data);
    const filteredEvents: Event[] = events
      .filter((e: Event) => e.region === region
        && (e.status === Status.OPEN
          || (e.status === Status.CLAIMED && e.claimedBy === user_id
            && e.claimedAt instanceof Date && new Date().valueOf() - new Date(e.claimedAt).valueOf() < 15 * 60 * 1000)
          || (e.status === Status.LOCKED && e.claimedBy === user_id)
        ));
    res.json(filteredEvents);
  });
}