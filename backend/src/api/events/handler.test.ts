import { beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import handler from './handler.ts';
import { Status } from '../../Types.ts';

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
  mockImplementationOnce: (fn: (...args: unknown[]) => void) => typeof mockReadFile;
};

describe('events handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when status is missing', () => {
    const res = buildRes();

    handler({ query: { userId: 'eu_mod_1' } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Status query parameter is required' });
  });

  it('returns 401 when user is not found', () => {
    const res = buildRes();
    mockReadFile.mockImplementation((...args: unknown[]) => {
      const cb = args[2] as (err: Error | null, data: string) => void;
      cb(null, JSON.stringify([{ userId: 'us_mod_1', region: 'us' }]));
    });

    handler({ query: { userId: 'eu_mod_1', status: Status.OPEN } }, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('returns filtered open events for user region', () => {
    const res = buildRes();

    mockReadFile
      .mockImplementationOnce((...args: unknown[]) => {
        const cb = args[2] as (err: Error | null, data: string) => void;
        cb(null, JSON.stringify([{ userId: 'eu_mod_1', region: 'eu' }]));
      })
      .mockImplementationOnce((...args: unknown[]) => {
        const cb = args[2] as (err: Error | null, data: string) => void;
        cb(null, JSON.stringify([
          { eventId: 1, region: 'eu', status: 'open', claimedAt: null, claimedBy: null },
          { eventId: 2, region: 'us', status: 'open', claimedAt: null, claimedBy: null },
        ]));
      });

    handler({ query: { userId: 'eu_mod_1', status: Status.OPEN } }, res);

    expect(res.json).toHaveBeenCalledWith([
      { eventId: 1, region: 'eu', status: 'open', claimedAt: null, claimedBy: null },
    ]);
  });
});
