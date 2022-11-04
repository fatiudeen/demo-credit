/* eslint-disable object-curly-newline */
import type { Knex } from 'knex';
import { config } from 'dotenv';

if (process.env.NODE_ENV === 'local') {
  config({ path: `../../.env.${process.env.NODE_ENV}` });
} else config({ path: '../../.env' });

// eslint-disable-next-line object-curly-newline
export const { PORT, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT, DOCS, JWT_KEY, JWT_TIMEOUT } =
  process.env;
const knexConfig: Knex.Config = {
  client: 'mysql',
  connection: {
    host: <string>DB_HOST,
    port: <number>(<unknown>DB_PORT),
    user: <string>DB_USER,
    password: <string>DB_PASSWORD,
    database: <string>DB_NAME,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};

export default knexConfig;
