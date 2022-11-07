import supertest from 'supertest';
import express from '@app';
import { testData } from '@mocks/testData';

const app = express.instance();

let user: any;
beforeAll(async () => {
  await supertest(app).post('/api/v1/signup').send(testData.validUserData);
  user = (await supertest(app).post('/api/v1/signin').send(testData.validLoginData)).body.data;
});

describe('users API', () => {
  describe('GET /users', () => {
    describe('given user database is not empty', () => {
      it('should 200 and an array users', async () => {
        const { statusCode, body } = await supertest(app)
          .get('/api/v1/users')
          .set({ Authorization: `Bearer ${user.token}` });

        expect(statusCode).toBe(200);
        expect(body.success).toEqual(true);
        expect(body.data).toEqual(expect.arrayContaining([expect.any(Object)]));
      });
    });
  });

  describe('GET /users/me', () => {
    describe('given the token is valid', () => {
      it('should return 200 and the current user', async () => {
        const { statusCode, body } = await supertest(app)
          .get('/api/v1/users/me')
          .set({ Authorization: `Bearer ${user.token}` });

        expect(statusCode).toBe(200);
        expect(body.success).toEqual(true);
        expect(body.data).toEqual(
          expect.objectContaining({
            ...testData.validLoginData,
            password: expect.any(String),
          }),
        );
      });
    });
  });

  describe('GET /users/:userId', () => {
    describe('given the user exists', () => {
      it('should return 200 and array', async () => {
        const { statusCode, body } = await supertest(app)
          .get(`/api/v1/users/${user.user.id}`)
          .set({ Authorization: `Bearer ${user.token}` });

        expect(statusCode).toBe(200);
        expect(body.success).toEqual(true);
        expect(body.data).toEqual(
          expect.objectContaining({
            ...testData.validLoginData,
            password: expect.any(String),
          }),
        );
      });
    });

    describe('given the user does not exists', () => {
      it('should return 400', async () => {
        const { statusCode, body } = await supertest(app)
          .get(`/api/v1/users/${testData.randomId}`)
          .set({ Authorization: `Bearer ${user.token}` });

        expect(statusCode).toBe(400);
        expect(body.success).toEqual(false);
        expect(body).toEqual(expect.objectContaining({ error: 'record does not exist' }));
      });
    });
  });
});
