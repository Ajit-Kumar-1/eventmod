import { beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import handler from './handler.ts';

vi.mock('fs', () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}));

type MockResponse = {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
};

const buildRes = (): MockResponse => {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };
  res.status.mockReturnValue(res);
  return res;
};

const mockReadFile = fs.readFile as unknown as {
  mockImplementation: (fn: (...args: unknown[]) => void) => void;
};

describe('login handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when userId is missing', () => {
    const res = buildRes();

    handler({ body: { region: 'eu' } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User ID query parameter is required' });
  });

  it('returns 500 when users file cannot be read', () => {
    const res = buildRes();
    mockReadFile.mockImplementation((...args: unknown[]) => {
      const cb = args[2] as (err: Error | null, data: string) => void;
      cb(new Error('read failed'), '');
    });

    handler({ body: { userId: 'eu_mod_1', region: 'eu' } }, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to load users data' });
  });

  it('returns 401 when user is not found in region', () => {
    const res = buildRes();
    mockReadFile.mockImplementation((...args: unknown[]) => {
      const cb = args[2] as (err: Error | null, data: string) => void;
      cb(null, JSON.stringify([{ userId: 'eu_mod_1', region: 'eu' }]));
    });

    handler({ body: { userId: 'us_mod_1', region: 'us' } }, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found in specified region' });
  });

  it('returns 200 for valid login', () => {
    const res = buildRes();
    mockReadFile.mockImplementation((...args: unknown[]) => {
      const cb = args[2] as (err: Error | null, data: string) => void;
      cb(null, JSON.stringify([{ userId: 'eu_mod_1', region: 'eu' }]));
    });

    handler({ body: { userId: 'eu_mod_1', region: 'eu' } }, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Login successful' });
  });
});
