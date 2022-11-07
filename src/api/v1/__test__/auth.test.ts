import supertest from 'supertest';
import express from '@app';
import { testData } from '@mocks/testData';

const app = express.instance();

describe('auth API', () => {
  describe('POST /signup', () => {
    describe('given a valid user input data', () => {
      it('should return 201', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/v1/signup')
          .send(testData.validUserData);

        expect(statusCode).toBe(201);
        expect(body.success).toEqual(true);
        expect(body.data).toEqual(
          expect.objectContaining({ ...testData.validUserData, password: expect.any(String) }),
        );
      });
    });
    describe('given an incomplete user input data', () => {
      it('should return 400', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/v1/signup')
          .send(testData.inCompleteUserData);

        expect(statusCode).toBe(400);
        expect(body.success).toEqual(false);
      });
    });
  });

  describe('GET /signin', () => {
    describe('given the user is not empty', () => {
      it('should send user data and jwt token 201', async () => {
        let validUserId: string;
        await supertest(app).post('/api/v1/signup').send(testData.validUserData);

        const { statusCode, body } = await supertest(app)
          .post('/api/v1/signin')
          .send(testData.validLoginData);

        expect(statusCode).toBe(201);
        expect(body.success).toEqual(true);
        expect(body.data).toEqual(
          expect.objectContaining({
            user: expect.objectContaining({
              ...testData.validLoginData,
              password: expect.any(String),
            }),
          }),
        );
      });
    });

    describe('given the user does not exist or incorrect data', () => {
      it('should return 400', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/v1/signup/')
          .send(testData.invalidLoginData);

        expect(statusCode).toBe(400);
        expect(body.success).toEqual(false);
        expect(body).toEqual(expect.objectContaining({ error: expect.any(Array) }));
      });
    });
  });
});
