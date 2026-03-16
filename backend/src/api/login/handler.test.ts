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

describe('login handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for missing userId', async () => {
    const req = { body: { region: 'asia' } };
    const res = createResponse();

    await handler(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'User ID body parameter is required',
    });
    expect(mockedPool.query).not.toHaveBeenCalled();
  });

  it('returns 400 for missing region', async () => {
    const req = { body: { userId: 'mod-1' } };
    const res = createResponse();

    await handler(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Region body parameter is required',
    });
    expect(mockedPool.query).not.toHaveBeenCalled();
  });

  it('returns 400 for invalid region', async () => {
    const req = { body: { userId: 'mod-1', region: 'antarctica' } };
    const res = createResponse();

    await handler(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Region is invalid' });
    expect(mockedPool.query).not.toHaveBeenCalled();
  });

  it('returns 401 when user not found in region', async () => {
    mockedPool.query.mockResolvedValueOnce({ rows: [] });

    const req = { body: { userId: 'mod-1', region: 'asia' } };
    const res = createResponse();

    await handler(req as any, res as any);

    expect(mockedPool.query).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User not found in specified region',
    });
  });

  it('returns 200 when login succeeds', async () => {
    mockedPool.query.mockResolvedValueOnce({ rows: [{ '?column?': 1 }] });

    const req = { body: { userId: 'mod-1', region: 'asia' } };
    const res = createResponse();

    await handler(req as any, res as any);

    expect(mockedPool.query).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Login successful' });
  });

  it('returns 500 on database error', async () => {
    mockedPool.query.mockRejectedValueOnce(new Error('db failed'));

    const req = { body: { userId: 'mod-1', region: 'asia' } };
    const res = createResponse();

    await handler(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to load users data',
    });
  });
});
