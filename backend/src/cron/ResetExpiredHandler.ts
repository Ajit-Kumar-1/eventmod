import fs from 'fs';
import { Status, type Event } from '../Types.ts';
import { claimValid } from '../Utils.ts';

export default function resetExpired() {
  fs.readFile('./data/events.json', 'utf8', (err, eventData) => {
    if (err) return console.log('Failed to read event data');

    let expiredCount: number = 0;
    let claimedCount: number = 0;
    let assignedCount: number = 0;

    let events: Event[] = JSON.parse(eventData);
    events = events.map((e: Event) => {
      if (e.status === Status.CLAIMED && !claimValid(e)) {
        expiredCount++;
        return { ...e, status: Status.OPEN, claimedBy: null, claimedAt: null };
      }
      if (e.status === Status.CLAIMED) claimedCount++;
      if (e.status === Status.ASSIGNED) assignedCount++;
      return e;
    });

    console.log('Expired claims: ', expiredCount);
    console.log('Active claims: ', claimedCount);
    console.log('Total assigned: ', assignedCount);

    fs.writeFile('./data/events.json', JSON.stringify(events, null, 2), (err) => {
      if (err) return console.warn('Failed to update event data');
      return console.log('Event statuses updated');
    });
  });
}