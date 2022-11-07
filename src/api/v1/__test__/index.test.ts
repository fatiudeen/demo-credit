import supertest from 'supertest';
import app from '@app';

describe('index test', () => {
  describe('given the server is running', () => {
    it('should return 200', async () => {
      const { statusCode } = await supertest(app.instance()).get('/');

      expect(statusCode).toBe(200);
    });
  });
  describe('given the route does not exist', () => {
    it('should return 404', async () => {
      const { statusCode } = await supertest(app.instance()).get('/does-not-exist');

      expect(statusCode).toBe(404);
    });
  });
  describe('given the docs link is not undefined', () => {
    it('should return 404', async () => {
      const { statusCode } = await supertest(app.instance()).get('/docs');

      expect(statusCode).toBe(302);
    });
  });

  describe('given a unauthorized user is trying to access a proteted route', () => {
    it('should return 401', async () => {
      const { statusCode } = await supertest(app.instance()).get('/api/v1/users');

      expect(statusCode).toBe(401);
    });
  });
});
