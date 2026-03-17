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

describe('acknowledge handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for missing userId', async () => {
    const req = { body: { eventId: 'evt-42' } };
    const res = createResponse();

    await handler(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'User ID body parameter is required',
    });
    expect(mockedPool.query).not.toHaveBeenCalled();
  });

  it('returns 400 for missing eventId', async () => {
    const req = { body: { userId: 'mod-1' } };
    const res = createResponse();

    await handler(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Event ID body parameter is required',
    });
    expect(mockedPool.query).not.toHaveBeenCalled();
  });

  it('returns 401 when user is not found', async () => {
    mockedPool.query.mockResolvedValueOnce({ rows: [] });

    const req = { body: { userId: 'mod-1', eventId: 'evt-42' } };
    const res = createResponse();

    await handler(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Request unauthorized' });
    expect(mockedPool.query).toHaveBeenCalledTimes(1);
  });

  it('returns 400 when no assignable event was updated', async () => {
    mockedPool.query.mockResolvedValueOnce({ rows: [{ region: 'asia' }] });
    mockedPool.query.mockResolvedValueOnce({ rowCount: 0 });

    const req = { body: { userId: 'mod-1', eventId: 'evt-42' } };
    const res = createResponse();

    await handler(req as any, res as any);

    expect(mockedPool.query).toHaveBeenCalledTimes(2);
    expect(mockedPool.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('UPDATE events'),
      expect.any(Array),
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Event not found or cannot be assigned',
    });
  });

  it('returns 200 when acknowledge update succeeds', async () => {
    mockedPool.query.mockResolvedValueOnce({ rows: [{ region: 'asia' }] });
    mockedPool.query.mockResolvedValueOnce({ rowCount: 1 });

    const req = { body: { userId: 'mod-1', eventId: 'evt-42' } };
    const res = createResponse();

    await handler(req as any, res as any);

    expect(mockedPool.query).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Event assigned successfully',
    });
  });

  it('returns 500 when database throws', async () => {
    mockedPool.query.mockRejectedValueOnce(new Error('db failed'));

    const req = { body: { userId: 'mod-1', eventId: 'evt-42' } };
    const res = createResponse();

    await handler(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to update event data',
    });
  });
});
