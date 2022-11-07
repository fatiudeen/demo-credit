import supertest from 'supertest';
import express from '@app';
import { testData } from '@mocks/testData';

const app = express.instance();
let user: any;

beforeAll(async () => {
  await supertest(app).post('/api/v1/signup').send(testData.validUserData);
  await supertest(app)
    .post('/api/v1/signup')
    .send({ ...testData.validUserData, username: 'fatiudeen2' });
  user = (await supertest(app).post('/api/v1/signin').send(testData.validLoginData)).body.data;
});

beforeEach(async () => {
  await supertest(app)
    .post('/api/v1/wallets/fund')
    .send(testData.validFundData)
    .set({ Authorization: `Bearer ${user.token}` });
});

afterEach(async () => {
  await supertest(app)
    .post('/api/v1/wallets/withdraw')
    .send(testData.validWithdrawData)
    .set({ Authorization: `Bearer ${user.token}` });
});

describe('wallet API', () => {
  describe('POST /fund', () => {
    describe('given a valid user input data', () => {
      it('should return 201', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/v1/wallets/fund')
          .send(testData.validFundData)
          .set({ Authorization: `Bearer ${user.token}` });

        expect(statusCode).toBe(201);
        expect(body.success).toEqual(true);
        expect(body.data).toEqual(expect.objectContaining({ success: true }));
      });
    });
    describe('given an invalid user input data', () => {
      it('should return 400', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/v1/wallets/fund')
          .send(testData.invalidFundData)
          .set({ Authorization: `Bearer ${user.token}` });

        expect(statusCode).toBe(400);
        expect(body.success).toEqual(false);
      });
    });
  });

  describe('POST /withdraw', () => {
    describe('given the user has enough balance', () => {
      it('should send a successful debit reciept and return 201', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/v1/wallets/withdraw')
          .set({ Authorization: `Bearer ${user.token}` })
          .send(testData.validWithdrawData);

        expect(statusCode).toBe(201);
        expect(body.success).toEqual(true);
        expect(body.data).toEqual(expect.objectContaining({ success: true }));
      });
    });

    describe('given the user does not have enough balance', () => {
      it('should send a failed debit reciept and return 400', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/v1/wallets/withdraw')
          .set({ Authorization: `Bearer ${user.token}` })
          .send(testData.invalidBalanceWithdrawData);

        expect(statusCode).toBe(400);
        expect(body.success).toEqual(false);
        expect(body.error).toEqual(expect.objectContaining({ success: false }));
      });
    });

    describe('given the account number entered is invalid', () => {
      it('should send a validation error and return 400', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/v1/wallets/withdraw')
          .set({ Authorization: `Bearer ${user.token}` })
          .send(testData.invalidAccountNumberWithdrawData);

        expect(statusCode).toBe(400);
        expect(body.success).toEqual(false);
        expect(body.error).toEqual(expect.arrayContaining([expect.any(Object)]));
      });
    });
  });

  describe('POST /transfer', () => {
    describe('given a valid transfer data', () => {
      it('should send a successful debit reciept and return 201', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/v1/wallets/transfer')
          .set({ Authorization: `Bearer ${user.token}` })
          .send(testData.validTransferData);

        expect(statusCode).toBe(201);
        expect(body.success).toEqual(true);
        expect(body.data).toEqual(expect.objectContaining({ success: true }));
      });
    });

    describe('given an invalid data of a user that does not exist', () => {
      it('should send a failed debit reciept and return 400', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/v1/wallets/transfer')
          .set({ Authorization: `Bearer ${user.token}` })
          .send(testData.invalidUserTransferData);

        expect(statusCode).toBe(400);
        expect(body.success).toEqual(false);
        expect(body.error).toEqual(expect.objectContaining({ success: false }));
      });
    });

    describe('given an invalid data with insufficient balance', () => {
      it('should send a failed debit reciept and return 400', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/v1/wallets/transfer')
          .set({ Authorization: `Bearer ${user.token}` })
          .send(testData.invalidBalanceTransferData);

        expect(statusCode).toBe(400);
        expect(body.success).toEqual(false);
        expect(body.error).toEqual(expect.objectContaining({ success: false }));
      });
    });
  });

  describe('GET /history', () => {
    describe('given the user has made at least one transaction', () => {
      it('should send array of transactions and return 200', async () => {
        const { statusCode, body } = await supertest(app)
          .get('/api/v1/wallets/history')
          .set({ Authorization: `Bearer ${user.token}` });

        expect(statusCode).toBe(200);
        expect(body.success).toEqual(true);
        expect(body.data).toEqual(
          expect.arrayContaining([expect.objectContaining({ success: true })]),
        );
      });
    });
  });
});
