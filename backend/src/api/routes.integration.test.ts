import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import createApp from '../app.ts';

vi.mock('../db.ts', () => ({
  default: {
    query: vi.fn(),
  },
}));

type MockedPool = {
  query: ReturnType<typeof vi.fn>;
};

async function getMockedPool(): Promise<MockedPool> {
  const mod = await import('../db.ts');
  return mod.default as unknown as MockedPool;
}

describe('api routes integration', () => {
  beforeEach(async () => {
    const mockedPool = await getMockedPool();
    mockedPool.query.mockReset();
  });

  it('POST /login returns 400 for invalid payload', async () => {
    const app = createApp();
    const response = await request(app)
      .post('/login')
      .send({ userId: 'mod-1' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Region body parameter is required',
    });
  });

  it('POST /login returns success for valid user', async () => {
    const mockedPool = await getMockedPool();
    mockedPool.query.mockResolvedValueOnce({ rows: [{ '?column?': 1 }] });

    const app = createApp();
    const response = await request(app)
      .post('/login')
      .send({ userId: 'mod-1', region: 'asia' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Login successful' });
  });

  it('POST /login returns 401 when user is not found', async () => {
    const mockedPool = await getMockedPool();
    mockedPool.query.mockResolvedValueOnce({ rows: [] });

    const app = createApp();
    const response = await request(app)
      .post('/login')
      .send({ userId: 'mod-1', region: 'asia' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'User not found in specified region',
    });
  });

  it('POST /login returns 500 on db error', async () => {
    const mockedPool = await getMockedPool();
    mockedPool.query.mockRejectedValueOnce(new Error('db failed'));

    const app = createApp();
    const response = await request(app)
      .post('/login')
      .send({ userId: 'mod-1', region: 'asia' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to load users data' });
  });

  it('GET /events returns 400 when userId is missing', async () => {
    const app = createApp();
    const response = await request(app).get('/events');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'User ID query parameter is required',
    });
  });

  it('GET /events returns 401 when user is not found', async () => {
    const mockedPool = await getMockedPool();
    mockedPool.query.mockResolvedValueOnce({ rows: [] });

    const app = createApp();
    const response = await request(app).get('/events').query({ userId: 'mod-1' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Request unauthorized' });
  });

  it('GET /events returns grouped events', async () => {
    const mockedPool = await getMockedPool();
    mockedPool.query
      .mockResolvedValueOnce({ rows: [{ region: 'asia' }] })
      .mockResolvedValueOnce({ rows: [{ event_id: '1', region: 'asia' }] })
      .mockResolvedValueOnce({
        rows: [
          {
            event_id: '2',
            region: 'asia',
            claimed_at: new Date('2026-01-01T10:00:00.000Z'),
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ event_id: '3', region: 'asia' }] });

    const app = createApp();
    const response = await request(app).get('/events').query({ userId: 'mod-1' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
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

  it('GET /events returns 500 on db error', async () => {
    const mockedPool = await getMockedPool();
    mockedPool.query.mockRejectedValueOnce(new Error('db failed'));

    const app = createApp();
    const response = await request(app).get('/events').query({ userId: 'mod-1' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to load events data' });
  });

  it('PUT /claim returns 400 for invalid payload', async () => {
    const app = createApp();
    const response = await request(app)
      .put('/claim')
      .send({ userId: 'mod-1', eventId: 'abc' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Event ID body parameter is required',
    });
  });

  it('PUT /claim returns 401 when user is not found', async () => {
    const mockedPool = await getMockedPool();
    mockedPool.query.mockResolvedValueOnce({ rows: [] });

    const app = createApp();
    const response = await request(app)
      .put('/claim')
      .send({ userId: 'mod-1', eventId: 42 });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Request unauthorized' });
  });

  it('PUT /claim returns 400 when event is not claimable', async () => {
    const mockedPool = await getMockedPool();
    mockedPool.query
      .mockResolvedValueOnce({ rows: [{ region: 'asia' }] })
      .mockResolvedValueOnce({ rowCount: 0 });

    const app = createApp();
    const response = await request(app)
      .put('/claim')
      .send({ userId: 'mod-1', eventId: 42 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Event not found or cannot be claimed',
    });
  });

  it('PUT /claim returns success when update succeeds', async () => {
    const mockedPool = await getMockedPool();
    mockedPool.query
      .mockResolvedValueOnce({ rows: [{ region: 'asia' }] })
      .mockResolvedValueOnce({ rowCount: 1 });

    const app = createApp();
    const response = await request(app)
      .put('/claim')
      .send({ userId: 'mod-1', eventId: 42 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Event claimed successfully' });
  });

  it('PUT /claim returns 500 on db error', async () => {
    const mockedPool = await getMockedPool();
    mockedPool.query.mockRejectedValueOnce(new Error('db failed'));

    const app = createApp();
    const response = await request(app)
      .put('/claim')
      .send({ userId: 'mod-1', eventId: 42 });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to update event data' });
  });

  it('PUT /acknowledge returns 400 for invalid payload', async () => {
    const app = createApp();
    const response = await request(app)
      .put('/acknowledge')
      .send({ userId: 'mod-1', eventId: 'abc' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Event ID body parameter is required',
    });
  });

  it('PUT /acknowledge returns 401 when user is not found', async () => {
    const mockedPool = await getMockedPool();
    mockedPool.query.mockResolvedValueOnce({ rows: [] });

    const app = createApp();
    const response = await request(app)
      .put('/acknowledge')
      .send({ userId: 'mod-1', eventId: 42 });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Request unauthorized' });
  });

  it('PUT /acknowledge returns 400 when event is not assignable', async () => {
    const mockedPool = await getMockedPool();
    mockedPool.query
      .mockResolvedValueOnce({ rows: [{ region: 'asia' }] })
      .mockResolvedValueOnce({ rowCount: 0 });

    const app = createApp();
    const response = await request(app)
      .put('/acknowledge')
      .send({ userId: 'mod-1', eventId: 42 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Event not found or cannot be assigned',
    });
  });

  it('PUT /acknowledge returns success when update succeeds', async () => {
    const mockedPool = await getMockedPool();
    mockedPool.query
      .mockResolvedValueOnce({ rows: [{ region: 'asia' }] })
      .mockResolvedValueOnce({ rowCount: 1 });

    const app = createApp();
    const response = await request(app)
      .put('/acknowledge')
      .send({ userId: 'mod-1', eventId: 42 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Event assigned successfully' });
  });

  it('PUT /acknowledge returns 500 on db error', async () => {
    const mockedPool = await getMockedPool();
    mockedPool.query.mockRejectedValueOnce(new Error('db failed'));

    const app = createApp();
    const response = await request(app)
      .put('/acknowledge')
      .send({ userId: 'mod-1', eventId: 42 });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to update event data' });
  });
});
