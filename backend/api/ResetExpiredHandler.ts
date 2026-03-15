import fs from 'fs';
import { Status, type Event } from '../Types.ts';
import { claimValid } from './Utils.ts';

export default function resetExpired() {
  fs.readFile('./data/events.json', 'utf8', (err, eventData) => {
    if (err) return;

    let events: Event[] = JSON.parse(eventData);
    events = events.filter((e: Event) => !(e.status === Status.CLAIMED && !claimValid(e)));

    fs.writeFile('./data/events.json', JSON.stringify(events, null, 2), (err) => {
      if (err) {
        return console.error('Failed to update event data');
      }
      return console.log('Event claimed successfully');
    });
  });
}