export function getOpenEvents(userId: string) {
  return fetch(`http://localhost:3000/events?userId=${userId}&status=open`)
    .then(response => response.json());
}