const request = require('supertest');
const app = require('../backend/src/server');

test('Login fails without credentials', async () => {
  const res = await request(app).post('/api/auth/login');
  expect(res.statusCode).toBe(401);
});
