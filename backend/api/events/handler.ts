import fs from 'fs';
import { Status, type Event, type User } from '../../data/Types.ts';
import { claimedBySomeoneElse } from '../Utils.ts';
import { clientError, serverError, unauthorizedResponse } from '../Middleware.ts';

export default function handler(
  req: Record<string, any>,
  res: any,
) {
  const { userId } = req.query;

  if (!userId) {
    return clientError(res, 'User ID query parameter is required');
  }

  fs.readFile('./data/users.json', 'utf8', (err, data) => {
    if (err) {
      return serverError(res, 'Failed to load users data');
    }

    const users: User[] = JSON.parse(data);
    const user = users.find((u: User) => u.userId === userId);

    if (!user) {
      return unauthorizedResponse(res, 'User not found');
    }

    const region: string = user.region;

    fs.readFile('./data/events.json', 'utf8', (err, data) => {
      if (err) {
        return serverError(res, 'Failed to load events data');
      }

      const events: Event[] = JSON.parse(data);
      const filteredEvents: Event[] = events
        .filter((e: Event) => e.region === region
          && (e.status === Status.OPEN
            || (e.status === Status.CLAIMED && !claimedBySomeoneElse(e, userId))
          ));
      return res.json(filteredEvents);
    });
  });

}