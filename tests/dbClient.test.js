// tests/dbClient.test.js
import dbClient from '../utils/db';

describe('Database Client Tests', () => {
  test('Database client connection', async () => {
    const isConnected = await dbClient.isConnected();
    expect(isConnected).toBe(true);
  });

  // Add more tests for database operations if needed
});

