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
  mockImplementationOnce: (fn: (...args: unknown[]) => void) => typeof mockReadFile;
};

const mockWriteFile = fs.writeFile as unknown as {
  mockImplementation: (fn: (...args: unknown[]) => void) => void;
};

describe('acknowledge handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when eventId is missing', () => {
    const res = buildRes();

    handler({ body: { userId: 'eu_mod_1' } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Event ID query parameter is required' });
  });

  it('returns 401 when user is not found', () => {
    const res = buildRes();

    mockReadFile.mockImplementation((...args: unknown[]) => {
      const cb = args[2] as (err: Error | null, data: string) => void;
      cb(null, JSON.stringify([{ userId: 'us_mod_1', region: 'us' }]));
    });

    handler({ body: { userId: 'eu_mod_1', eventId: 1 } }, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('returns 200 for valid acknowledge flow and writes updated events', () => {
    const res = buildRes();

    const freshClaimedAt = new Date(Date.now() - 2 * 60 * 1000).toISOString();

    mockReadFile
      .mockImplementationOnce((...args: unknown[]) => {
        const cb = args[2] as (err: Error | null, data: string) => void;
        cb(null, JSON.stringify([{ userId: 'eu_mod_1', region: 'eu' }]));
      })
      .mockImplementationOnce((...args: unknown[]) => {
        const cb = args[2] as (err: Error | null, data: string) => void;
        cb(null, JSON.stringify([
          {
            eventId: 1,
            region: 'eu',
            status: 'claimed',
            claimedAt: freshClaimedAt,
            claimedBy: 'eu_mod_1',
          },
        ]));
      });

    mockWriteFile.mockImplementation((...args: unknown[]) => {
      const cb = args[2] as (err: Error | null) => void;
      cb(null);
    });

    handler({ body: { userId: 'eu_mod_1', eventId: 1 } }, res);

    expect(fs.writeFile).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event assigned successfully' });
  });

  it('returns 500 when writing updated events fails', () => {
    const res = buildRes();

    const freshClaimedAt = new Date(Date.now() - 2 * 60 * 1000).toISOString();

    mockReadFile
      .mockImplementationOnce((...args: unknown[]) => {
        const cb = args[2] as (err: Error | null, data: string) => void;
        cb(null, JSON.stringify([{ userId: 'eu_mod_1', region: 'eu' }]));
      })
      .mockImplementationOnce((...args: unknown[]) => {
        const cb = args[2] as (err: Error | null, data: string) => void;
        cb(null, JSON.stringify([
          {
            eventId: 1,
            region: 'eu',
            status: 'claimed',
            claimedAt: freshClaimedAt,
            claimedBy: 'eu_mod_1',
          },
        ]));
      });

    mockWriteFile.mockImplementation((...args: unknown[]) => {
      const cb = args[2] as (err: Error | null) => void;
      cb(new Error('write failed'));
    });

    handler({ body: { userId: 'eu_mod_1', eventId: 1 } }, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update event data' });
  });
});
