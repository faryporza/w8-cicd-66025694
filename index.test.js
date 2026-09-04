const request = require('supertest');
const app = require('./index');

describe('Application Endpoints', () => {
  // Test 1: Verify root endpoint message
  test('GET / returns 200 and greeting message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, Nina! This test should fail.');
  });

  // Test 2: Verify health check endpoint
  test('GET /health returns 200 and ok status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      message: 'Service is healthy'
    });
  });

  // Test 3: Verify 404 for undefined routes
  test('GET /notfound returns 404', async () => {
    const response = await request(app).get('/notfound');
    expect(response.status).toBe(404);
  });
});
