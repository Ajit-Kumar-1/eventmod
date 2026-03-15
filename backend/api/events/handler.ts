import fs from 'fs';
import { Status, type Event, type User } from '../../data/Types.ts';
import { claimedBySomeoneElse } from '../Utils.ts';

export default function handler(
  req: Record<string, any>,
  res: any,
) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID query parameter is required' });
  }

  fs.readFile('./data/users.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load users data' });
    }

    const users: User[] = JSON.parse(data);
    const user = users.find((u: User) => u.userId === user_id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const region: string = user.region;

    fs.readFile('./data/events.json', 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to load events data' });
      }

      const events: Event[] = JSON.parse(data);
      const filteredEvents: Event[] = events
        .filter((e: Event) => e.region === region
          && (e.status === Status.OPEN
            || (e.status === Status.CLAIMED && !claimedBySomeoneElse(e, user_id))
            || (e.status === Status.ASSIGNED && e.claimedBy === user_id)
          ));
      res.json(filteredEvents);
    });
  });

}