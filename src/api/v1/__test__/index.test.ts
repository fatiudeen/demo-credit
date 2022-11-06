import supertest from 'supertest';
import app from '@app';

describe('index test', () => {
  it('should return 200', async () => {
    const { statusCode } = await supertest(app.instance()).get('/');

    expect(statusCode).toBe(200);
  });
});
