import fs from 'fs';
import { Region, Status, type Event, type User } from '../../Types.ts';
import { claimedByMe } from '../../Utils.ts';
import { clientError, serverError, successResponse, unauthorizedResponse } from '../CommonResponses.ts';

export default function handler(
  req: Record<string, any>,
  res: any,
) {
  const { userId, eventId } = req.body;

  if (!eventId) {
    return clientError(res, 'Event ID query parameter is required');
  }
  if (!userId) {
    return clientError(res, 'User ID query parameter is required');
  }

  fs.readFile('./data/users.json', 'utf8', (err, userData) => {
    if (err) {
      return serverError(res, 'Failed to load users data');
    }

    const users: User[] = JSON.parse(userData);
    const user: User | undefined = users.find((u: any) => u.userId === userId);

    if (!user) {
      return unauthorizedResponse(res, 'User not found');
    }

    const region: Region = user.region;
    fs.readFile('./data/events.json', 'utf8', (err, eventData) => {
      if (err) {
        return serverError(res, 'Failed to load events data');
      }
      const events: Event[] = JSON.parse(eventData);
      const event: Event | undefined = events.find((e: Event) => e.region === region
        && e.eventId === eventId && e.status === Status.CLAIMED
        && claimedByMe(e, userId));

      if (!event) {
        return clientError(res, 'No valid event found with specified id');
      }

      event.claimedAt = new Date();
      event.claimedBy = userId;
      event.status = Status.ASSIGNED;
      fs.writeFile('./data/events.json', JSON.stringify(events, null, 2), (err) => {
        if (err) {
          return serverError(res, 'Failed to update event data');
        }
        return successResponse(res, 'Event assigned successfully');
      });
    });
  });
}