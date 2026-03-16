import type { EventsResponse } from '../Types.ts';
import { requestJson } from './client.ts';

export default function getOpenEvents(userId: string) {
  const query = new URLSearchParams({ userId });
  return requestJson<EventsResponse>(`/events?${query.toString()}`);
}