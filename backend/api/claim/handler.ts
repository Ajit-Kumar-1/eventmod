import fs from 'fs';
import { Region, Status, type Event, type User } from '../../data/Types.ts';
import { claimedBySomeoneElse } from '../Utils.ts';
import { clientError, serverError, successResponse, unauthorizedResponse } from '../Middleware.ts';

export default function handler(
  req: Record<string, any>,
  res: any,
) {
  const { user_id, event_id } = req.body;

  if (!event_id) {
    return clientError(res, 'Event ID query parameter is required');
  }
  if (!user_id) {
    return clientError(res, 'User ID query parameter is required');
  }

  fs.readFile('./data/users.json', 'utf8', (err, userData) => {
    if (err) {
      return serverError(res, 'Failed to load users data');
    }

    const users: User[] = JSON.parse(userData);
    const user: User | undefined = users.find((u: any) => u.user_id === user_id);

    if (!user) {
      return unauthorizedResponse(res, 'Invalid credentials');
    }

    const region: Region = user.region;
    fs.readFile('./data/events.json', 'utf8', (err, eventData) => {
      if (err) {
        return serverError(res, 'Failed to load events data');
      }

      const events: Event[] = JSON.parse(eventData);
      const event: Event | undefined = events.find((e: Event) => e.region === region
        && e.eventId === event_id
        && (e.status === Status.OPEN
          || (e.status === Status.CLAIMED && !claimedBySomeoneElse(e, user_id))));

      if (!event) {
        return clientError(res, 'No valid event found with specified id');
      }

      event.claimedAt = new Date();
      event.claimedBy = user_id;
      event.status = Status.CLAIMED;
      fs.writeFile('./data/events.json', JSON.stringify(events, null, 2), (err) => {
        if (err) {
          return serverError(res, 'Failed to update event data');
        }
        return successResponse(res, 'Event claimed successfully');
      });
    });
  });

}