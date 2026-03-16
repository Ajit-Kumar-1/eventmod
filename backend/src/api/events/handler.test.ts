import { beforeEach, describe, expect, it, vi } from 'vitest';
import handler from './handler.ts';
import pool from '../../db.ts';

vi.mock('../../db.ts', () => ({
  default: {
    query: vi.fn(),
  },
}));

type MockResponse = {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
};

function createResponse(): MockResponse {
  const res = {} as MockResponse;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

const mockedPool = pool as unknown as {
  query: ReturnType<typeof vi.fn>;
};

describe('events handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when userId query is missing', async () => {
    const req = { query: {} };
    const res = createResponse();

    await handler(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'User ID query parameter is required',
    });
    expect(mockedPool.query).not.toHaveBeenCalled();
  });

  it('returns 401 when user is not found', async () => {
    mockedPool.query.mockResolvedValueOnce({ rows: [] });

    const req = { query: { userId: 'mod-1' } };
    const res = createResponse();

    await handler(req as any, res as any);

    expect(mockedPool.query).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Request unauthorized' });
  });

  it('returns mapped events for valid user', async () => {
    const claimedAt = new Date('2026-01-01T10:00:00.000Z');

    mockedPool.query.mockResolvedValueOnce({ rows: [{ region: 'asia' }] });
    mockedPool.query.mockResolvedValueOnce({
      rows: [
        { event_id: '1', region: 'asia' },
      ],
    });
    mockedPool.query.mockResolvedValueOnce({
      rows: [
        { event_id: '2', region: 'asia', claimed_at: claimedAt },
      ],
    });
    mockedPool.query.mockResolvedValueOnce({
      rows: [
        { event_id: '3', region: 'asia' },
      ],
    });

    const req = { query: { userId: 'mod-1' } };
    const res = createResponse();

    await handler(req as any, res as any);

    expect(mockedPool.query).toHaveBeenCalledTimes(4);
    expect(res.json).toHaveBeenCalledWith({
      open: [{ eventId: '1', region: 'asia' }],
      claimed: [
        {
          eventId: '2',
          region: 'asia',
          claimedAt: '2026-01-01T10:00:00.000Z',
        },
      ],
      assigned: [{ eventId: '3', region: 'asia' }],
    });
  });

  it('returns 500 on database error', async () => {
    mockedPool.query.mockRejectedValueOnce(new Error('db failed'));

    const req = { query: { userId: 'mod-1' } };
    const res = createResponse();

    await handler(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to load events data',
    });
  });
});
