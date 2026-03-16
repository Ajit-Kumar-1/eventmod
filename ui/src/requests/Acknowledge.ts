import { requestJson } from './client.ts';

type AcknowledgeResponse = {
  message?: string;
}

export default function acknowledge({ eventId, userId }: { eventId: string; userId: string }) {
  return requestJson<AcknowledgeResponse>('/acknowledge', {
    method: 'PUT',
    body: JSON.stringify({ eventId, userId }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
