import fs from 'fs';
import type { User } from '../../data/Types.ts';

const usersFilePath = './data/users.json';

export default function handler(
  req: Record<string, any>,
  res: any,
) {
  const { user_id, region } = req.body;

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load users data' });
    }

    const users: User[] = JSON.parse(data);
    const user = users.find((u: User) => u.user_id === user_id && u.region === region);

    res.header("Access-Control-Allow-Origin", '*');
    if (user) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
}