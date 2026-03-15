import fs from 'fs';
import type { User } from '../../data/Types.ts';
import { clientError, serverError, successResponse, unauthorizedResponse } from '../Middleware.ts';

const usersFilePath = './data/users.json';

export default function handler(
  req: Record<string, any>,
  res: any,
) {
  const { user_id, region } = req.body;

  if (!user_id) {
    return clientError(res, 'User ID query parameter is required');
  }
  if (!region) {
    return clientError(res, 'Region query parameter is required');
  }

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      return serverError(res, 'Failed to load users data');
    }

    const users: User[] = JSON.parse(data);
    const user = users.find((u: User) => u.userId === user_id && u.region === region);

    if (!user) {
      return unauthorizedResponse(res, "Invalid credentials");
    }

    return successResponse(res, 'Login successful');
  });
}