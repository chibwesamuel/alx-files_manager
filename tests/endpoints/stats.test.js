// tests/endpoints/stats.test.js
const request = require('supertest');
const app = require('alx-files_manager/tests/endpoints/stats.test.js'); // Import your Express app instance

describe('GET /stats', () => {
  it('responds with status 200 and statistics JSON', (done) => {
    request(app)
      .get('/stats')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        // Add more specific assertions here based on your expected statistics format.
        expect(res.body).toHaveProperty('totalUsers');
        expect(res.body).toHaveProperty('activeUsers');
        expect(res.body).toHaveProperty('fileCount');
        done();
      });
  });
});

