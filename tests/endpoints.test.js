// tests/endpoints.test.js
import request from 'supertest';
import app from '../app'; // Assuming your Express app instance is exported as 'app'

describe('Endpoint Tests', () => {
  test('GET /status', async () => {
    const res = await request(app).get('/status');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'OK' });
  });

  test('GET /stats', async () => {
    const res = await request(app).get('/stats');
    expect(res.status).toBe(200);
    expect(res.body.users).toBeDefined();
    expect(res.body.files).toBeDefined();
  });

  // Add tests for other endpoints similarly
});

