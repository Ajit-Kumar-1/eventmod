import fs from 'fs';
import { Status, type Event } from '../Types.ts';
import { claimValid } from './Utils.ts';

export default function resetExpired() {
  fs.readFile('./data/events.json', 'utf8', (err, eventData) => {
    if (err) return console.log('Failed to read event data');

    let events: Event[] = JSON.parse(eventData);
    events = events.map((e: Event) => {
      if (e.status === Status.CLAIMED && !claimValid(e)) {
        return { ...e, status: Status.OPEN, claimedBy: null, claimedAt: null };
      }
      return e;
    });

    fs.writeFile('./data/events.json', JSON.stringify(events, null, 2), (err) => {
      if (err) return console.warn('Failed to update event data');
      return console.log('Event statuses updated');
    });
  });
}