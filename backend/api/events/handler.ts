import fs from 'fs';
import { Status, type Event, type User } from '../../Types.ts';
import { claimedByMe, claimValid } from '../Utils.ts';
import { clientError, serverError, unauthorizedResponse } from '../Middleware.ts';

export default function handler(
  req: Record<string, any>,
  res: any,
) {
  const { userId, status } = req.query;

  if (!userId) {
    return clientError(res, 'User ID query parameter is required');
  }

  if (!status) {
    return clientError(res, 'Status query parameter is required');
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

      let events: Event[] = JSON.parse(data);

      if (status === Status.OPEN) {
        return res.json(events.filter((e: Event) => e.region === region
          && (e.status === Status.OPEN
            || (e.status === Status.CLAIMED && !claimValid(e)))));
      }

      if (status === Status.CLAIMED) {
        return res.json(events.filter((e: Event) => e.region === region
          && e.status === Status.CLAIMED && claimedByMe(e, userId)));
      }

      if (status === Status.ASSIGNED) {
        return res.json(events.filter((e: Event) => e.region === region
          && e.status === Status.ASSIGNED && e.claimedBy === userId));
      }

      return clientError(res, 'Invalid status query parameter');
    });
  });

}