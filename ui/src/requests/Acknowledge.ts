export default function acknowledge({ eventId, userId }: { eventId: string; userId: string }) {
  return fetch(`http://localhost:3000/acknowledge`, {
    method: 'PUT',
    body: JSON.stringify({ eventId, userId }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
}
