export function getEvents(user_id: string) {
  return fetch(`http://localhost:3000/events?user_id=${user_id}`)
    .then(response => response.json());
}