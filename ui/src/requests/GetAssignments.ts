export function getAssignments(userId: string) {
  return fetch(`http://localhost:3000/events?userId=${userId}&status=assigned`)
    .then(response => response.json());
}