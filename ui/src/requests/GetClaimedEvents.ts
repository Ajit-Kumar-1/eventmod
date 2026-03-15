export function getClaimedEvents(userId: string) {
  return fetch(`http://localhost:3000/events?userId=${userId}&status=claimed`)
    .then(response => response.json());
}