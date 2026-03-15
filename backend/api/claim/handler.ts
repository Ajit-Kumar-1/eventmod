import fs from 'fs';
import { Region, Status, type Event, type User } from '../../data/Types.ts';
import { claimedBySomeoneElse } from '../Utils.ts';

export default function handler(
  req: Record<string, any>,
  res: any,
) {
  const { user_id, event_id } = req.body;

  if (!event_id) {
    return res.status(400).json({ error: 'Event ID query parameter is required' });
  }
  if (!user_id) {
    return res.status(400).json({ error: 'User ID query parameter is required' });
  }

  fs.readFile('./data/users.json', 'utf8', (err, userData) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load users data' });
    }

    const users: User[] = JSON.parse(userData);
    const user: User | undefined = users.find((u: any) => u.user_id === user_id);

    if (user) {
      const region: Region = user.region;
      fs.readFile('./data/events.json', 'utf8', (err, eventData) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to load events data' });
        }
        const events: Event[] = JSON.parse(eventData);
        const event: Event | undefined = events.find((e: Event) => e.region === region
          && e.eventId === event_id
          && (e.status === Status.OPEN
            || (e.status === Status.CLAIMED && !claimedBySomeoneElse(e, user_id))));
        if (!event) {
          return res.status(400).json({ error: 'No valid event found with specified id' });
        }
        event.claimedAt = new Date();
        event.claimedBy = user_id;
        event.status = Status.CLAIMED;
        fs.writeFile('./data/events.json', JSON.stringify(events, null, 2), (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to update event data' });
          }
          return res.status(200).json({ message: 'Event claimed successfully', event });
        });
      });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  });

}