export default function claim({ eventId, userId }: { eventId: string; userId: string }) {
  return fetch(`http://localhost:3000/claim`, {
    method: 'PUT',
    body: JSON.stringify({ eventId, userId }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
}
