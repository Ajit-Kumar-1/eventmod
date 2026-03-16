export function getOpenEvents(userId: string) {
  return fetch(`http://localhost:3000/events?userId=${userId}`)
    .then(response => response.json());
}