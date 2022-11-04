/* eslint-disable import/no-mutable-exports */
import { config } from 'dotenv';

if (process.env.NODE_ENV === 'local') {
  config({ path: `.env.${process.env.NODE_ENV}` });
} else config();

// eslint-disable-next-line object-curly-newline
export const { PORT, DOCS, JWT_KEY, JWT_TIMEOUT } = process.env;

export const MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Internal Server Error. Please try again!',
  INVALID_CREDENTIALS: 'Invalid Credentials',
  LOGIN_SUCCESS: 'Login Success',
  UNAUTHORIZED: 'Unauthorized access',
  INPUT_VALIDATION_ERROR: 'Input Validation Error',
  INVALID_REQUEST: 'Invalid Request',
  ROUTE_DOES_NOT_EXIST: 'Sorry Route does not exists',
  SERVER_STARTED: 'Server running on port',
  DB_CONNECTED: 'DB Connected',
  INVALID_EMAIL: 'invalid email',
  USER_EXISTS: 'user exists',
  USER_DOES_NOT_EXISTS: 'user does not exists',
  INVALID_RECORD: 'record does not exist',
  NEW_PASSWORD: 'you have successfully logged in and your password as been sent to you',
  FAILED_TXN: 'The transaction is not a failed Transaction... cannot retry',
};