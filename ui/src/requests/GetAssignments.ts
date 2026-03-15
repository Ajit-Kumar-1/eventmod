export function getAssignments(user_id: string) {
  return fetch(`http://localhost:3000/assignments?user_id=${user_id}`)
    .then(response => response.json());
}