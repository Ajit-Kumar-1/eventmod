import { requestJson } from './client.ts';

type LoginResponse = {
  message?: string;
}

export default function login(userId: string, region: string) {
  return requestJson<LoginResponse>('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, region })
  })
};