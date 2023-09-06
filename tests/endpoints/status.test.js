// tests/endpoints/status.test.js
const request = require('supertest');
const app = require('../../alx-files_manager/tests/endpoints/status.test.js'); // Import your Express app instance

describe('GET /status', () => {
  it('responds with status 200 and "OK"', (done) => {
    request(app)
      .get('/status')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual({ status: 'OK' });
        done();
      });
  });
});

