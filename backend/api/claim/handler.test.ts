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
  mockImplementationOnce: (fn: (...args: unknown[]) => void) => typeof mockReadFile;
};

const mockWriteFile = fs.writeFile as unknown as {
  mockImplementation: (fn: (...args: unknown[]) => void) => void;
};

describe('claim handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when eventId is missing', () => {
    const res = buildRes();

    handler({ body: { userId: 'eu_mod_1' } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Event ID query parameter is required' });
  });

  it('returns 200 for a valid claim and writes updated events', () => {
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
        ]));
      });

    mockWriteFile.mockImplementation((...args: unknown[]) => {
      const cb = args[2] as (err: Error | null) => void;
      cb(null);
    });

    handler({ body: { userId: 'eu_mod_1', eventId: 1 } }, res);

    expect(fs.writeFile).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event claimed successfully' });
  });
});
