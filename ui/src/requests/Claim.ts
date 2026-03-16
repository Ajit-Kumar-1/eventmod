import { requestJson } from './client.ts';

type ClaimResponse = {
  message?: string;
}

export default function claim({ eventId, userId }: { eventId: string; userId: string }) {
  return requestJson<ClaimResponse>('/claim', {
    method: 'PUT',
    body: JSON.stringify({ eventId, userId }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
