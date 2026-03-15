export default function login(userId: string, region: string) {
  return fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, region })
  }).then(response => response.json())
};