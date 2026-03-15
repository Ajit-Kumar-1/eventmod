import fs from 'fs';
import type { User } from '../../Types.ts';
import { clientError, serverError, successResponse, unauthorizedResponse } from '../Middleware.ts';

const usersFilePath = './data/users.json';

export default function handler(
  req: Record<string, any>,
  res: any,
) {
  const { userId, region } = req.body;

  if (!userId) {
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
    const user = users.find((u: User) => u.userId === userId && u.region === region);

    if (!user) {
      return unauthorizedResponse(res, 'User not found in specified region');
    }

    return successResponse(res, 'Login successful');
  });
}